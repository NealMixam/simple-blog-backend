// const path = require('path')
// require('dotenv').config({
//     path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
// })
//
// const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'JWT_SECRET']
// requiredEnvVars.forEach(envVar => {
//     if (!process.env[envVar]) {
//         throw new Error(`Missing required environment variable: ${envVar}`)
//     }
// })
//
// module.exports = {
//     database: {
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT || 5432,
//         database: process.env.DB_NAME,
//     },
//     server: {
//         port: process.env.PORT || 8080,
//         nodeEnv: process.env.NODE_ENV || 'development',
//     },
//     jwt: {
//         secret: process.env.JWT_SECRET,
//     }
// }
const path = require('path')
const fs = require('fs')

const nodeEnv = process.env.NODE_ENV || 'development'
const envPath = path.resolve(__dirname, `.env.${nodeEnv}`)

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath })
    console.log(`✅ Loaded environment: ${nodeEnv}`)
} else {
    console.warn(`⚠️  Environment file not found: ${envPath}`)
    require('dotenv').config()
}

const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'JWT_SECRET']
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`❌ Missing environment variable: ${envVar}`)
        process.exit(1)
    }
})

module.exports = {
    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
    },
    server: {
        port: process.env.PORT || 8080,
        nodeEnv: nodeEnv,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
}