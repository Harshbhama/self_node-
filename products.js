const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mysql = require('mysql');
console.log("IN products")
const products = express();

const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM products';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var async=require('async');

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
  

  
products.use(cors());
products.use(bodyParser.json())
  
products.use((req, res, next) => {
    var token = req.body.token || req.headers['token']
    console.log(token)
    if(token){
        jwt.verify(token, 'secret', (err, dt) => {
            if(err){
                console.log(err)
                res.json("Invalid Token Validation")
            }
            else{
                console.log(dt)
                next()
            }
        })
    }
    else{
        res.json("Token Not Found")
    }
})


products.post('/add', (req, res) => {
    console.log(req.body)
    // const { product_id, name, price } = req.query
    const { name, price } = req.body
    // console.log(name, price);
    const INSERT_PRODCUTS_QUERY = `INSERT INTO products ( name, price) VALUES ('${name}', ${price})`;
    // res.send('adding product')
  
    connection.query(INSERT_PRODCUTS_QUERY, (err, result) => {
      if (err) {
        return res.send(err)
      }
      else {
        return res.send('successfully addded product.')
      }
    })
  })
  
  products.get('/list', (req, res) => {
    connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
      if (err) {
        return res.send(err)
      }
      else {
        return res.json({
          data: results
        })
      }
    })
  })
  
  products.post('/delete', (req, res) => {
    var sql = "DELETE FROM products WHERE product_id = ?"
    console.log(req.body.product_id);
    connection.query(sql, [req.body.product_id], (err, results) => {
      if (err) {
        return res.send(err)
      }
      else {
        return res.json("deleted")
        console.log("Deleted succefully");
      }
    })
  })
 

  module.exports = products;