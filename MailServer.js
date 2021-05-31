//mail server by estantaya

const simpleParser = require('mailparser').simpleParser;
const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
	size:7000000,
    disabledCommands: ['STARTTLS', 'AUTH'],
    //secure: true,
    logger: true,
	onData(stream, session, callback) {
		//stream.pipe(process.stdout); // print message to console
		const chunks = [];
		
		stream.on("data", function (chunk) {
			chunks.push(chunk);
		});
		
		//var uwu=JSON.stringify(session,null,"\t");
		//console.log("session debug: "+uwu);
		//var ses=JSON.parse(uwu);
		/*
		var newMail={};
		console.log(session.envelope);
		newMail["address"]=ses.envelope["remoteAddress"];
		newMail["hostname"]=ses.envelope["clientHostname"];
		newMail["fromEmail"]=ses["mailFrom"];
			//to:toEmail.length==0?"enviado a nadie":toEmail
		newMail["toEmail"]=ses["rcptTo"];
		newMail["attachments"]=[];
		console.log(newMail);*/
		console.log("session debug: "+JSON.stringify(session,null,"\t"));
		var newMail={
			address:session.remoteAddress,
			hostname:session.clientHostname,
			fromEmail:session.envelope.mailFrom,
			toEmail:session.envelope.rcptTo,
			attachments:[],
		}
		stream.on("end", () => {
			const buffer  = Buffer.concat(chunks);
			chunks.length=0;
			//const str = buffer.toString("utf-8");
			simpleParser(buffer).then(mail => {
				
				newMail["subject"]=mail.subject;
				newMail["date"]=mail.date;
				newMail["textAsHtml"]=mail.textAsHtml;
				//if (err) content=JSON.stringify(err,null,"\t");
				//else 
				let ts = Date.now();
				var emailFileName=Math.floor(ts/1000)+' '+mail.from.value[0].address+'.json';
				emailFileName='./email/'+emailFileName.replace(/[/\\?%*:|"<>]/g, '-');//replace(/([^a-z0-9 .]+)/gi, '_');
				console.log("guardando email... "+emailFileName);
				//console.log(mail);
				//var toEmail=session.envelope.rcptTo;
				//[0].address.split('@');
				//var toEmail=session.envelope.rcptTo[0].address.split('@');
				//var fromEmail=session.envelope.mailFrom.address;
				mail.attachments.forEach(function(item){
					console.log("guardando attachment... "+item.filename);
					newMail.attachments.push(item.filename);
					//console.log(item);
					//var data=Buffer.from(item.content.data);
					//var data=new byte(item.content.data);
					var aFileName="./email/"+mail.from.value[0].address+" "+item.filename;
					if (newMail.toEmail.length>0) {
						if (newMail.toEmail[0].split('@')[0]=="plugins") {
							aFileName='../rustserver/oxide/plugins/'+item.filename;
						}
					}
					fs.writeFile(aFileName, item.content, "binary", function (err) {
						if (err) {
							if (err.code === 'ENOENT') {
							  console.error('no se pudo guardar '+aFileName);
							  return;
							}
							throw err;//otro error que no es el archivo no existe
						}
					});
				});
				fs.writeFile(emailFileName, JSON.stringify(newMail,null,"\t"), function (err) {
					if (err) {
						if (err.code === 'ENOENT') {
						  console.error('no se pudo guardar ');
						  return;
						}
						throw err;//otro error que no es el archivo no existe
					}
				});
			});
			callback(null, "Mensaje recibido!");//error, respuesta
		});
	}
});

server.listen(25);