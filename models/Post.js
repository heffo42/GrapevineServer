var mongoose = require('mongoose')
var Schema = mongoose.Schema;

//Book Schema
var postSchema = Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
content: {
  type: String,
  required: true,
},
domain: {
  type: String,
  required: true,
},
likers: [{
  type: Schema.ObjectId,
  ref: 'User',
}],
dislikers: [{
  type: Schema.ObjectId,
  ref: 'User',
}],
comments: [{
  author: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  content: String
}],
create_date:{
  type: Date,
  default: Date.now
},
})


postSchema.statics.createPost = function (user, content) {
  let newPost = new this({
    author: user,
    content: content,
    domain: user.schoolID,
    likers: [],
    dislikers: [],
    comments: []
  });
  return newPost.save()
};



const Post = module.exports = mongoose.model('Post', postSchema)

//Get Posts for a
