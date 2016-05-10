'use strict';

var request = require('request');


function getAddress (req, res) {
  var zipCode = req.params.zipCode;
  
  if(zipCode && zipCode.length === 8) {
    var url = 'https://viacep.com.br/ws/'+zipCode+'/json/';
    request(url, function (err, success) {
      if (err) {
        return res.status(503).send(err);
      } else {     
        return res.status(200).send(JSON.parse(success.body));
      }
    });
  } else {
    return res.status(403).send({
       message:  !zipCode ? 'CEP é obrigatório' : 'CEP inválido'
     }); 
  }   
};



module.exports = {
    getAddress: getAddress  
};