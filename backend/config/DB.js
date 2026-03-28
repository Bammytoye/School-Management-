import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    // ✅ Add these for connection pooling
    max: 20,  // Maximum number of clients
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
})

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err.message)
})

export default pool
