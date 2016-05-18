var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');
var pg = require('pg');
var constring = "postgres://meowexp:123456789@localhost/meowexp";

module.exports = function(passport) {
  console.log("---- passport is SET !");

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user.email +" was seralized");
        var sessionUser = { name: user.email };
        done(null, sessionUser);
        //done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(suser, done) {
      console.log(suser.name + " is deserialized");
      done(null,suser);

        /*User.findByName(name, function(err, user) {
          console.log(name + " is deserialized");
          done(err, user);
        });*/
    });

    /*passport.use('local-login', new LocalStrategy(
      function(username, password, done) {
        if (username === "admin" && password === "admin") // stupid example
          return done(null, {name: "admin"});

        return done(null, false, { message: 'Incorrect username.' });
      }
    ));*/

   passport.use('local-login', new LocalStrategy(
     function(email, password, done) { // callback with email and password from our form
            console.log(email);
            console.log("---- there is an email add above !");
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findByName(email, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err){
                    console.log('ERROR');
                    return done(err);
                    }
                // if no user is found, return the message
                if (!user){
                    console.log("no user");
                    return done(null, false, { message: 'No user found.'}); // req.flash is the way to set flashdata using connect-flash
                    }
                // if the user is found but the password is wrong
                if (!User.validPassword(password, user.password)){
                    console.log("no pwd");
                    return done(null, false, { message: 'Incorrect username.' }); // create the loginMessage and save it to session as flashdata
                    }
                // all is well, return successful user
                console.log('Succes !');
                return done(null, user);
            });

        }));


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function(callback) {


                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne(email, function(err, isAvailable, user) {
                    //console.log('userfound: ' + isNotAvailable);
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    //if (){
                    //
                    //}

                    // check to see if theres already a user with that email
                    if (!isAvailable) {
                        //console.log(user.email +' is not available');
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        console.log('new local user');

                        // if there is no user with that email
                        // create the user
                        user = new User();


                        // set the user's local credentials

                        user.email = req.body.email;
                        user.password = req.body.password;
                        //newUser.photo = 'http://www.flippersmack.com/wp-content/uploads/2011/08/Scuba-diving.jpg';

                        user.save(function(newUser) {
                            console.log("the object user is: ", newUser);
                            passport.authenticate();
                            return done(null, newUser);
                            //newUser.password = newUser.generateHash(password);
                        });
                    }

                });

            });
        }));




};
