import mysql from 'mysql2/promise';

const connectionConfig = {
  host: process.env.DB_HOST || 'database-1.ci4vpdou2rym.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'wi9=b!fMMq8W$~U',
  database: process.env.DB_NAME || 'tienda_online',
  ssl: {
    rejectUnauthorized: false
  }
};

export async function getConnection() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    return connection;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
}

export async function executeQuery(query: string, params: unknown[] = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  } finally {
    await connection.end();
  }
}
