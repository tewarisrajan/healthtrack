const User = require("../models/User");
const Record = require("../models/Record");
const EmergencyProfile = require("../models/EmergencyProfile");

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

module.exports = seedData;
