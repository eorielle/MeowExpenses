var pg=require('pg');
var constring="postgres://meowexp:123456789@localhost/meowexp";



var addUser = function(name, group, password){
  pg.connect(constring, function(err, client){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(' INSERT INTO users (name,group_id,pwd) VALUES (\'' + name + '\','+ group + ',MD5(' + password + ')); ', function(err,result){
      if(err) {
        return console.error('error running query', err);
      }
    });
    query.on("end", function (result) {
          client.end();
          res.write('Success');
          res.end();
    });
  });
};

var addReport = function(date,amount,currency,user,invoice){
  pg.connect(constring, function(err, client){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var query = client.query(' INSERT INTO reports (date,amount,currency,id_user,id_invoice) VALUES ('+date + ',' + amount + ',\'' + currency + '\',' + user + ',' + invoice +'); ', function(err,result){
      if(err) {
        return console.error('error running query', err);
      }
    });

    query.on("end", function (result) {
          client.end();
          res.write('Success');
          res.end();
    });
  });
};

var addInvoice = function(supplierName,purpose,urlInvoice,description){
  pg.connect(constring, function(err, client){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(' INSERT INTO invoices (supplier_name,purpose,url_invoice,description) VALUES (\'' + supplierName + '\',\'' + purpose + '\',\'' + urlInvoice + '\',\'' + description + '\'); ', function(err,result){
      if(err) {
        return console.error('error running query', err);
      }
    });
    query.on("end", function (result) {
          client.end();
          res.write('Success');
          res.end();
    });
  });
};

exports.adduser = adduser;
