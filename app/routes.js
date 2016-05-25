module.exports = function(app, passport) {
    var pgmanager = require('../pgmanager');

    // Sign Up
    app.post('/signup', passport.authenticate('local-signup'),
      function(req, res) {
        res.send(req.user);
    });

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

    app.post('/getreports', auth, function(req, res){
      pgmanager.getReports(req.user.id, function(err,result){
        if(err === null){
          console.log(result);
          res.send(result);

        } else {
          res.send(err);
        }
      });

    }

    );

    app.post('/addreport', auth, function(req,res){
      console.log(req.body);
      console.log(req.user.name);
      console.log(req.user.id);

      var report = req.body;

      //TODO : get User ID !!!!
      pgmanager.addReport(report,req.user.id,function(err){
          if(err === null){
            res.send(err);
          } else {
            res.send(req.report);
          }
      });

    });
};

var auth = function(req, res, next){
  if (!req.isAuthenticated())
  	res.send(401);
  else
  	next();
};
