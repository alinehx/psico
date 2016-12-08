'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require("fs");

var transporter = nodemailer.createTransport({
	service: "Yahoo",
    auth: {
		user: 'easymeet.grupo@yahoo.com',
		pass: 'teste@42'
    }
}); 



transporter.verify(function(error, success) {
   if (error) {
        console.log("[Mailer] FAILED: Server is not ready to start STMP services.", error);
   } else {
        console.log('[Mailer] SUCCESS: Server is ready to take our messages.');
   }
});

function sendAcceptMail(mailObject){
	sails.log('[Mailer] Executing sendAcceptMail.');
	var mailOptions = {
		from: 'administrador@easymeet.com.br',
		to: mailObject.email,
		subject: "Convite para comparecimento à reunião",
		generateTextFromHTML: true,
		html: 	"<p>Olá! Gostariamos de informar que você foi convidado para uma reunião através do easymeet.</p>" + 
				"<p>Para confirmar o comparecimento à reunião, ou cancelar seu comparecimento basta acessar " + mailObject.page + "</p>" + 
				"<br/>" +
				"<p>Atenciosamente, grupo easymeet.</p>",
		attachments: [
			{   // utf-8 string as an attachment
				filename: 'report.csv',
				content: 'hello;darkess;my;\nold;friend;hehe;'
			}
		]
	}
	doSend(mailOptions);
};

function sendReportMail(mailObject){
	sails.log('[Mailer] sendReportMail');
	var mailOptions = {
		from: 'administrador@easymeet.com.br',
		to: mailObject.email,
		subject: "Extração de Relatório",
		generateTextFromHTML: true,
		html: 	"<h4>Segue extração do report de" + mailObject.name + "</h4>" +
				"<br/>" +
				"<p><%=Report%></p>",
		attachments: [
			{   // utf-8 string as an attachment
				filename: 'report.csv',
				content: 'hello;darkess;my;\nold;friend;hehe;'
			}
		]
	}
	doSend(mailOptions);
};

var doSend = function(mailOptions){
	sails.log('[Mailer] Trying to send.');
	//createReportFile();
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			sails.log('[SendMail] AN ERROR OCURRED. ', error);
		} else {
			sails.log('[SendMail] MAIL WAS SENT SUCESSFULLY. ', info.response);
		}
	});
};

/*
function createReportFile(message){
	fs.writeFile('input.csv', message,  function(err) {
		if(err){
			sails.log('[createReportFile] ERROR: ', err);
		} else {
			sails.log('[createReportFile] SUCCESS: ', err);
		}
	});
};
*/

module.exports = {
	sendAcceptMail: sendAcceptMail,
	sendReportMail: sendReportMail
}