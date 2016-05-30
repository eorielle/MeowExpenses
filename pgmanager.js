var pg=require('pg');
var constring="postgres://meowexp:123456789@localhost/meowexp";

var addUser = function(name, group, password){
  pg.connect(constring, function(err, client,done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(' INSERT INTO users (name,group_id,pwd) VALUES (\'' + name + '\','+ group + ',MD5(' + password + ')); ', function(err,result){
      if(err) {
        return console.error('error running query', err);
      }
    });
    query.on("end", function (result) {
          done();
          client.end();
          res.write('Success');
          res.end();
    });
  });
};

  // report : json; callback(err, result)
  var getReports = function(userID, pagenumber, callback){
    var client = new pg.Client(constring);
    client.connect();
    var res = [];
    var count = 0;
    var pSize = 5;

    client.query('SELECT count(*) from reports WHERE id_user=$1;', [userID], function(err, result) {
        if (err) {
            console.log(err);
            return callback(err,null);
        }
        if (result.rows.length > 0) {
          count=result.rows[0].count;
          console.log(count);

          // get all reports
          console.log('get reports of user ' + userID);
          console.log(pagenumber);
          console.log((pagenumber-1)*pSize);

          var query = client.query('SELECT * from reports r LEFT JOIN invoices i ON r.id_invoice=i.id WHERE r.id_user=$1 LIMIT $2 OFFSET $3;' ,[userID, pSize,((pagenumber-1)*pSize)], function(err, result) {
              if (err) {
                  console.log(err);
                  return callback(err,null,null);
              }
          });

          query.on("row",function(row){
            res.push(row);
          });

          query.on("end",function(){
            client.end();
            return callback(null, count, res);
          });

        }
    });

  };


  // get the total number of page
  var getReportsCount = function(userID, callback){
    var client = new pg.Client(constring);
    client.connect();
    var res = 0;

    console.log('get reports count of user ' + userID);

    client.query('SELECT count(*) from reports WHERE id_user=$1;', [userID], function(err, result) {
        if (err) {
            console.log(err);
            return callback(err,null);
        }
        if (result.rows.length > 0) {
          res=result.rows[0].count;
          client.end();
          console.log(res);
          callback(null,res);
        }
    });
  };


// report : json; callback(err, report)
var addReport = function(report, userID, callback){
  var client = new pg.Client(constring);
  client.connect();

  console.log('report will be saved');

  client.query('INSERT INTO invoices(supplier_name,purpose,url_pdf) VALUES($1, $2, $3) RETURNING id;', [report.supplier, report.purpose, report.invoiceURL], function(err, result) {
      if (err) {
          console.log(err);
          return callback(err,null);
      }

      if(result.rows.length > 0){
        var id = result.rows[0].id;

        client.query('INSERT INTO reports(amount,currency,id_user,id_invoice) VALUES( $1, $2, $3, $4);', [report.amount, report.currency, userID, id], function(err, result) {
            if (err) {
                console.log(err);
                client.end();
                return callback(err,null);
            }
            console.log('report is saved !');
            client.end();
            return callback(null,report);

        });
      }
  });

  /*client.query("SELECT * from invoices where name=$1", [this.email], function(err, result) {

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
          console.log(user.email);
          client.end();
          return callback(user);
      }
  });*/
};

exports.addUser = addUser;
exports.addReport = addReport;
exports.getReports = getReports;
exports.getReportsCount = getReportsCount;
