const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();

// Middleware for checking if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.redirect('/auth/login.html'); // User is not authenticated, redirect to login page
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware configuration
app.use(session({
  secret: '18xbcza5426', // Change this to a random string for security
  resave: false,
  saveUninitialized: true
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Serve login.html
app.get('/auth/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth', 'login.html'));
});

// Serve login-styles.css
app.get('/auth/login-styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth', 'login-styles.css'));
});

// Serve other static files from the 'public' directory
app.get('/public/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.params.filename));
});

const users = [
  { username: 'user1', password: '$2a$10$Boj7N5pKVenfZucJ1RfUSOGMOZIsYKWaYB1f8mK68F1AY.PA.MZ6S' }, // password: "password123"
  { username: 'user2', password: '$2a$10$zbxGlhcC1uSX4JA1Wlgl0OLN2821Od.oZ96IKYlhd0E2K0oHw7X6a' }, // password: "qwerty456"
];

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Internal server error: ' + err.message);
});

app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login.html');
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    console.log('Invalid username:', username);
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Compare hashed passwords
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error('Error comparing passwords:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result) {
      console.log('Login successful:', username);
      req.session.userId = user.username;
      console.log('Session established. User ID:', req.session.userId);

      // Store user data in session
      req.session.user = user;

      return res.json({ user });
    } else {
      console.log('Invalid password:', password);
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

app.post('/contribute', isAuthenticated, (req, res) => {
  const { blockchainAddress, cryptocurrency, textileMaterial, textileWeight } = req.body;

  // Log the received data
  console.log('Received blockchain address:', blockchainAddress);
  console.log('Received cryptocurrency:', cryptocurrency);
  console.log('Received textile material:', textileMaterial);
  console.log('Received textile weight:', textileWeight);

  // Handle the form submission with the blockchain address, textile material, and textile weight
  
  // Example: Store the data in a database
  // This is just a placeholder, replace it with your actual logic
  // database.saveTextileWasteData(blockchainAddress, textileMaterial, textileWeight);
  
  // Log that the submission was successful
  console.log('Submission successful');

  res.status(201).json({ message: 'Submission successful' });
});

//...

app.post('/calculateIncentive', isAuthenticated, (req, res) => {
  const { cryptocurrency, textileMaterial, textileWeight } = req.body;

  // Calculate the incentive reward based on the provided data
  // This is just a placeholder, replace it with your actual logic
  const incentiveReward = calculateIncentiveReward(cryptocurrency, textileMaterial, textileWeight);

  res.json({ incentiveReward });
});

//...

function calculateIncentiveReward(cryptocurrency, textileMaterial, textileWeight) {
  // Define some constants for the formula
  const BASE_REWARD = 0.1; // Base reward in USD
  const CRYPTOCURRENCY_MULTIPLIER = 1.25; // Multiplier for cryptocurrency type
  const TEXTILE_MATERIAL_WEIGHT = 0.45; // Weight for textile material type
  const TEXTILE_WEIGHT_MULTIPLIER = 0.45; // Multiplier for textile weight

  // Calculate the incentive reward based on the provided data
  let incentiveReward = BASE_REWARD;

  // Apply cryptocurrency multiplier
  if (cryptocurrency === 'Bitcoin') {
    incentiveReward *= CRYPTOCURRENCY_MULTIPLIER;
  } else if (cryptocurrency === 'Ethereum') {
    incentiveReward *= 1.25; // Example: Ethereum has a higher multiplier
  }

  // Apply textile material weight
  if (textileMaterial === 'Cotton') {
    incentiveReward += TEXTILE_MATERIAL_WEIGHT;
  } else if (textileMaterial === 'Polyester') {
    incentiveReward += 0.45; // Example: Polyester has a lower weight
  }

  // Apply textile weight multiplier
  if (textileWeight > 0) {
    incentiveReward += (textileWeight * TEXTILE_WEIGHT_MULTIPLIER);
  }

  return incentiveReward; // Return the calculated incentive reward
}

// Start the server
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
