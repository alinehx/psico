'use strict';

function verifyMember(member) {
  if (!member) {
    return false;
  } else {
    return true;
  }
};


function create(req, res) {
  var user = MemberService.memberObject(req.body);

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
}

function update(req, res) {
  var email = req.param('email');

  var member = req.body;
  if (verifyMember) {
    MemberService.updateMember(email, member, function(err, updateMember) {
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

  if (verifyMember(email)) {
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