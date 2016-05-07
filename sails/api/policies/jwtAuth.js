'use strict';
var jwt = require('jwt-simple');


module.exports = function (req, res, next) {
  var token, payload;
  
  if (!req.headers || !req.headers.authorization) {  	
    return res.status(401).send({
      message: 'Autenticação falhou'
    });
  } else {
    token = req.headers.authorization; 
    
    try {
      var secret = sails.config.session.secret;
            
      payload = jwt.decode(token, secret);
           
      if(!payload.sub) {
        return res.status(401).send({
          message: 'Autenticação Falhou!'
        });
      } 
      next();
    } catch (err) {      
      return res.status(503).send({
        message: err.message
      });
    }
  }
};
