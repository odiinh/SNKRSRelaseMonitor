# odiinthefirst/SNKRSReleaseMonitor
 
A Nike SNKRS announcement/release bot. Looks at the upcoming page (nike.com/gb/launch?s=upcoming) after a predefined amount minutes.
It then looks for new products and sends a discord webhook on detection.

## What you need to change

Here I will detail the lines you need to edit to make the web control panel and webhook poster work.

#### server.js
Line 25 & 31
```sh
res.send('<a href="*LOCALHOST OR AWS/GOOGLE CLOUD*">Back To Homepage');
```
Replace the text in the asterisks with the homepage for your server e.g. localhost:3000 or *example*.eu-west-2.elasticbeanstalk.com	

Line 95
```sh
const Hook = new webhook.Webhook("*YOUR WEBHOOK*");
```
Paste in your Discord webhook URL in the quotes, so the script knows where to post to.

Line 98
```sh
.setText("<@&ROLE-ID>")
```
Copy the role id of your alerts role and paste it in here. So the bot will ping the users who want to be notified.


## Running/Utillising the bot
After completing the steps above, run server.js (by doing 'node server' in a shell set to the directory) and open your web browser and go to the home page localhost:3000 or *example*.eu-west-2.elasticbeanstalk.com. It should look like this
[Imgur Link](https://i.imgur.com/QRprWcg.png)

- Type in the interval that you would like the bot to run e.g. 60
- Press start bot

If you want to change the interval go the the home page and **CLICK STOP SCRIPT** you must do this otherwise the bot will break, then put in the new interval and start the script again

To stop the monitor, click the 'STOP SCRIPT' button on the homepage.


## Deploying to an AWS Server
While running and testing the bot I used AWS Free Tier. To upload zip all the files up and upload as a new version of an application. This should work, however you may need to do some internet research, if you are new.
