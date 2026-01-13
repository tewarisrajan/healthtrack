// healthtrack-backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Models (NeDB Datastores)
const User = require("./models/User");
const Record = require("./models/Record");
const EmergencyProfile = require("./models/EmergencyProfile");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// Seed Data (for demo purposes)
// ─────────────────────────────────────────
const seedData = async () => {
  try {
    const userCount = await User.countAsync({});
    if (userCount === 0) {
      console.log("Creating seed data...");
      // Create user
      const demoUser = await User.insertAsync({
        name: "Demo User",
        email: "demo@healthtrack.com",
        password: "demo123", // Still plain text for demo
        abhaId: "12-3456-7890-1234",
      });

      // Create sample record
      await Record.insertAsync({
        user: demoUser._id,
        title: "CBC Lab Report",
        type: "LAB_REPORT",
        providerName: "Apollo Diagnostics",
        tags: ["blood", "cbc"],
        fileUrl: null,
        blockchainVerified: true,
        createdAt: new Date(),
      });

      // Create sample emergency profile
      await EmergencyProfile.insertAsync({
        user: demoUser._id,
        name: "Demo User",
        bloodGroup: "B+",
        allergies: ["Penicillin"],
        chronicConditions: ["Asthma"],
        medications: ["Inhaler (Salbutamol)"],
        emergencyContacts: [
          {
            name: "Mother",
            relation: "Parent",
            phone: "+91-98XXXXXX01",
          },
        ],
        updatedAt: new Date(),
      });
      console.log("Seed data created successfully");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

// Run seed on startup (async, don't block server start)
// NeDB autoloads, so we can run this immediately
seedData();

// ─────────────────────────────────────────
// 2. Auth: POST /api/login
// ─────────────────────────────────────────

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await User.findOneAsync({ email, password });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // In real world, you would send a JWT here.
    // For demo, just send user info + fake token.
    const fakeToken = "demo-token-" + user._id;

    return res.json({
      success: true,
      token: fakeToken,
      user: {
        id: user._id, // Frontend might expect 'id'
        name: user.name,
        email: user.email,
        abhaId: user.abhaId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─────────────────────────────────────────
// 3. Records API
//    GET all, POST new, GET by id, DELETE
// ─────────────────────────────────────────

// Get all records for a user
app.get("/api/users/:userId/records", async (req, res) => {
  const { userId } = req.params;
  try {
    const records = await Record.findAsync({ user: userId }).sort({ createdAt: -1 });
    const transformed = records.map(r => ({ ...r, id: r._id }));
    return res.json({ success: true, data: transformed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single record
app.get("/api/users/:userId/records/:recordId", async (req, res) => {
  const { userId, recordId } = req.params;
  try {
    const record = await Record.findOneAsync({ _id: recordId, user: userId });

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    return res.json({ success: true, data: { ...record, id: record._id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create new record (metadata only; file upload later)
app.post("/api/users/:userId/records", async (req, res) => {
  const { userId } = req.params;
  const body = req.body || {};

  if (!body.title || !body.type || !body.providerName) {
    return res.status(400).json({
      success: false,
      message: "title, type and providerName are required",
    });
  }

  try {
    const newRecord = await Record.insertAsync({
      user: userId,
      title: body.title,
      type: body.type,
      providerName: body.providerName,
      tags: body.tags || [],
      fileUrl: body.fileUrl || null,
      blockchainVerified: !!body.blockchainVerified,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, data: { ...newRecord, id: newRecord._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete record
app.delete("/api/users/:userId/records/:recordId", async (req, res) => {
  const { userId, recordId } = req.params;

  try {
    // NeDB removeAsync returns numRemoved
    const record = await Record.findOneAsync({ _id: recordId, user: userId });
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    await Record.removeAsync({ _id: recordId, user: userId }, {});

    return res.json({ success: true, data: { ...record, id: record._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─────────────────────────────────────────
// 4. Emergency profile API
// ─────────────────────────────────────────

// GET minimal emergency info
app.get("/api/emergency/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await EmergencyProfile.findOneAsync({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Emergency profile not found",
      });
    }

    return res.json({
      success: true,
      data: {
        name: profile.name,
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies,
        chronicConditions: profile.chronicConditions,
        medications: profile.medications,
        emergencyContacts: profile.emergencyContacts,
        lastUpdated: profile.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST/PUT update emergency profile
app.post("/api/emergency/:userId", async (req, res) => {
  const { userId } = req.params;
  const body = req.body || {};

  if (!body.bloodGroup) {
    return res
      .status(400)
      .json({ success: false, message: "bloodGroup is required" });
  }

  try {
    const profileData = {
      user: userId,
      name: body.name || "Unknown User",
      bloodGroup: body.bloodGroup,
      allergies: body.allergies || [],
      chronicConditions: body.chronicConditions || [],
      medications: body.medications || [],
      emergencyContacts: body.emergencyContacts || [],
      updatedAt: new Date(),
    };

    // NeDB updateAsync: query, update, options
    // options: { upsert: true, returnUpdatedDocs: true }
    // NOTE: standard NeDB does not support returnUpdatedDocs in async call easily unless @seald-io/nedb specifies it.
    // @seald-io/nedb async update returns { numAffected, affectedDocuments, upsert }

    const { affectedDocuments } = await EmergencyProfile.updateAsync(
      { user: userId },
      { $set: profileData },
      { upsert: true, returnUpdatedDocs: true }
    );

    // If upsert happened, affectedDocuments is the doc. If update, it might be null depending on version, 
    // but @seald-io/nedb supports it. Let's safeguard.
    // It seems `returnUpdatedDocs` is supported.

    return res.json({
      success: true,
      message: "Emergency profile updated",
      data: affectedDocuments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─────────────────────────────────────────
// 5. Root
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("HealthTrack backend is running with NeDB (Embedded DB)");
});

app.listen(PORT, () => {
  console.log(`✅ HealthTrack backend running at http://localhost:${PORT}`);
});
