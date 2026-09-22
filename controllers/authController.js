const bcrypt = require("bcrypt");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email,password) VALUES (?, ?, ?)";

        db.query(sql, [name, email, hashedPassword], (err, results) => {
            if (err) {
                console.log('Error creating user;', err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(201).json({
                    message: 'User created successfully',
                    userId: results.insertId
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {
            if (err) {
                conole.log("Error Fetching user", err);
                return res.status(500).json({ error: "Internal login Server Error" })
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" })
            }
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                }, process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
                
            );
            res.status(200).json({
                message: "User logged in successfully",
                token,
                userId: user.id
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = { registerUser , loginUser };