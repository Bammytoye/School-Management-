import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import pool from './config/DB.js'

dotenv.config()

const seedDemoUser = async () => {
    try {
        const email = 'demo@school.com'
        const password = 'demo123'

        // check if user exists
        const existing = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (existing.rows.length > 0) {
            console.log('Demo user already exists')
            process.exit()
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // insert into Supabase
        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            ['Demo Admin', email, hashedPassword, 'admin']
        )

        console.log('✅ Demo user created successfully')
        console.log('Email: demo@school.com')
        console.log('Password: demo123')

        process.exit()

    } catch (err) {
        console.error('Error seeding demo user:', err)
        process.exit(1)
    }
}

seedDemoUser()