const express = require('express');
const pool = require('./pgdb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5006;
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database:'mydatabase',
//     password: String('Upenpostgresql'),
//     port: 5432,
//   });

console.log("Database Password:", process.env.DB_PASS || "Password is undefined!");
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

// User Registration (Signup)
// app.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Hash password before storing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await pool.query(
//       'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
//       [username, hashedPassword]
//     );

//     res.json({ message: "User registered successfully", user: newUser.rows[0] });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("🔹 Received login request:", username, password);

        // 1. Check if user exists in the database
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log("🔹 Query result:", result.rows);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        console.log("🔹 Found user:", user);

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔹 Password match result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

  

// Start Server
app.listen(5006, () => {
  console.log('Server running on port 5006');
});
