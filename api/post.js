const router = require('express').Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const Post = require('../models/Post');

module.exports = function (app) {
  // TODO: Check to see if user is authenticated
  // STUB
  router.use(isAuthenticated(app));


  router.post('/create', function (req, res) {
  // This route will just call the createTweet  static method in the
  // Tweet model. Pass in  the current user id and the posted tweet contente
  // if it is successful send back json in the format
  // { res: 'success', data: tweetThatWasMade }
  // else
  // { res: 'failure', data: error }
  // STUB
  console.log('is validated')
  Post.createPost(req.user, req.body.content)
    .then((tweet) => {
      res.json({ res: 'success', data: tweet });
    })
    .catch((err) => {
      res.json({ res: 'failure', data: err });
    });

});

router.get('/feed', function (req, res) {
  Post
  .find( {domain: req.user.schoolID})
  .sort('-create_date')
  .exec((err, tweets) => {
   if(err){
     res.json({ res: 'failure', data: err });
   }else{
     res.json({ res: 'success', data: tweets });
   }
 })
});

router.post('/addcomment', function (req, res){
  Post
  .findOne({_id: req.body.postID})
  .exec((err, post) => {
    if(err){
      res.json({ res: 'failure', data: err });
    }
    post.comments.push({
      author: req.user,
      content: req.body.content
    })
    post.save(function (err, updatedPost) {
    if (err) return handleError(err);
    res.send(updatedPost);
  });
  })
})

router.post('/like', function (req, res) {
   Post
   .findOne({_id: req.body.postID})
   .exec((err, post) => {
     if(err){
       res.json({ res: 'failure', data: err });
     }

     post.likers.push(req.user)
     post.dislikers = post.dislikers.filter(function(x){
       return (!x.equals(req.user._id))
     })
     post.save(function (err, updatedPost) {
     if (err) return handleError(err);
     res.send(updatedPost);
   });
   })
});

router.post('/dislike', function (req, res) {
   Post
   .findOne({_id: req.body.postID})
   .exec((err, post) => {
     if(err){
       res.json({ res: 'failure', data: err });
     }

     post.dislikers.push(req.user)
     post.likers = post.likers.filter(function(x){
       return (!x.equals(req.user._id))
     })

     post.save(function (err, updatedPost) {
     if (err) return handleError(err);
     res.send(updatedPost);
   });
   })
});

router.post('/neutrallike', function (req, res) {
   Post
   .findOne({_id: req.body.postID})
   .exec((err, post) => {
     if(err){
       res.json({ res: 'failure', data: err });
     }


     post.likers = post.likers.filter(function(x){
       return (!x.equals(req.user._id))
     })
     post.dislikers = post.dislikers.filter(function(x){
       return (!x.equals(req.user._id))
     })

     post.save(function (err, updatedPost) {
     if (err) return handleError(err);
     res.send(updatedPost);
   });
   })
});

router.post('/remove', function (req, res) {
  Post
  .findOne({_id: req.body.postID})
  .exec((err, post) => {
    if(err){
      res.json({ res: 'failure', data: err });
    }
    if(post && post.author.equals(req.user._id)){
      console.log('here??')
      Post.findByIdAndRemove(req.body.postID, function (err) {
        console.log('made it here')
        if (err){ res.json({ res: 'failure', data: 'something went wrong' }); }
        else {
        res.json({ res: 'sucess', data: 'post removed' });
        }
      })
    }else{
      res.json({ res: 'failure', data: 'not eligible to remove' });
    }
  });
});


//create post
//getfeedforschool sorted
//like updates
//add comments
//delete post if user


  return router;
};
