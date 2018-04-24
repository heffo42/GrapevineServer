var mongoose = require('mongoose')

var schoolSchema = mongoose.Schema({
  webpage: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    unique: true,
    required: true }
})

schoolSchema.statics.addSchool = function (webpage,name, domain) {
  let newSchool = new this({
    webpage: webpage,
    name: name,
    domain: domain
    });
    newSchool.save(function (err) {
    if (err) {return console.log('failed uploading school: ' + err)}
  });
};

const School = module.exports = mongoose.model('School', schoolSchema)
