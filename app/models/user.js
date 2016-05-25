var pg = require('pg');
var constring = "postgres://meowexp:123456789@localhost/meowexp";
var bcrypt = require('bcrypt-nodejs');

function User() {
    this.id=-1
    this.group = 0;
    this.email = "";
    this.password = "";

    this.save = function(callback) {

        var client = new pg.Client(constring);
        client.connect();

        console.log(this.email + ' will be saved');

        client.query('INSERT INTO users(name, pwd, group_id) VALUES($1, $2, $3)', [this.email, User.generateHash(this.password), this.group], function(err, result) {
            if (err) {
                console.log(err);
                return console.error('error running query', err);
            }
        });
        client.query("SELECT * from users where name=$1", [this.email], function(err, result) {

            if (err) {
                return callback(null);
            }
            //if no rows were returned from query, then new user
            if (result.rows.length > 0) {
                console.log(result.rows[0].name + ' is found!');
                var user = new User();
                user.email = result.rows[0].name;
                user.password = result.rows[0].pwd;
                user.group = result.rows[0].group_id;
                user.id=result.rows[0].id;
                console.log(user.email);
                client.end();
                return callback(user);
            }
        });
    };

}

User.findOne = function(email, callback) {
    var client = new pg.Client(constring);

    var isAvailable = false; //we are assuming the email is taking
    //var email = this.email;
    //var rowresult = false;
    console.log(email + ' is in the findOne function test');
    //check if there is a user available for this email;
    client.connect();
    //client.connect(function(err) {
    ////    //console.log(this.photo);
    //    console.log(email);
    //    if (err) {
    //        return console.error('could not connect to postgres', err);
    //    }

    client.query("SELECT * from users where name=$1", [email], function(err, result) {
        if (err) {
            return callback(err, isAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0) {
            isAvailable = false; // update the user for return in callback
            ///email = email;
            //password = result.rows[0].password;
            console.log(email + ' is not available!');
        } else {
            isAvailable = true;
            //email = email;
            console.log(email + ' is available');
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;

        client.end();
        return callback(false, isAvailable, this);


    });
    //});
};


User.findByName = function(email, callback) {

    var client = new pg.Client(constring);

    client.connect();
    console.log("we are in findbyname");


    client.query("SELECT * from users where name=$1", [email], function(err, result) {

        if (err) {
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
        console.log("we are in findbyname");

        if (result.rows.length > 0) {
            console.log(result.rows[0].name + ' is found!');
            var user = new User();
            user.email = result.rows[0].name;
            user.group = result.rows[0].group;
            user.password = result.rows[0].pwd;
            user.id=result.rows[0].id;

            console.log(user.email);
            return callback(null, user);
        }

        return callback(err, null);

    });
};

// generating a hash
User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.validPassword = function(password, cryptedPwd) {
    return bcrypt.compareSync(password, cryptedPwd);
};

module.exports = User;
