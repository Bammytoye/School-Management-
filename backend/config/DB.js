import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
    console.error('PostgreSQL connection error:', err.message)
    process.exit(1)
})

export default pool