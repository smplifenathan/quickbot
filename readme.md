# QuickBot

<img src="quickbot.png"/>
> A quick and easy Slackbot using Google Sheets. No programming needed.


## Setup

To use this slackbot you need a [Slack](), [Heroku]() and [Google Docs]() account.

1. <a href="https://my.slack.com/services/new/bot" target="_blank">Add a bot configuration</a> on Slack.

2. <a href="https://docs.google.com/spreadsheets/u/1/d/1FOsDXyyO7ZSfFYcW1GO7V7iV240eFjDjus8yJ6Ytl1o/copy" target="_blank">Copy this</a> spreadsheet to your google docs and make it public *File > Publish to the web... > Publish*

3. [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)<br/>enter the bot **API token** and the Google Sheet **URL**. 
<br/><br/>

Once installed, send a direct message to your new bot from within Slack. **IMPORTANT:** If you wish, you can keep your bot alive by upgrading to Heroku Hobby otherwise it will sleep for 6 hours a day.

## Usage

```hears``` can be multiline. If the bot hears any of these phrases it will say a random line from the ```says``` cell. Case and punctuation are ignored. 

When ```conversation``` is set to TRUE will expect an answer. Control which row the conversation moves to in the ```yes```, ```no``` and ```other``` cells.

Words and phrases can be extracted from the conversation using ```(.*)``` in ```hears``` and repeated with ```$``` in ```says```

##### Reloading

Just type ```reload``` in your Slack chat and the bot will reload the changes from the spreadsheet.

## About

Written by [Nic Mulvaney](https://github.com/mulhoon) at [Normally](http://normally.com) using [Botkit](https://github.com/howdyai/botkit) and [Node Google Spreadsheet](https://github.com/theoephraim/node-google-spreadsheet)