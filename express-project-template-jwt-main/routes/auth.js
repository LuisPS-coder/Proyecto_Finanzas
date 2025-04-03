// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const prisma = require("../prisma");
const isAuthenticated = require("../middlewares/isAuthenticated");

const cookieSettings = {
  httpOnly: true,
  secure: false, 
  sameSite: "strict", 
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const jwtToken = jwt.sign({ sub: email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", jwtToken, cookieSettings)
      .status(201)
      .json({ message: "User created" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/login", async (req, res, next) => {
  try { 
    const jwtToken = jwt.sign({ sub: req.body.email }, process.env.JWT_SECRET);
    res
      .cookie("token", jwtToken, cookieSettings)
      .send("Cookie is set");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/logged-in", passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
