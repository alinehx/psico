 'use strict';

 var validateUser = require ('../validate/User');


 function create(req, res) {
  var erro = validateUser.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else {
    UserService.findUser(req.body.email, function (err, user) {
      if (err) {
        if (err !== 'Usuário não encontrado') {
          return res.status(503).send({
            message: err
          });
        }        
        var userObject = UserService.userObject(req.body);
        Users.create(userObject).exec(function(err, user) {
          if (err) {
            return res.status(503).send({
              message: err
            });
           } else {
             return res.status(200).send({
               user: user.toJSON()
             });
           }
        });
      } else {
        return res.status(409).send({
          message: 'Email já cadastrado'
        });
      } 
    });     
   }
 }

 function getUser(req, res) {
   var email = req.param('email');
   UserService.findUser(email, function(err, user) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
     if (user) {
       delete user.password;
       return res.status(200).send(user);
     }
   });
 }

 function getAll(req, res) {
   UserService.getAll(function(err, users) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
     return res.status(200).send(users);
   });
 }

 function update(req, res) {
   var email = req.param('email');
   var user = req.body;
   var error = [];
   var validate = validateUser.Email(email);
   
   error = validateUser.valideStructUser(user, error);
   if (validate && error.length === 0) {
     UserService.updateUser(email, user, function(err, updateUser) {
       if (err) {
         return res.status(404).send({
           message: err
         });
       }
       return res.status(200).send({
         message: 'Usuário atualizado com sucesso'
       });
     });
   } else {
     return res.status(403).send({
       message: validate === false  ? 'Usuário não enviado' : error
     });
   }
 }

 function disable(req, res) {
   var email = req.param('email');
   if (validateUser.Email(email)) {
     UserService.findUser(email, function(err, user) {
       if (err) {
         return res.status(503).send({
           message: err
         });
       } else if (user.active === false) {
         return res.status(403).send({
           message: 'Usuário desativado'
         })
       }
       UserService.removeUser(user.id, function(err, userDelete) {
         if (err) {
           return res.status(503).send({
             message: err
           });
         }
         return res.status(200).send({
           message: 'Usuário excluido com sucesso'
         });
       });
     });
   } else {
     return res.status(403).send({
       message: 'Usuário não enviado'
     });
   }
 }


 module.exports = {
   disable: disable,
   update: update,
   getAll: getAll,
   getUser: getUser,
   create: create
 }