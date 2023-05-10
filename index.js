const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

console.log("Starting server");

const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.DB_HOST;

console.log("DB User: " + username);  
console.log("DB Pass: " + password);
console.log("DB Host: " + host);

const app = express();
const sequelize = new Sequelize({
  host: host,
  database: 'test-csv',
  username: username,
  password: password,
  dialect: 'postgres'
});

// Define the Request model
const Request = sequelize.define('Request', {
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Increment the request count and store the IP and User Agent
app.get('/', async (req, res) => {
  try {
	
	ip = req.ip;
	agent = req.get('User-Agent');
	console.log({
      ip,
      agent,
    });
	const createdRequest = await Request.create({
      ip : ip,
      userAgent: agent,
    });

    const requestId = createdRequest.id;
	
	// Fetch the last 10 requests from the Requests table
    const lastRequests = await Request.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    // Construct the response HTML
    const html = `
      <h1>Page loaded ${requestId} times.</h1>
      <h2>Last requests:</h2>
      <ul>
        ${lastRequests.map(request => `<li>${request.ip} - ${request.userAgent}</li>`).join('')}
      </ul>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});

// Sync the model with the database and start the server
sequelize.sync()
  .then(() => {
    app.listen(8080, () => {
      console.log('Server is running on http://localhost:8080');
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });