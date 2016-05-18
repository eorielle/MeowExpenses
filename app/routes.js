module.exports = function(app, passport) {

    // Main page
    /*app.get('/', function(req, res) {
      //res.writeHeader(200,{'Content-Type':'text/html'});
      res.sendFile(__dirname + '/index.html');
    });*/

    // Sign Up
    app.post('/signup', passport.authenticate('local-signup'));

    // Log In
    app.post('/login', passport.authenticate('local-login'),
      function(req, res) {
        res.send(req.user);
    });

    // Log Out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

var auth = function(req, res, next){
  if (!req.isAuthenticated())
  	res.send(401);
  else
  	next();
};
