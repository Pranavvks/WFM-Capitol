import { Pool } from 'pg'

const pool = new Pool({
  user: 'User',
  host: 'Host',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

export default pool