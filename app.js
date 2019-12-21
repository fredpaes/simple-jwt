const express = require('express'),
  jwt = require('jsonwebtoken');

const app = express();

// Format of token
  // Authorization: Bearer <access_token>

// MIDDLEWARE

const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1]
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next(); 
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

// ROUTES

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
});

app.post('/post', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, AuthData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: 'Post created ....',
        AuthData
      })
    }
  })
});

app.post('/login', (req, res) => {
  // Mock user
  const user = {
    id: 1,
    name: 'Test',
    email: 'test.user@gmail.com'
  }

  jwt.sign({ user }, 'secretKey', { expiresIn: '15s' }, (err, token) => {
    res.json({
      token
    })
  })
});

// SERVER

app.listen(4000, () => console.log('Server running on port 4000'));
