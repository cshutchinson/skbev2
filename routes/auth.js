var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var knex = require('../db/knex');

var env = {
  clientID:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL:process.env.CALLBACK_URL
}

passport.use(new GoogleStrategy(
  env,
function(token,tokenSecret,profile,done){
  var user = insertUser(profile);

  knex('users').select().where('oauthid', user.oauthid).first()
  .then(function(person){
    if(!person){
      knex('users').insert({
        first_name: user.first_name,
        last_name: user.last_name,
        oauthid: user.oauthid,
        profile_image_url: user.profile_img_url
      }, 'id').then(function(id){
        user.id = id[0];
        done(null,user);
      });
    } else{
      user.id = person.id;
      done(null,user);
      }
    })
  }

));

<<<<<<< HEAD
router.get('/google/callback',
  passport.authenticate('google'),

  function(req,res){
    res.send('success');
  }
);
=======
router.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info){
    console.log('made it here 2')
    if(err) {
      next(err);
    } else if(user) {
      req.logIn(user, function(err) {
        if (err) {
          next(err);
        }
        else {
          console.log('redirecting to client')
          res.redirect(process.env.CLIENT_HOST);
        }
      });
    } else if (info) {
      next(info);
    }
  })(req, res, next);
});

>>>>>>> e12fc00d107a0c97186867fc019f0f8762663147

router.get('/google', passport.authenticate('google', { scope: 'profile'  }),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.

    console.log(req.user)
    res.end('success')
  });

router.get('/logout', function(req, res){
    req.logout()
    res.end("logged out")
  })

  function insertUser(profile){
    var user = {
    first_name:profile._json.name.givenName,
    last_name:profile._json.name.familyName,
    profile_image_url:profile._json.image.url,
    oauthid:profile._json.id
  };
    return user;
  }


module.exports = {
  router: router,
  passport:passport
}
