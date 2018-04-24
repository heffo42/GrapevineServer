const list = require('./domains.js');
const express = require('express');
const School = require('../models/School');

module.exports = (app) => {
  const uploadRoutes = express.Router();

  uploadRoutes.post('/regenALLSCHOOLS', (req, res) => {
    if(req.body.password === 'davidisthegoat'){
      for(var i = 0; i < list.length;i++){
        var temp = list[i];
        if(temp.country === 'United States'){
          //webpage, name, domain
          School.addSchool(temp.web_pages[0], temp.name, temp.domains[0])
        }
      }
          res.send('Upload Complete')
    }
  });


  uploadRoutes.post('/customSchool', (req, res) => {
    if(req.body.password === 'davidisthegoat'){
          School.addSchool(req.body.webpage, req.body.name, req.domain)
          res.send('Upload Complete')
    }
  });


    return uploadRoutes;
  };
