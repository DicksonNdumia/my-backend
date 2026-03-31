import Pool from 'pg'

const pool = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,

    
});

export default pool;
