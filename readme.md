# Slackbot + Spreadsheet

> A quick and easy Slackbot using Google Sheets. No programing needed.


## Setup

To use this slackbot you need a [Slack](), [Heroku]() and [Google Docs]() account.

1. [Add a bot configuration](https://my.slack.com/services/new/bot) on Slack.
2. [Copy this](https://docs.google.com/spreadsheets/u/1/d/1FOsDXyyO7ZSfFYcW1GO7V7iV240eFjDjus8yJ6Ytl1o/copy) spreadsheet to your google docs and make it public *File > Publish to the web... > Publish*
4. [Deploy to Heroku](https://heroku.com/deploy) - enter the bot **API token** and the Google Sheet **URL**. 

Once installed, send up a direct message to your new bot from within Slack.<br/>
**IMPORTANT:** If you wish, you can keep your bot alive by upgrading to Heroku Hobby otherwise it will sleep for 6 hours a day.

## Usage

```hears``` can be multiline. If the bot hears any of these phrases it will say a random line from the ```says``` cell. Case and punctuation are ignored. 

When ```conversation``` is set to TRUE will expect an answer. Control which row the conversation moves to in the ```yes```, ```no``` and ```other``` cells.

Words and phrases can be extracted from the conversation using ```(.*)``` in ```hears``` and repeated with ```$``` in ```says```

#### Reloading

Just type ```reload``` in your Slack chat and the bot will reload the changes from the spreadsheet.