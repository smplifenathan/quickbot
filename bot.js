

var Botkit = require('botkit');
var os = require('os');
var GoogleSpreadsheet = require("google-spreadsheet");
var bot, oldMessage;

var controller = Botkit.slackbot({
		debug: true,
});

var my_sheet = new GoogleSpreadsheet('1bUvxoGOKLqkhyNb6eTpiHkllFy2D0gFRGMhVrLNopzc');
var loadedData;

var loadData = function(reload){
	bot = controller.spawn({
		token: "xoxb-24874985728-F8NsGF5m5mIPnucBilxGldll"
	}).startRTM(function(){
		console.log('ready');
		if(reload){
			bot.reply(oldMessage, "I'm back!");
		}
	});

	var ask = function(message, convo, q){
		convo.ask(q.says,[
				{
					 pattern: bot.utterances.yes,
					 callback: function(response, convo) {
					 		convo.next();
							if(q.yes){
									var next = loadedData[q.yes-2];
									doo(message, next);
							}
					 }
				},
				{
					pattern: bot.utterances.no,
					callback: function(response, convo) {
						convo.next();
						if(q.no){
								var next = loadedData[q.no-2];
								doo(message, next);
						}
					}
				},
				{
					default: true,
					callback: function(response, convo) {
						  	convo.next();
						  	console.log('##OTHER');
						  	console.log(q.other);
							if(q.other){
									var next = loadedData[q.other-2];
									doo(message, next);
							}
					}
				}
			]);
	};

	var doo = function(message, q){
		if(q.conversation){
			bot.startConversation(message,function(err, convo) {
				ask(message, convo, q);
			});
		}else{
			var say = q.says.replace('$', message.match[1]);
			bot.reply(message, say);
		}
	};

	my_sheet.getRows( 1, function(err, row_data){
		loadedData = row_data;
		for(var key in row_data){
			(function(){
				var q = row_data[key];
				var hears = q.hears.split('\n');
				controller.hears(hears,'direct_message,direct_mention,mention',function(bot, message) {
					doo(message, q);
				});
			})();
		}
	});

	// Reboot the system
	controller.hears('reload','direct_message,direct_mention,mention',function(bot, message) {
		oldMessage = message;
		bot.reply(message,"Reloading... beep boop bip....");
		bot.rtm.close();
		loadData(true);
	});

};

loadData();



// var controller = Botkit.slackbot({
//     debug: true,
// });

// var bot = controller.spawn({
//     token: "xoxb-24900082337-IDrUGCXSNKcPewbGHfda536H"
// }).startRTM();


// controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

//     // bot.api.reactions.add({
//     //     timestamp: message.ts,
//     //     channel: message.channel,
//     //     name: 'robot_face',
//     // },function(err, res) {
//     //     if (err) {
//     //         bot.botkit.log('Failed to add emoji reaction :(',err);
//     //     }
//     // });


//     controller.storage.users.get(message.user,function(err, user) {
//         if (user && user.name) {
//             bot.reply(message,'Hello ' + user.name + '!!');
//         } else {
//             bot.reply(message,'Hello.');
//         }
//     });
// });

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

// controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

//     controller.storage.users.get(message.user,function(err, user) {
//         if (user && user.name) {
//             bot.reply(message,'Your name is ' + user.name);
//         } else {
//             bot.reply(message,'I don\'t know yet!');
//         }
//     });
// });


// controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

//     bot.startConversation(message,function(err, convo) {

//         convo.ask('Are you sure you want me to shutdown?',[
//             {
//                 pattern: bot.utterances.yes,
//                 callback: function(response, convo) {
//                     convo.say('Bye!');
//                     convo.next();
//                     setTimeout(function() {
//                         process.exit();
//                     },3000);
//                 }
//             },
//         {
//             pattern: bot.utterances.no,
//             default: true,
//             callback: function(response, convo) {
//                 convo.say('*Phew!*');
//                 convo.next();
//             }
//         }
//         ]);
//     });
// });


// controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

//     var hostname = os.hostname();
//     var uptime = formatUptime(process.uptime());

//     bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

// });

// function formatUptime(uptime) {
//     var unit = 'second';
//     if (uptime > 60) {
//         uptime = uptime / 60;
//         unit = 'minute';
//     }
//     if (uptime > 60) {
//         uptime = uptime / 60;
//         unit = 'hour';
//     }
//     if (uptime != 1) {
//         unit = unit + 's';
//     }

//     uptime = uptime + ' ' + unit;
//     return uptime;
// }
