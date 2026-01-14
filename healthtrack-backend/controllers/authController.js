const User = require("../models/User");

// POST /api/login
const login = async (req, res) => {
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

        // Demo token
        const fakeToken = "demo-token-" + user._id;

        return res.json({
            success: true,
            token: fakeToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                abhaId: user.abhaId,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { login };
