'use strict';

var validateMember = require ('../validate/Member');



function create(req, res) {
  var user =req.body, error = []; 
  error = validateMember.verifyBody(user);
  if(error.length === 0) {
    MemberService.createMember(user, function(err, member) {
      if (err) {
        return res.status(401).send({
          message: err
        });
      }
      if (member) {
        return res.status(200).send({
          message: 'Membro criado com sucesso'
        });
      }
    });  
  } else {
    return res.status(403).send(error);
  }
  
}

function updateMember(email, member, typeUpdate, req, res) {
  if (validateMember.verifyEmail(email)) {
    MemberService.updateMember(email, member, function (err, memberUpdated) {
      if (err) {
        return res.status(503).send(error);
      } else if(memberUpdated) {
        
        var returnMember = typeUpdate === 'disable'? {message:'Membro excluído com sucesso'} : memberUpdated;
        return res.status(200).send(returnMember)
      }
    })   
  } else {
    return res.status(403).send({
      message: 'Membro não enviado'
    });
  }
};


function update(req, res) {
  var mail = req.param('email'),
    member = req.body, error =  [];
  error = validateMember.validateStructMember(member, error);
    
  if (error.length === 0) {
     updateMember(mail, member, 'update', req, res);
  } else {
    return res.status(403).send({
      message:  error
    });
  }
}

function disable(req, res) {
  var mail = req.param('email');
  var member = {
    active: false
  };
  
  updateMember(mail, member, 'disable', req, res);

  
};

module.exports = {
  create: create,
  update: update,
  disable: disable
}