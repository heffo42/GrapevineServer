const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = app => function (req, res, next) {
  // check header or url parameters or post parameters for token
  // Grab the token from any of the tree following locations:
  //  - req.body.token
  //  - req.query.token
  //  - req.headers['auth-token']
  var token = req.body.token || req.query.token || req.headers['auth-token'];
  //  if such a token exists
  if (token) {
    // TODO: verify the token using the 'superSecret' key from the app
    // if there is a n error, send the following response via json
    // { success: false, message: 'Failed to authenticate  token.' }
    // else find the user associated  with  the id in the payload  of the token
    // and set  the req.user object equal  to that  user
    // since this is a middleware you'll need to somehow call the *next* function in
    // the request chain.
    // STUB
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.',
        });
      } else {
        // if everything is good, save to request for use in other routes
        User.findOne({ _id: decoded.id }, function (err, user) {
          console.log('id: ' + decoded.id)
          if (err) throw err;
          req.user = user;
          next();
        });
      }
    });
    // ENDSTUB
  } else {
    // TODO: if there  is no token in the first place, send a json object back with status
    // 403  and the json object { success: false, message: 'No token provided' }
    // STUB
    return res.status(403).json({
      success: false,
      message: 'No token provided',
    });
    // ENDSTUB
  }
};
