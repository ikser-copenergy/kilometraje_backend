import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z',
  dateStrings: ['DATE','DATETIME']
});

export async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    connection.release();
  } catch (error: any) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1); 
  }
}
