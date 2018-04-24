const express = require('express');
const User = require('../models/User');
const School = require('../models/School');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token')
const nodemailer = require('nodemailer');



function GetEmailParts( strEmail ){
   // Set up a default structure with null values
   // incase our email matching fails.
   var objParts = {
       user: null,
       domain: null,
       ext: null
       };

   // Get the parts of the email address by leveraging
   // the String::replace method. Notice that we are
   // matching on the whole string using ^...$ notation.
   strEmail.replace(
       new RegExp( "^(.+)@(.+)\\.(\\w+)$" , "i" ),

       // Send the match to the sub-function.
       function( $0, $1, $2, $3 ){
           objParts.user = $1;
           objParts.domain = $2;
           objParts.ext = $3;
       }
       );

   // Return the "potentially" updated parts structure.
   return( objParts );
}
module.exports = (app) => {
  const accountRoutes = express.Router();


  accountRoutes.post('/signup', (req, res) => {
    console.log('creating new user')
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var parts = GetEmailParts(email)
    var shorten = parts.domain.split('.')
    var domain = shorten[shorten.length - 1] + '.' + parts.ext
    console.log('Domain name is: ' + domain)
    var query = School.findOne({'domain': domain})
    query.exec(function(err, schoolObj){
      if (err){
        res.json({
          success: false,
          message: 'There was an error with your email',
        });
      }
      if(!schoolObj){
        res.json({
          success: false,
          message: 'Unable to discover a Univeristy under this domain',
        });
      }
      console.log(schoolObj)
        User.addUser(username, email, password, schoolObj)
            .then((user) => {
              var payload = {
                id: user._id,
              };
              var token = jwt.sign(payload, app.get('superSecret'));
              console.log(token);
              var token = new Token({ _userId: user._id, token: token });

            token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'grapevinegram@gmail.com',
                pass: 'congressPACE' }
            });
            var mailOptions = {
              from: 'grapevinegram@gmail.com',
              to: user.email,
              subject: 'Account Verification Token',
              text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/account\/' + '\/confirmation?token=' + token.token + '.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
            })
            .catch((err) => {
              res.json({
                success: false,
                message: 'There was an error registering you',
                error: err
              });
            });

      });
    });


    accountRoutes.post('/signin', (req, res) => {
        User.findOne({ username: req.body.username })
          .then((user) => {
            if (!user) {
              res.json({ success: false, message: 'Auth failed, user not found' });
            } else {
              return User.check(req.body.username, req.body.password)
                .then((valid) => {
                  if (!valid) {
                    res.json({
                      success: false,
                      message: 'Auth failed, wrong pass',
                    });
                  } else {
                    var payload = {
                      id: user._id,
                    };
                    if(!user.email_verified){
                      res.json({
                        success: false,
                        message: 'You must verify your email before continuing',
                      });
                    }

                    var token = jwt.sign(payload, app.get('superSecret'));
                    res.json({
                      success: true,
                      message: 'Authentication successful',
                      token: token,
                    });
                  }
                });
            }
          })
          .catch((err) => {
            res.json({ success: false, message: 'Auth failed, no user' });
          });
      });


      accountRoutes.get('/confirmation', (req, res) => {
        var bodyToken = req.param('token')
        console.log(bodyToken)
        Token.findOne({ token: bodyToken}, function (err, token) {
           if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

           // If we found a token, find a matching user
            User.findOne({ _id: token._userId }, function (err, user) {
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (user.email_verified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                // Verify and save the user
                user.email_verified = true;
                user.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("The account has been verified. Please log in.");
                });
            });
        });
      });

      accountRoutes.post('/resend', (req, res) => {
          //todo: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
      });

      return accountRoutes;
    };
