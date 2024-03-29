const express = require('express');
const app = express();

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and 
receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

// Our JWT logic. Uses express-jwt which is a middleware that validates JsonWebTokens and sets req.user.
const jwt = require('./_helpers/jwt');

// Our error handler
const errorHandler = require('./_helpers/error_handler');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(jwt());

app.use('/user', require('./routes/user.router'));
//app.use('/parecord', require('./routes/parecord.router'));
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3030;
app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
