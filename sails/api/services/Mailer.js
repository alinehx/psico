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
	sails.log.info('[Mailer] Building sendAcceptMail to ' + mailObject.email);
	var page = 'http://easymeet.zapto.org/#/acceptpage/' + mailObject.page;
	var mailOptions = {
		from: '"Equipe Easymeet " <easymeet.service@outlook.com.br>',
		to: mailObject.email,
		subject: "Convite para comparecimento à reunião",
		generateTextFromHTML: true,
		html: 	"<div style='font-family: calibri light; color: #222'>" + 
				"<h3>Olá! Gostariamos de informar que você foi convidado para uma reunião através do <u> easymeet </u>.</h3>" + 
				"<br/>" +
				"<h3>Assunto da reunião: <b>" + mailObject.subj + "</b></h3>" + 
				"<h3>Descrição: <b>" + mailObject.desc + "</b></h3>" + 
				"<br/>" +
				"<h3>Para confirmar o comparecimento à reunião, ou cancelar seu comparecimento basta <a href='" + page + "'> Clicar aqui! </a></h3>" + 
				"<br/>" +
				"<h4>Atenciosamente, grupo easymeet.</h4>" + 
				"</div>"
	}
	doSend(mailOptions);
};

function sendReportMail(mailObject){
	sails.log.info('[sendReportMail] Building ReportMail.');
	var mailfilename = "Report-" + mailObject.name.trim() + '.csv';
	createReportFile(mailfilename, mailObject.report);
	var mailOptions = {
		from: '"Equipe Easymeet " <easymeet.service@outlook.com.br>',
		to: mailObject.email,
		subject: "Extração de Relatório",
		generateTextFromHTML: true,
		html: 	"<div style='font-family: calibri light; color: #222'>" + 
				"<h4>Segue em anexo a extração do report de " + mailObject.name + ".</h4>" +
				"<br/>" +
				"<h4>Atenciosamente, grupo easymeet.</h4>" + 
				"</div>",
		attachments: [
			{
				filename: mailfilename,
				content: fs.createReadStream(mailfilename)
			}
		]
	}
	doSend(mailOptions);
};

var doSend = function(mailOptions){
	sails.log.info('[Mailer] Sengding Request to mail host.');
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			sails.log.warn('[SendMail] An error ocurred. ', error);
			sails.log.warn('[SendMail] Error info: ', error.response);
		} else {
			sails.log.info('[SendMail] Mail sent to {' + mailOptions.to + '} with success. ');
		}
	});
};

function createReportFile(filename, message){
	fs.writeFile(filename, message,  function(err) {
		if(err){
			sails.log.info('[createReportFile] File was not created due to an error: ', err);
		} else {
			sails.log.info('[createReportFile] File {' + filename + '} created with success.');
		}
	});
};

module.exports = {
	sendAcceptMail: sendAcceptMail,
	sendReportMail: sendReportMail
}