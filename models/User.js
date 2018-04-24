var mongoose = require('mongoose')
var Schema = mongoose.Schema
const bcrypt = require('bcrypt');

//User Schema
var userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true },
  email: {
    type: String,
    required: true,
    unique: true },
  password: {
    type: String,
    required: true },
  schoolID: {
    type: Schema.ObjectId,
    ref: 'School',
    required: true},
  create_date:{
    type: Date,
    default: Date.now
  },
   email_verified: {
     type: Boolean,
     default: false
   }
})


// Get genres

userSchema.statics.addUser = function (username, email, password, schoolID) {
  let newUser = new this({
    username: username,
    email: email,
    password: password,
    schoolID: schoolID
    });
    return bcrypt.hash(newUser.password, 1).then((hash) => {
    newUser.password = hash;
    return newUser.save();
  });
};

userSchema.statics.check = function (username, password) {
  // determines if a given password for a username is valid  or not.
  // find a user with the username equivalent to the username passed in.
  // if  there is no  user then throw a new  Error('No User') else  return the result
  // of bcrypt.compare for the password and the user's password
  // STUB
  return this.findOne({ username: username })
    .then((user) => {
      if (!user) {
        throw new Error('No User');
      } else {
        return bcrypt.compare(password, user.password);
      }
    });
  // ENDSTUB
};

const User = module.exports = mongoose.model('User', userSchema)
