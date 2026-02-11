const User = require("../models/User");
const Record = require("../models/Record");
const EmergencyProfile = require("../models/EmergencyProfile");

const seedData = async () => {
    try {
        const userCount = await User.countAsync({});
        if (userCount === 0) {
            console.log("Creating seed data...");
            // Create Patient (Demo User)
            const demoUser = await User.insertAsync({
                name: "Demo User",
                email: "demo@healthtrack.com",
                password: "demo123",
                role: "PATIENT",
                abhaId: "12-3456-7890-1234",
            });

            // Create Doctor
            await User.insertAsync({
                name: "Dr. Sarah Smith",
                email: "doctor@healthtrack.com",
                password: "demo123",
                role: "DOCTOR",
                profile: {
                    specialization: "Cardiologist",
                    licenseNumber: "MED-99283",
                    hospital: "General Hospital"
                }
            });

            // Create Provider (Hospital Admin)
            await User.insertAsync({
                name: "General Hospital",
                email: "hospital@healthtrack.com",
                password: "demo123",
                role: "PROVIDER",
                profile: {
                    type: "HOSPITAL",
                    address: "123 Medical Way, New York",
                    registerId: "HOSP-NYC-441"
                }
            });

            // Create sample record for demo user
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
