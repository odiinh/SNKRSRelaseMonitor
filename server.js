const fs = require('fs')
const JSSoup = require('jssoup').default;
const axios = require('axios')
const express = require('express')
const app = express()

const { PORT = 3000 } = process.env

console.log('PORT', PORT)

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname}));
app.use(express.static(__dirname));
app.get('/db', (req, res) => res.sendFile('shoes.json', { root: __dirname}));

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
)

var timer = null;

app.post('/runScript', function (req, res) {
    res.send('<a href="*LOCALHOST OR AWS/GOOGLE CLOUD*">Back To Homepage');
    let milliseconds = req.body.recurInterval * 60000

    timer = setInterval(async function(){ monitor() }, parseInt(milliseconds))
});
app.post('/stopScript', function (req, res) {
    res.send('<a href="*LOCALHOST OR AWS/GOOGLE CLOUD*">Back To Homepage');
    clearInterval(timer)
});



async function monitor() {
    try {
        const newsurl = "https://www.nike.com/gb/launch?s=upcoming";
        await axios.get(newsurl, {headers: {"connection":"keep-alive",
        "cache-control":"max-age=0",
        "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "upgrade-insecure-requests":"1",
        "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36",
        "accept-encoding":"gzip, deflate, sdch",
        "accept-language":"en-US,en;q=0.8,et;q=0.6"
        }}).then(async function (response) {
                const page = response.data
                //console.log(page)
                var soup = new JSSoup(page);
                const links = soup.findAll('a', 'card-link')
                const shoemake = soup.findAll('h3', 'headline-5')
                const shoemodel = soup.findAll('h6', 'headline-3')
                const month = soup.findAll('p', 'headline-4')
                const date = soup.findAll('p', 'headline-1' )
                const imgs = soup.findAll('img', 'image-component')
                const runningtime = links.length / 2

                fs.readFile('./shoes.json', 'utf8', async function(err, data) {
                            if (err) {
                                console.log(`Error reading file from disk: ${err}`);
                            }
                            else {
                                var i
                                const databases = JSON.parse(data);  
                                for (i = 0; i < runningtime; i++){
                                    await console.log(i)
                                    const URL = `http://nike.com${links[i].attrs.href}`
                                    console.log(URL)
                                    await axios.get(URL, {headers: {"connection":"keep-alive",
                                    "cache-control":"max-age=0",
                                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                    "upgrade-insecure-requests":"1",
                                    "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36",
                                    "accept-encoding":"gzip, deflate, sdch",
                                    "accept-language":"en-US,en;q=0.8,et;q=0.6"
                                    }}).then(function (response) {
                                        const page2 = response.data
                                        var soup2 = new JSSoup(page2)
                                        const itmprice = soup2.find('div', 'headline-5')
                                        const shoename = shoemake[i].text + ': ' + shoemodel[i].text
                                        const apost = shoename.replace(/&#x27;/g, "'")
                                        const shoedata = {
                                            shoe: apost,
                                            releasedate: month[i].text + ': ' + date[i].text,
                                            price: itmprice.text,
                                            image: imgs[i+runningtime].attrs.src,
                                            link: `http://nike.com${links[i].attrs.href}`
                                        };
                                        if (data.search(apost) === -1){
                                            databases.push(shoedata);
                                            console.log(shoedata)

                                            const webhook = require("webhook-discord");
                                            const Hook = new webhook.Webhook("*YOUR WEBHOOK*");
    
                                            const msg = new webhook.MessageBuilder()
                                                            .setText("<@&ROLE-ID>")
                                                            .setName("Nike SNKRS Monitor")
                                                            .setColor("#00ff55")
                                                            .setTitle(apost)
                                                            .setDescription(`**PRICE: ${itmprice.text} \n\nRELEASE DATE: ${month[i].text}, ${date[i].text}**`)
                                                            .setImage(imgs[i+runningtime].attrs.src)
                                                            .setTime()
                                                            .setURL(`http://nike.com${links[i].attrs.href}`)
                                                            .setFooter("Made By Odiin#0001", "https://i.imgur.com/gtSR0hn.gif")

                                    
                                            Hook.send(msg);

                                        } else {
                                            console.log(shoemake[i].text + ': ' + shoemodel[i].text + " is already entered")
                                        }
                
                                    });
                                }
                                fs.writeFile('./shoes.json', JSON.stringify(databases, null, 4), (err) => {
                                    if (err) {
                                        console.log(`Error writing file: ${err}`);
                                    }
                                });
                                    
                            
                            }

                            
                        
                        });

          });
        
    } catch(error) {
        console.error(error);
    }
}


                                    //console.log(shoemake[i].text)
                                    //console.log(shoemodel[i].text)
                                    //console.log(month[i].text)
                                    //console.log(date[i].text)
                                    //console.log(links[i].attrs.href)