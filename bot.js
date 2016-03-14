/*
	Written by Nic Mulvaney 
	Normally
*/

var Botkit = require('botkit');
var os = require('os');
var memwatch = require('memwatch-next');
var GoogleSpreadsheet = require("google-spreadsheet");
var bot, oldMessage, controller, loadedData;

if (!process.env.bot_token) {
    console.log('Error: Please specify bot token in environment');
    process.exit(1);
}

if (!process.env.google_url) {
    console.log('Error: Please specify google url in environment');
    process.exit(1);
}

if(process.env.GOOGLE_URL){
	process.env.GOOGLE_URL = process.env.GOOGLE_URL.match(/[-\w]{25,}/);
}

memwatch.on('leak', function(info) {
	console.log('MEMORY LEAK')
	console.log(info);
});

var my_sheet = new GoogleSpreadsheet(process.env.GOOGLE_URL);

var loadData = function(reload){
	if(bot){
		bot.closeRTM();
	}
	if(controller){
		delete controller;
	}
	controller = Botkit.slackbot({
			debug: false,
	});

	bot = controller.spawn({
		token: process.env.BOT_TOKEN
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
			var say = q.says.split('\n');
			say = say[Math.floor(Math.random() * say.length)];
			say = say.replace('$', message.match[1]);
			bot.reply(message, say);
		}
	};

	my_sheet.getRows( 1, function(err, row_data){
		loadedData = row_data;
		for(var key in row_data){
			(function(){
				var q = row_data[key];

				var hears = ('\\b'+q.hears.replace(/\n/g, '\\b\n\\b')+'\\b').split('\n');
				console.log(hears);
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


// To keep Heroku's free dyno awake
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);

