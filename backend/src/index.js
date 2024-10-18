import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg'; // PostgreSQL package
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; // Import body-parser

dotenv.config();

// Get the directory name from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; // Use the specified port

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Middleware for URL-encoded data

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../../dist')));

// Database configuration
const { Client } = pkg;

const db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// Connect to the database
db.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');
    })
    .catch(err => {
        console.error('Connection error:', err.message); // Log specific error message
        process.exit(1); // Exit if the connection fails
    });

// Serve the React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Serve the React app for /signup
app.get('/signup', (req, res) => {
    console.log('Serving signup page');
    res.sendFile(path.join(__dirname, '../../dist/index.html'));  // Ensure this serves your React app
});

// Serve the React app for /login
app.get('/login', (req, res) => {
    console.log('Serving login page');
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// SignUp Endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic input validation
    console.log('Received signup request:', { username, email });
    if (!username || !email || !password) {
        console.log('Input validation failed: All fields are required.');
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        console.log('Checking if user already exists in the database');
        const existingUser = await db.query('SELECT * FROM credentials WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            console.log('Email already exists, sending error response');
            return res.status(400).json({ error: 'Email already exists. Try logging in.' });
        }

        console.log('Hashing the password');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Inserting new user into the database');
        const result = await db.query(
            'INSERT INTO credentials (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );

        console.log('User successfully registered with ID:', result.rows[0].id);
        return res.status(201).json({ id: result.rows[0].id, message: 'Signup successful, redirecting to dashboard' });
    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json({ error: 'Failed to create account.' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Basic input validation
    console.log('Received login request:', { username });
    if (!username || !password) {
        console.log('Input validation failed: Username and password are required.');
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Find the user by username
        console.log(`Querying database for user: ${username}`);
        const result = await db.query('SELECT * FROM credentials WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            console.log('User found in the database');
            const user = result.rows[0];

            // Compare the password
            console.log('Comparing provided password with hashed password');
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log('Password match, login successful');
                return res.status(200).json({ message: 'Login successful, redirecting to dashboard', userId: user.id });
            } else {
                console.log('Password does not match, login failed');
                return res.status(401).json({ error: 'Invalid credentials.' });
            }
        } else {
            console.log('User not found in the database');
            return res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'Failed to login.' });
    }
});

// Endpoint to get profile by ID
app.get('/api/profile/:patientId', async (req, res) => {
    const { patientId } = req.params;
    console.log(`Received request to get profile with patient ID: ${patientId}`); // Debugging statement
    try {
        const result = await db.query('SELECT * FROM profile WHERE patientid = $1', [patientId]);
        if (result.rows.length > 0) {
            console.log('Profile retrieved successfully:', result.rows[0]); // Debugging statement
            res.json(result.rows[0]);
        } else {
            console.log(`Profile not found for patient ID: ${patientId}`); // Debugging statement
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile Endpoint
app.put('/api/profile/:patientId', async (req, res) => {
    const { patientId } = req.params;
    const { name, email, phone, age, address, dob } = req.body;

    console.log(`Received update profile request for patient ID: ${patientId}`); // Debugging statement
    console.log('Profile update data:', { name, email, phone, age, address, dob }); // Debugging statement

    try {
        const result = await db.query(
            `UPDATE profile SET 
                name = $1, 
                email = $2, 
                phone = $3, 
                age = $4, 
                address = $5, 
                dob = $6 
            WHERE patientid = $7 RETURNING *`,
            [name, email, phone, age, address, dob, patientId]
        );

        if (result.rows.length > 0) {
            console.log(`Profile updated successfully for patient ID: ${patientId}`); // Debugging statement
            res.status(200).json(result.rows[0]);
        } else {
            console.log(`Profile not found for patient ID: ${patientId}`); // Debugging statement
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (err) {
        console.error('Error during profile update:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
