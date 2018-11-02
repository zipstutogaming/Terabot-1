const Discord = require('discord.js');

const client = new Discord.Client();

var prefix = "*";

const ytdl = require('ytdl-core');

const queue = new Map();

var servers = {};

client.login(process.env.TOKEN);

function play(connection, message) {
  
    var server = servers[message.guild.id];
  
    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  
    server.queue.shift();
  
    server.dispatcher.on("end", function() { 
      if (server.queue[0]) play(connection, message);
  
      else connection.disconnect();
  
    });
  }
  
  client.on("ready", () => {
  
      console.log("Je suis prêt !");
      client.user.setActivity("t'espioner *help :D");
  
  });
  
  client.on('message', async message => { 
  
      if(message.content === "Bonjour"){
          message.reply("Bonjour :smile: !");
          console.log('Le bot dit bonjour');
      }
  
      if(message.content === prefix + "help") {
        var aide_embed = new Discord.RichEmbed()
        .setColor('#FFD700')
        .setTitle(` Voici mes catégories d'aide !`)
        .setDescription(`Voici mes commandes disponibles :`)
        .setThumbnail(message.author.avatarURL)
        .addField(":tools: Modération", "Fais `*mod` pour voir mes commandes de modération !")
        .addField(":tada: Fun", "Fais `*fun` pour voir mes commandes d'animation !")
        .setFooter("© 2018 TeraCube")
        .setTimestamp()
        message.channel.send(aide_embed);
      }

      if(message.content === "*ip"){
        message.reply("IP teracube.mcpe.eu Port 19144");
        console.log('Le bot donne l ip ');
      }
      if(message.content === "*contact"){
        message.reply("Pour nous contacter envoie un mail a l'adresse contact@teracube.hmsw.fr ");
        console.log('Le bot donne les contact ');
      }

      if(message.content === "*vote"){
        message.reply("Vas voter a l'adresse https://minecraftpocket-servers.com/server/67382/vote/ puis fait /vote dans le jeux pour gagné des cadeaux !");
        console.log('Le bot donne le lien de vote ');
      }

      if(message.content === prefix + "mod") {
        var mod_embed = new Discord.RichEmbed()
        .setColor('#FFD700')
        .setTitle(`Voici mes commandes modérations !`)
        .setThumbnail(message.author.avatarURL)
        .addField("*clear nombre", "Supprime le nombre de messages indiqué")
        .addField("*mute <@user>", "Mute l'utilisateur mentionné")
        .addField("*unmute <@user>", "Unmute l'utilisateur mentionné")
        .setFooter("© 2018 TeraCube")
        .setTimestamp()
        message.channel.send(mod_embed);
      }
   
      if(message.content === prefix + "fun") {
        var fun_embed = new Discord.RichEmbed()
        .setColor('#FFD700')
        .setTitle(`Voici mes commandes amusantes !`)
        .setThumbnail(message.author.avatarURL)
        .addField("Bonjour", "Le bot répond !")
        .addField("*stats", "Le bot vous envoie des informations sur votre profil !")
        .addField("*info", "Donne des informations sur le bot et le serveur !")
        .addField("*contact", "Donne des informations sur le contact !")
        .addField("*ip","Donne l'ip du serveur")
        .addField("*vote","Donne le lien de vote du serveur")
        .setFooter("© 2018 TeraCube")
        .setTimestamp()
        message.channel.send(fun_embed);
      }

      if(message.content === prefix + "annonce") {
        var fun_embed = new Discord.RichEmbed()
        .setColor('#FFD700')
        .setTitle(`Bonjour je suis le TeraBot J'arrive prochainement .`)
        .setThumbnail(message.author.avatarURL)
        .addField("J'arrive avec plein de commande amusente pour vous jouer des mauvais tour :smile: !", "N'oublier jamais sans vous TeraCube n'existerais pas !")
        .addField("-=@everyone=-" ,":kissing_closed_eyes:" )
        .setFooter("© 2018 TeraCube")
        .setTimestamp()
        message.channel.send(fun_embed);
      }
  
      if (!message.content.startsWith(prefix)) return;
  
      var args = message.content.substring(prefix.length).split(" ");
  
      switch (args[0].toLowerCase()) { 
  
          case "stats":
  
          var userCreateDate = message.author.createdAt.toString().split(" ");
          var msgauthor = message.author.id;
  
          var stats_embed = new Discord.RichEmbed()
          .setColor("#FFD700")
          .setTitle(`Statistiques du joueurs : ${message.author.username}`)
          .addField(`ID du joueurs `, msgauthor, true)
          .addField(`Date d'inscription du joueur :`, userCreateDate[1] + ' ' + userCreateDate[2] + ' ' + userCreateDate[3])
          .setThumbnail(message.author.avatarURL)
          message.reply("Tu peux regarder tes messages privés !")
          message.author.send(stats_embed);
  
          break;
          
    case "play":
  
      if (!args[1]) {
  
      message.channel.sendMessage("Tu dois m’indiquer un lien YouTube"); 
  
      return;
  
    }
  
      if(!message.member.voiceChannel) {
  
      message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 
  
      return;
  
    }
  
  
      if(!servers[message.guild.id]) servers[message.guild.id] = {
  
      queue: []
  
    };
  
  
    var server = servers[message.guild.id];
  
  
    server.queue.push(args[1]);
  
    if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
  
    play(connection, message) 
  
    });
  
    break; 
  
    case "skip":
  
      if(!message.member.voiceChannel) {
  
      message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 
  
      return;
  
    }
  
      var server = servers[message.guild.id];
  
      if(server.dispatcher) server.dispatcher.end();
  
      break;
  
      case "stop":
  
      if(!message.member.voiceChannel) 
      
      return message.channel.send(":x: Tu dois être dans un salon vocal");
  
      message.member.voiceChannel.leave();
  
      break;
    
    }
  
      if(message.content === prefix + "info") {
          var info_embed = new Discord.RichEmbed()
          .setColor("#FFD700")
          .setTitle("Voici les informations sur moi et le serveur !")
          .addField(" :robot: Nom :", `${client.user.tag}`, true)
          .addField("Descriminateur du bot", `#${client.user.discriminator}`)
          .addField("ID ", `${client.user.id}`)
          .addField("Nombre de membres", message.guild.members.size)
          .addField("Nombre de catégories et de salons", message.guild.channels.size)
          .setFooter("© 2018 TeraCube")
          message.channel.sendMessage(info_embed)
          console.log("Un utilisateur a effectué la commande d'info !")
      }
  
      if(message.content.startsWith(prefix + "clear")) {
          if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGE")) return message.channel.send("Vous n'avez pas la permission !");
  
          let args = message.content.split(" ").slice(1);
  
          if(!args[0]) return message.channel.send("Tu dois préciser un nombre de messages à supprimer !")
          message.channel.bulkDelete(args[0]).then(() => {
              message.channel.send(`${args[0]} messages ont été supprimés !`);
          });
      }
  
      if(message.content.startsWith(prefix + "mute")) {
          if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas la permission !");
  
          if(message.mentions.users.size === 0) {
              return message.channel.send('Vous devez mentionner un utilisateur !');
          }
  
          var mute = message.guild.member(message.mentions.users.first());
          if(!mute) {
              return message.channel.send("Je n'ai pas trouvé l'utilisateur ou il l'existe pas !");
          }
  
          if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.channel.send("Je n'ai pas la permission !");
          message.channel.overwritePermissions(mute, { SEND_MESSAGES: false}).then(member => {
              message.channel.send(`${mute.user.username} est mute !`);
          });
      }
  
      if(message.content.startsWith(prefix + "unmute")) {
          if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas la permission !");
  
          if(message.mentions.users.size === 0) {
              return message.channel.send('Vous devez mentionner un utilisateur !');
          }
  
          var mute = message.guild.member(message.mentions.users.first());
          if(!mute) {
              return message.channel.send("Je n'ai pas trouvé l'utilisateur ou il l'existe pas !");
          }
  
          if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.channel.send("Je n'ai pas la permission !");
          message.channel.overwritePermissions(mute, { SEND_MESSAGES: true}).then(member => {
              message.channel.send(`${mute.user.username} n'est plus mute !`);
          });
      }

  });
