const { Pool } = require('pg');

const pool = new Pool({
    host: '/cloudsql/y-test-import-csv:us-central1:requests-db',
    database: 'test-csv',
    username: 'postgres',
    password: 'UK#FCs%VdbEVx',
    dialect: 'postgres',
    port: 5432, // Default PostgreSQL port
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database.');
  
    // Perform any necessary queries or operations here
  
    // Release the client
    release();
  
    // Close the pool
    pool.end(() => {
      console.log('Connection closed.');
    });
  });