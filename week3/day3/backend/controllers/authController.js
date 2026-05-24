const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set. Using development fallback secret (do not use in production)",
  );
}

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ errors: [{ msg: err.message || "Server error" }] });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // Return jsonwebtoken
    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error("JWT sign error:", err);
          return res
            .status(500)
            .json({ errors: [{ msg: "Token generation failed" }] });
        }

        res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
          },
        });
      },
    );
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ errors: [{ msg: err.message || "Server error" }] });
  }
};

module.exports = {
  register,
  login,
};
