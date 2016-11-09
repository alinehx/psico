module.exports.email = {
	service: 'Mailgun',
	auth: {
	user: 'easymeet.service@gmail.com', 
	pass: 'teste@42'
	},
	templateDir: 'api/emailTemplates',
	from: 'admin@easymeet.com',
	testMode: false,
	ssl: true
}