const familyMembers = require("../models/FamilyMember");

// GET /api/users/:userId/family
exports.getFamilyMembers = (req, res) => {
    const { userId } = req.params;
    familyMembers.find({ user: userId }, (err, docs) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: docs });
    });
};

// POST /api/users/:userId/family
exports.addFamilyMember = (req, res) => {
    const { userId } = req.params;
    const { name, relation, age, hasEmergencyProfile } = req.body;

    if (!name || !relation || !age) {
        return res.status(400).json({ success: false, message: "Name, relation, and age are required" });
    }

    const newMember = {
        user: userId,
        name,
        relation,
        age: Number(age),
        hasEmergencyProfile: !!hasEmergencyProfile,
        createdAt: new Date().toISOString(),
    };

    familyMembers.insert(newMember, (err, doc) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, data: doc });
    });
};

// PATCH /api/users/:userId/family/:memberId/toggle-emergency
exports.toggleFamilyEmergency = (req, res) => {
    const { memberId } = req.params;

    familyMembers.findOne({ _id: memberId }, (err, member) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!member) return res.status(404).json({ success: false, message: "Family member not found" });

        familyMembers.update(
            { _id: memberId },
            { $set: { hasEmergencyProfile: !member.hasEmergencyProfile } },
            { returnUpdatedDocs: true },
            (updateErr, numCount, updatedDoc) => {
                if (updateErr) return res.status(500).json({ success: false, message: updateErr.message });
                res.json({ success: true, data: updatedDoc });
            }
        );
    });
};
