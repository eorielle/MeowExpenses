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

/*
    app.get('/isLogged', function(req,res){
        if(req.isAuthenticated()){
          res.send(req.user);
        } else {
          res.send(null);
        }
    });*/


    // Log Out
    app.post('/logout', function(req, res) {
        req.logOut();
        res.sendStatus(200);
        //res.redirect('/');
    });

    app.post('/getreports', auth, function(req, res){
      pgmanager.getReports(req.user.id, req.body.page, function(err,count,result){
        if(err === null){
          console.log(result);
          var data = {
            count:count,
            result:result
          };
          res.send(data);
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
  	res.sendStatus(401);
  else
  	next();
};
