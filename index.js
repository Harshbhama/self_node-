const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mysql = require('mysql');

const app = express();

const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM products';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var async=require('async');
var products = require('./products')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ten@1dulkar',
  database: 'react_sql'
});

connection.connect(err => {
  if (err) {
    return err;
  }
});

// console.log(connection)

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('go to /products to see products')

})





app.post('/user/authenticate', (req, res) => {
  console.log("IN Authenticate")

  async.waterfall([
    function (callback) {
      var sql = "SELECT * FROM login_table WHERE email = ?"
      var test = ''
      connection.query(sql, [req.body.email], (err, results) => {
        if (err) {
          console.log(err)
          return res.send(err)
        }
        else {
          if(results.length > 0){
            console.log(results[0].password)
            test = results[0]
            callback(null,test)
          }
          else{
            return res.json({"error":1,"data":"Email Not Found"});
          }
     
        }
      })

    },

    function(arg1, callback){
      console.log(arg1)
      if(bcrypt.compareSync(req.body.password, arg1.password)){
        delete arg1['password']
        console.log(arg1)
        var token = jwt.sign({ email: arg1.email }, 'secret', {
          expiresIn: "4h"
      });
        console.log(token)
        return res.json({"token":token})
      }
      else{
        return res.json({"error":1,"data":"Incorrect Password"})
      }
    
    }
  ])

})

app.post('/user/register', (req, res) => {
  console.log("In Register");
  var salt = bcrypt.genSaltSync(10);
  async.waterfall([
      function (callback){
        var hash = bcrypt.hashSync(req.body.password, salt);
        console.log(hash)
        callback(null,hash)
      },
      function (arg1, callback){
        console.log(arg1);
        console.log(req.body.email);
        var pass = "abc"
        var sql = `INSERT INTO login_table ( email, password) VALUES ('${req.body.email}', '${arg1}')`;
        connection.query(sql, (err, result) => {
          if(err){
            console.log(err);
            return res.send(err)
          }
          else{
            return res.json("Generated Hash String" + "  " + arg1)
          }
        })

        //return res.json("Generated Hash String" + "  " + arg1)
      }
  ])
})


app.use('/products', products)

app.listen(4000, () => {
  console.log('Products server listnening on 4000')
})