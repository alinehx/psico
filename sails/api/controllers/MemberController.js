'use strict';

var validateMember = require ('../validate/Member');



function create(req, res) {
  var user =req.body,  
  error = validateMember.validateStructMember(user);
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
    return rest.status(403).send(error);
  }
  
}

function update(req, res) {
  var mail = req.param('email'),
    member = req.body, error =  [];
  error = validateMember.validateStructMember(member, error),
  validateMail = validateMember.verifyEmail(mail);
  
  if (validateMail && error.length === 0) {
    MemberService.updateMember(mail, member, function(err, updateMember) {
      if (err) {
        return res.status(404).send({
          message: err
        });
      }
      return res.status(200).send({
        message: 'Membro atualizado com sucesso'
      });
    });

  } else {
    return res.status(403).send({
      message: 'Membro não enviado'
    });
  }
}

function disable(req, res) {
  var email = req.param('email');

  if (validateMember.verifyEmail(email)) {
    MemberService.findMember(email, function(err, member) {
      if (err || member === 'Membro não encontrado') {
        return res.status(err ? 503 : 404).send({
          message: err ? err : member
        });
      }
      MemberService.removeMember(member.id, function(err, memberDelete) {
        if (err) {
          return res.status(503).send({
            message: err
          });
        }
        return res.status(200).send({
          message: 'Membro excluido com sucesso'
        });
      });
    })
  } else {
    return res.status(403).send({
      message: 'Membro não enviado'
    });
  }
}

module.exports = {
  create: create,
  update: update,
  disable: disable
}