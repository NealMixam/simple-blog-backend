const jwt = require('jsonwebtoken')
const config = require('../config')

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        const decoded = jwt.verify(token, config.jwt.secret)
        req.user = decoded
        next()
    } catch (error) {
        console.error('Token verification error:', error)
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        })
    }
}

module.exports = authMiddleware