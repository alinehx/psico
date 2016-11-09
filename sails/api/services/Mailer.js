module.exports.acceptMeet = function(obj) {
	sails.hooks.email.send(
		'acceptMeet', 
		{Page: obj.page},
		{to: obj.email ,subject: 'Confirme seu comparecimento à reunião'},
		function(err){console.log(err || 'Mail Sent!');}
	)
}

module.exports.sendReportMail = function(obj) {
	sails.hooks.email.send(
		'sendReportMail',
		{Name: obj.name, Report: obj.report},
		{to: obj.email,subject: 'Extração de Relatório'},
		function(err){console.log(err || 'Mail Sent!');}
	)
}