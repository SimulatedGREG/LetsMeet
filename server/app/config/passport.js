'use strict';

const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt-nodejs");
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = passport => {
  const isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.local.password);
  }

  const createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new GitHubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
  },
  (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ 'github.id': profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }

        const newUser = new User();

        newUser.github.id = profile.id;
        newUser.github.username = profile.username;
        newUser.github.avatar = profile._json.avatar_url;

        newUser.save(err => {
          if (err) {
            throw err;
          }

          return done(null, newUser);
        });
      });
    });
  }));

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ 'facebook.id': profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }

        console.log(profile)

        // done(null,profile)

        const newUser = new User();
        let profilePic = ""

        newUser.facebook.id = profile.id;
        newUser.facebook.username = profile.displayName;
        newUser.facebook.avatar = profile.photos[0].value;

        newUser.save(err => {
          if (err) {
            throw err;
          }

          return done(null, newUser);
        });
      });
    });
  }));

  passport.use('login', new LocalStrategy({passReqToCallback:true},
      (req, username, password, done) => {
        User.findOne({'local.username':username}, (err, user) => {
            if (err)
              return done(err);
            if (!user){
              return done(null, false);
            }
            if (!isValidPassword(user, password)){
              return done(null, false);
            }
            return done(null, user);
          }
        );
    }));

  passport.use('signup', new LocalStrategy({passReqToCallback:true},
  (req, username, password, done) => {
      User.findOne({'username.local':username},function(err, user) {
        if (err){
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
        if (user) {
          return done(null, false);
        } else {
          const newUser = new User();

          newUser.local.username = username;
          newUser.local.password = createHash(password);
          newUser.local.avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

          newUser.save((err) => {
            if (err){
              console.log('Error in Saving user: ' + err);
              throw err;
            }

            return done(null, newUser);
          });
        }
      });
  }))
};
