'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require("fs");

var transporter = nodemailer.createTransport({
	host: 'smtp-mail.outlook.com',
	port: 587,
    auth: {
		user: 'easymeet.service@outlook.com.br',
		pass: 'easymeet42'
    },
	tls: {
        ciphers:'SSLv3',
		rejectUnauthorized: false
    }
});

transporter.verify(function(error, success) {
   if (error) {
        sails.log.warn("[Mailer] FAILED: Server is not ready to start STMP services.", error.stack);
   } else {
        sails.log.info('[Mailer] SUCCESS: Server is ready to take our messages.');
   }
});

function sendAcceptMail(mailObject){
	sails.log.info('[Mailer] Executing sendAcceptMail to ' + mailObject.email);
	createReportFile("um;dss;trss;qtr");
	var mailOptions = {
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
				content: fs.createReadStream('input.csv')
			}
		]
	}
	doSend(mailOptions);
};

function sendReportMail(mailObject){
	sails.log.info('[Mailer] sendReportMail');
	createReportFile("um;dss;trss;qtr");
	var mailOptions = {
		from: 'service@easymeet.com.br',
		to: mailObject.email,
		subject: "Extração de Relatório",
		generateTextFromHTML: true,
		html: 	"<h4>Segue extração do report de" + mailObject.name + "</h4>" +
				"<br/>" +
				"<p>" + mailObject.report + "</p>"
		
	}
	doSend(mailOptions);
};

var doSend = function(mailOptions){
	sails.log.info('[Mailer] Trying to send.');
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			sails.log.warn('[SendMail] AN ERROR OCURRED. ', error);
		} else {
			sails.log('[SendMail] MAIL WAS SENT SUCESSFULLY. ', info.response);
		}
	});
};


function createReportFile(message){
	fs.writeFile('input.csv', message,  function(err) {
		if(err){
			sails.log('[createReportFile] ERROR: ', err);
		} else {
			sails.log('[createReportFile] SUCCESS: ', err);
		}
	});
};


module.exports = {
	sendAcceptMail: sendAcceptMail,
	sendReportMail: sendReportMail
}