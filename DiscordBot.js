const Discord = require('discord.js');
const client = new Discord.Client();

var canales = {};
var nuevaData="";
var authorName="Death Gun";
var botVersion="0.2";

var token=;

var cfgData = {
	
	ayuda : {
		call : function(msg,args) {
			MostrarComandos(msg);
		},
		data : {
			a:"h","help":"Mostrar comandos"
		}
		
	},
	canal : {
		call : function(msg,args) {
			if (args.length==1) {
				var canalesBot="";
				for (var key in cfgData.canal.data.list) {
					canalesBot+=key+"\n";
				}
				msg.channel.send("Subcomandos:\n"+canalesBot+"Ejemplo: "+
				cfgData.prefijo.data.name+"canal Bienvenida");
			} else {
				//canales[args[1]]=;
				if (args[1] in canales) {
					if (canales[args[1]]!=null) {
						cfgData.canal.data.list[args[1]]="";
						canales[args[1]]=null;
						msg.channel.send("Se borro este canal...");
					} else {
						cfgData.canal.data.list[args[1]]=msg.channel.id;
						canales[args[1]]=msg.channel;
						msg.channel.send("Se establecio este canal como canal "+args[1]);
					}
				} else {
					cfgData.canal.data.list[args[1]]=msg.channel.id;
					canales[args[1]]=msg.channel;
					msg.channel.send("Se creo el canal "+args[1]);
				}
				SaveData();
			}
		},
		data : {
			a:"sc",
			"admin_help":"Elije un canal para que el bot diga cosas",
			list:{
				Bienvenida:"",Despedida:"",Spam:"",General:"",Staff:"",Confesiones:""
			}
		}
	},
	
	prefijo : {
		call : function(msg,args) {
			
			if (CheckAdmin(msg.member)) {
				if (args.length==1) {
					cfgData.prefijo.data.name = "";
					msg.channel.send("Se elimino el prefijo");
				} else {
					cfgData.prefijo.data.name = args[1];
					msg.channel.send("El nuevo prefijo es "+args[1]);
				}
				SaveData();
			} else msg.reply("No tienes permiso");
		},
		data : {a:"p","admin_help":"Prefijo para comandos",name:""}
	},
	
	msg_bienvenida : {
		call : function(msg,args) {
			if (CheckAdmin(msg.member)) {
				if (args.length>1) {
					cfgData.msg_bienvenida.data.canal = args[1];
					nuevaData="Mensaje modificado";
					SaveData();
				} else {
					BroadcastWelcome(msg.member);
					//nuevaData="El mensaje de bienvenida es: "+cfgData.msg_bienvenida.data.msg;
					nuevaData="Ejemplo: "+cfgData.prefijo.data.name+'msg_bienvenida "Mensaje de ejemplo';
				}
				msg.channel.send(nuevaData);
			} else msg.reply("No tienes permiso");
		},
		data : {a:"mb","admin_help":"Mensaje de bienvenida al servidor",
		msg:"UNA LEYENDA HA NACIDO "}
	},
	
	img_bienvenida : {
		call : function(msg,args) {
			if (CheckAdmin(msg.member)) {
				if (args.length>1) {
					cfgData.img_bienvenida.data.img = args[1];
					nuevaData="Imagen modificada";
					SaveData();
				} else {
					nuevaData="La imagen de bienvenida es: "+cfgData.img_bienvenida.data.img;
					nuevaData+="\nModificar: "+cfgData.prefijo.data.name+'img_bienvenida https://imagen';
				}
				msg.channel.send(nuevaData);
			} else msg.reply("No tienes permiso");
		},
		data : {a:"ib","admin_help":"Imagen de bienvenida",img:""}
	},
	
	dm_bienvenida : {
		call : function(msg,args) {
			
			if (CheckAdmin(msg.member)) {
				/*if (args.length==1) SendWelcome(msg.member);
				else {*/
				if (args.length==1) {
					
					msg.channel.send("Modo de uso: "+cfgData.prefijo.data.name+'b[ t "Titulo"][ d "Contenido"][ c color]');//.then(
					/*.then(
					SendWelcome(msg.member));*/
					//var timeOut = setTimeout(SendWelcome,1000,msg.member.user);
					//SaveData();
					//}
					var timeOut = setTimeout(SendWelcome,1000,msg.member.user);
					return;
				}
				var index=args.indexOf("t");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.title = args[index+1];
				index=args.indexOf("title");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.title = args[index+1];
				index=args.indexOf("d");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.desc = args[index+1];
				index=args.indexOf("desc");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.desc = args[index+1];
				index=args.indexOf("c");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.color = args[index+1];
				index=args.indexOf("color");
				if (index!=-1&&args.length>=index+2) cfgData.dm_bienvenida.data.color = args[index+1];
				
					SaveData();
				
			} else msg.reply("No tienes permiso");
		},
		data : {
			a:"b",
			"admin_help":"Mensaje privado al entrar al server",
			title:"Bienvendio",
			color:"ORANGE",
			desc:'Hola! Respeta y seras respetado...'
		}
	},
	
	macro : {
		call : function(msg,args) {
			
			if (args.length==1) MostrarMacros(msg);
			else if (CheckAdmin(msg.member)) {
				if (args.length==2) {
					delete cfgData.macro.data.macros[args[1]];
					SaveData();
				} else if (args.length==3) {
					cfgData.macro.data.macros[args[1]] = args[2];
					SaveData();
				} else msg.reply("Si el valor de macro tiene espacios inicia el mensaje con \"");
			} else msg.reply("No tienes permiso");
		},
		data : {
			a:"m",
			"help":"Mensajes prefijados",
			"admin_help":"Crear macro: macro saludo \"Hola mundo\"",
			macros: {
				"ip":'no establecida'
			}
		}
	},
	
	alias : {
		call : function(msg,args) {
			
			if (CheckAdmin(msg.member)) {
				if (args.length==1) {
					msg.reply("Faltan parametros, ejemplo: alias online players");
					return;
				}
				if (!(args[1] in cfgData)) {
					msg.channel.send("el comando "+args[1]+" no existe");
					return;
				}
				if (args.length==2) {
					msg.channel.send("el alias de "+args[1]+" es "+cfgData[args[1]].data.a);
				} else if (args.length==3) {
					cfgData[args[1]].data.a = args[2];
					SaveData();
				} else msg.reply("Si el valor del alias tiene espacios inicia el mensaje con \"");
			} else msg.reply("No tienes permiso");
		},
		data : {
			a:"a",
			"admin_help":"Comandos alias, cambiar la forma secundaria de ingresar un comando"
		}
	},

	say : {
		call : function(msg,args) {
			if (CheckAdmin(msg.member)) {
				if (args.length>1) {
					msg.channel.send(GenerarEmbed(args))
					.then(message => console.log(`Say embed: ${message.content}`))
					.catch(console.error);
				} else {
					msg.channel.send("Faltan parametros... Ejemplo:\n"+
					cfgData.prefijo.data.name+'say "Soy un mensaje"[ "Titulo"[ "url.imagen.jpg"]]');
				}
			} else msg.reply("No tienes permiso");
		},
		data : {
			a:"d",
			"admin_help":"Hacer que el bot diga algo"
		}
	}
};

client.on('ready', () => {
	console.log(`${client.user.tag} Bot v${botVersion} Creado por ${authorName}!`);
	fs.readFile('./data.json', function(err, data) {
		if (err) {
		  if (err.code === 'ENOENT') {
			console.error('Bienvenido a Yautja Bot');
			return;
		  }
		  throw err;//otro error que no es el archivo no existe
		}
	  //se ejecuta si el archivo existe, creo?
	  //header=LeerHeader(Buffer.from(data,"hex"));
	  //var 
	  var newData = JSON.parse(data);
	  
	  //console.log(newData);
	  
	  //update from newData
	  //cfgData = JSON.parse(data); cause versioning bugs
	  
	  //unused keys off newData are droped on writeFile
	  for (var key in cfgData) {
		  if (key in newData) {
			  for (var d in cfgData[key].data) {
				  if (d in newData[key]) cfgData[key].data[d] = newData[key][d];
			  }
		  }
	  }
	  for (var id in cfgData.canal.data.list) {
		  if (cfgData.canal.data.list[id]!="") canales[id] = client.channels.cache.find(channel => channel.id == cfgData.canal.data.list[id]);
	  }
	});
});

client.on('message', msg => {
	
	if (msg.author.bot) return;
		//console.log(msg.content);
	
	var args = ToArgs(msg.content);
	nuevaData="error";
	
	if (args.length==0) return;//alguien pudo escribir ""
	
	//var arg=args[0];
	//if (arg.startsWith(cfgData.prefijo.data.name)) arg.replace(cfgData.prefijo.data.name,"");
	var arg = SearchCommand(args[0]);
	var doyoumean=[];
	if (msg.content.startsWith(cfgData.prefijo.data.name)) {
		doyoumean=SearchString(args[0], Object.keys(cfgData));
		//console.log(doyoumean);
	}
		//console.log(arg);
	if (arg != false) {
		cfgData[arg].call(msg,args);
	} else if (doyoumean.length>0) msg.channel.send("Quiziste decir "+cfgData.prefijo.data.name+doyoumean[0]+"?");
	else if (args[0] in cfgData.macro.data.macros) msg.channel.send(cfgData.macro.data.macros[args[0]]);
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  //const channel = member.guild.channels.cache.find(ch => ch.name.includes(cfgData.canal_bienvenida.data.canal));
  //const channel = client.channels.cache.get(cfgData.canal_bienvenida.data.canal);
  // Do nothing if the channel wasn't found on this server
  //if (!channel) return;
  // Send the message, mentioning the member
  //channel.send(cfgData.msg_bienvenida.data.msg+", "+member.user.username);
  BroadcastWelcome(member);
  
  var timeOut = setTimeout(SendWelcome,1000,member.user);
  
});

function SearchFilter(prof) {
	// Filter results by doing case insensitive match on name here
	return prof.toLowerCase().includes(keyword.toLowerCase());
}

function SearchString(keyword, profile) {
	//Object.keys(cfgData);
	SearchFilter=function (prof) {
		
		// Filter results by doing case insensitive match on name here
		return (cfgData.prefijo.data.name+prof).toLowerCase().includes(keyword.toLowerCase());
	};
	return profile
    .filter(SearchFilter)
    .sort((a, b) => {
        // Sort results by matching name with keyword position in name
        if(a.toLowerCase().indexOf(keyword.toLowerCase()) > b.toLowerCase().indexOf(keyword.toLowerCase())) {
            return 1;
        } else if (a.toLowerCase().indexOf(keyword.toLowerCase()) < b.toLowerCase().indexOf(keyword.toLowerCase())) {
            return -1;
        } else {
            if(a > b)
                return 1;
            else
                return -1;
        }
    });
}

function SearchCommand(arg) {
	//buena function :)
	//var command="";
	//if (cmd in cfgData) command=cfgData[cmd].data.a;
	//if (arg in cfgData) return true;
	for (var key in cfgData) {
		if (cfgData.prefijo.data.name+key == arg) return key;
		if (cfgData.prefijo.data.name+cfgData[key].data.a == arg) return key;
	}
	//if (arg == cfgData.prefijo.data.name+command && command!="" || arg == cfgData.prefijo.data.name+cmd) return true;
	return false;
}

function GenerarEmbed(args) {
  
	var title="OwO";
	
	if (args.length>2) title=args[2];
	
	var embed = new Discord.MessageEmbed()
		// Set the title of the field
		.setTitle(title)
		// Set the color of the embed
		.setColor("ORANGE")
		// Set the main content of the embed
		.setDescription(args[1]);
	  // Send the embed to the same channel as the message
	  //const dmChannel = member.createDM();
  if (args.length>3) embed.setImage(args[3]);
	
	return embed;
}

function MostrarMacros(msg) {
  
	var macro = "";
	for (const key in cfgData.macro.data.macros) {
	  macro += key+"\n";
	}
	const embed = new Discord.MessageEmbed()
		// Set the title of the field
		.setTitle("Textos prefijados")
		// Set the color of the embed
		.setColor("ORANGE")
		// Set the main content of the embed
		.setDescription(macro);
	  
	if (CheckAdmin(msg.member)) {
		embed.addField('Modo de uso',cfgData.prefijo.data.name+'macro [comando ["valor"]]');
		  embed.addField('Crear/Editar comando "wipe"',cfgData.prefijo.data.name+'macro wipe "Proximo wipe: 1/1/21\\nNueva linea"');
		  embed.addField('Eliminar comando "wipe"',cfgData.prefijo.data.name+'macro wipe');
	}
	  embed.setFooter('Metodo abreviado: '+cfgData.prefijo.data.name+cfgData.macro.data.a);
	  msg.channel.send(embed);
	  
}

function BroadcastWelcome(member) {
	//var channel = member.guild.channels.cache.find(ch => ch.name.includes(cfgData.canal_bienvenida.data.canal));
  //const channel = client.channels.cache.get(cfgData.canal_bienvenida.data.canal);
  // Do nothing if the channel wasn't found on this server
  if (!("Bienvenida" in canales)) return;
  if (canales["Bienvenida"]==null) return;
	var embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(cfgData.msg_bienvenida.data.msg)
      // Set the color of the embed
      .setColor("ORANGE")
      // Set the main content of the embed
      .setDescription(`<@${member.user.id}>`);
	
	if (cfgData.img_bienvenida.data.img!="") embed.setImage(cfgData.img_bienvenida.data.img);
	//if (cfgData.img_bienvenida.data.img!="") embed.setImage(cfgData.img_bienvenida.data.img+"?s="+encodeURI(member.user.username)+"&"+Math.random());
  canales["Bienvenida"].send(embed)
  .then(message => console.log(`Nuevo user: ${member.user.username}`))
  .catch(console.error);
}

function SendWelcome(user) {
  
  var embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(cfgData.dm_bienvenida.data.title)
      // Set the color of the embed
      .setColor(cfgData.dm_bienvenida.data.color)
      // Set the main content of the embed
      .setDescription(cfgData.dm_bienvenida.data.desc);
    // Send the embed to the same channel as the message
	//const dmChannel = member.createDM();
  
  //if (!dmChannel) return;
  
		//dmChannel.send(embed);
		//member.user.send(embed);
		user.send(embed)
  .then(message => console.log(`Enviado pm`))
  .catch(console.error);
  //member.send
}

function ToArgs(str) {
	
	var strings = str.split(' ');
	var args = [];//asegurarme que 
	//var string = false;
	var buffer="";
	for (var i=0;i<strings.length;i++) {
		if (strings[i].startsWith("'")||strings[i].startsWith('"')) {
			buffer=strings[i].slice(1);
			if (strings[i].endsWith("'")||strings[i].endsWith('"')) {
				//string=false;
				args.push(buffer.slice(0,-1));
				buffer="";
				continue;
			}
			//string=true;
		} else if (buffer!="") buffer+=" "+strings[i];
		else {
			args.push(strings[i].toLowerCase());
			continue;
		}
		if (strings[i].endsWith("'")||strings[i].endsWith('"')) {
			//string=false;
			args.push(buffer.slice(0,-1));
			buffer="";
		}
		/*
		if (!string) args = args.concat(strings[i].toLowerCase().split(" "));
		else args = args.concat(strings[i]);
		string = !string;*/
	}
	if (buffer!="") args.push(buffer);//por si alguien no cerro sus comillas
	for (i=0;i<args.length;i++) {
		if (args[i]=="") {
			args.splice(i,1);
			i--;
		}
	}
	
	return args;
	
}

function SaveData() {
	
	var newData={};
	
	for (var key in cfgData) {
		newData[key]=cfgData[key].data;
	}
	
	fs.writeFile('./data.json', JSON.stringify(newData,null,"\t"), function (err) {
		if (err) {
			if (err.code === 'ENOENT') {
			  console.error('file does not exist');
			  return;
			}
			throw err;//otro error que no es el archivo no existe
		}
	});
	
}

function CheckAdmin(member) {
	//if (member.roles.highest.position==0||member.hasPermission("ADMINISTRATOR")) return true;
	if (member==null) return false;
	if (member.hasPermission("ADMINISTRATOR")) return true;
	if (member.user.username==ownerName) return true;
	return false;
}

function MostrarComandos(msg) {
	/*var comandos = "";
	for (const key in cfgData) {
	  comandos+=key+"\n";
	}*/
	const embed = new Discord.MessageEmbed()
		// Set the title of the field
		.setTitle("Ayuda Comandos")
		// Set the color of the embed
		.setColor("ORANGE")
		// Set the main content of the embed
		.setDescription("Usar comando: "+cfgData.prefijo.data.name+"comando \"parametro requerido\" [\"parametro opcional\"]");
	  var admin=CheckAdmin(msg.member);
  var helpText;
	for (const key in cfgData) {
		helpText="";
		if ("help" in cfgData[key].data) helpText=cfgData[key].data.help;
		  if ("admin_help" in cfgData[key].data&&CheckAdmin(msg.member)) {
			  if (helpText=="") helpText=cfgData[key].data.admin_help
			  else helpText+="\n"+cfgData[key].data.admin_help
		  }
		  //if ("help" in cfgData[key].data) embed.addField("["+key+", "+cfgData[key].data.a+"]",cfgData[key].data.help);
	  if (helpText!="") embed.addField(key+", "+cfgData[key].data.a, helpText);
	}
	  //embed.setFooter('Metodo abreviado: '+cfgData.prefijo.data.valor+'h');
	  //msg.channel.send(embed);
	  msg.channel.send(embed);
  }

client.login(token);
