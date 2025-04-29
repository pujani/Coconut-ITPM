const express = require("express");
const router = express.Router();
const authuser = require("../model/authuser");
const bcrypt = require("bcryptjs");

const authMiddleware = (req, res, next) => {
    if (!req.session.authusern) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

const adminMiddleware = (req, res, next) => {
    if (req.session.authusern?.Urole !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
};


router.get("/test5", (req, res) => res.send("Hello from authuser"));

router.post("/register", async (req, res) => {
    try {
        const { UName, UEmail, Uaddress, Upassword, Urole } = req.body;

        let existingUser = await authuser.findOne({ UEmail });
        if (existingUser) {
            return res.status(400).json({ msg: "User already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Upassword, salt);

        const userRole = Urole && ["admin", "user"].includes(Urole) ? Urole : "user";

        const newUser = new authuser({
            UName,
            UEmail,
            Uaddress,
            Upassword: hashedPassword,
            Urole: userRole,
        });

        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: "User registration failed", error: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { UEmail, Upassword } = req.body;

        const user = await authuser.findOne({ UEmail });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(Upassword, user.Upassword);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        req.session.authusern = { id: user.id, UEmail: user.UEmail, UName: user.UName, Urole: user.Urole };

        res.status(200).json({ msg: "Login successful", authusern: req.session.authusern });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


router.get("/profile", async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const user = await authuser.findById(req.session.authusern.id).select("-Upassword");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ msg: "Logout failed" });
        }
        res.status(200).json({ msg: "Logout successful" });
    });
});

// authuser route fix
router.get('/admins', authMiddleware, async (req, res) => {
    try {
        const admins = await authuser.find({ Urole: 'admin' }, 'UName _id');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add users endpoint// authuser route
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await authuser.find({}, 'UName _id Urole');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
