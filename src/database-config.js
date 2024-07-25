import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Client} = pg

export const databaseClient = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

