const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body

            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required: username, email, password'
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                })
            }

            const existingUser = await db.query(
                'SELECT * FROM users WHERE email = $1 OR username = $2',
                [email, username]
            )

            if (existingUser.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists'
                })
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            const newUser = await db.query(
                `INSERT INTO users (username, email, password) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, username, email, created_at`,
                [username, email, hashedPassword]
            )

            const token = jwt.sign(
                {
                    userId: newUser.rows[0].id,
                    username: newUser.rows[0].username
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            )

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: newUser.rows[0],
                    token
                }
            })

        } catch (error) {
            console.error('Registration error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                })
            }

            const userResult = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            )

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                })
            }

            const user = userResult.rows[0]
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                })
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            )

            const { password: _, ...userWithoutPassword } = user

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token
                }
            })

        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async getMe(req, res) {
        try {
            const userResult = await db.query(
                'SELECT id, username, email, created_at FROM users WHERE id = $1',
                [req.user.userId]
            )

            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                })
            }

            res.json({
                success: true,
                data: {
                    user: userResult.rows[0]
                }
            })

        } catch (error) {
            console.error('Get me error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = new AuthController()