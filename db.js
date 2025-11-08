// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: "postgres",
//     password: "root",
//     host: "localhost",
//     port: 5432,
//     database: "blog_postgres"
// })
//
// module.exports = pool;
// db.js
// const { Pool } = require('pg')
// const config = require('./config')
//
// const pool = new Pool(config.database)
//
// pool.on('connect', () => {
//     console.log(`✅ Connected to PostgreSQL: ${config.database.database} (${config.server.nodeEnv})`)
// })
//
// pool.on('error', (err) => {
//     console.error('❌ Database connection error:', err)
//     process.exit(-1)
// })
//
// module.exports = pool
const { Pool } = require('pg')
const config = require('./config')

const pool = new Pool(config.database)

pool.on('connect', () => {
    console.log(`✅ Connected to PostgreSQL: ${config.database.database} (${config.server.nodeEnv})`)
})

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err)
    process.exit(-1)
})

module.exports = pool