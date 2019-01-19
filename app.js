//This section list the required libraries
var express = require("express");
//create an instance of express server

const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const {WebhookClient,Card,} = require('dialogflow-fulfillment');

//firebase
var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

//retrieve the id from firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://myagent-5ce83.firebaseio.com'
});

//create an instance of express server
const app = express().use(bodyParser.json());

app.post('/fulfillment', functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    function welcome(agent) {
        agent.add(`Welcome to NihonOnly Website!`);
        agent.add(new Card({
            title: `This is your friendly service agent Heroku`,
            imageUrl: 'http://weknowyourdreams.com/images/robot/robot-02.jpg',
            //imageUrl:"https://heroku-chatbotsg.herokuapp.com/fulfillment",
            text: `I am here to serve you.\nPlease free to ask me anything! 💁`,
            buttonText: 'Click Me to know more about me!',
            buttonUrl: 'https://assistant.google.com/'
        })
        );
    }


    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function telldatefunction(agent) {
        agent.add(`Today is a great day!`);
        
    }

    // Weather Intent
    function tellweatherfunction(agent) {
    //    let request = require('request');
    //    let apiKey = 'f94fb06603ef464c16a935d57b3e2eb1';
    //    let city = 'portland';
    //     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    //    let weather = JSON.parse(body);
    //    let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;  
    //    agent.add(url);
    //    agent.add(weather);
    //    agent.add(agent.parameters['JapanCity']+' weather in '+agent.parameters['Seasons']);

        if (agent.parameters['Seasons'] == "Winter") { 
            if (agent.parameters['JapanCity'] == "Hokkaido"){
                agent.add("It is the coldest month in Hokkaido. No matter where you are in this vast prefecture, you'll feel really cold.");
                agent.add("Average temperatures lie around -4°C (25°F). When it's cold, it gets as low as -6°C (21°F), and it's around -1°C (30°F) even when it's not so cold");
            }
            else{
                agent.add(agent.parameters['JapanCity']+' weather in '+agent.parameters['Seasons']+' is generally mild');
                agent.add(agent.parameters['JapanCity']+' has a humid subtropical climate. Summer (Jun–Sep) is hot.  Unlike Hokkaido, Winter (Dec–Feb) in '+agent.parameters['JapanCity']+' is mild.');
            }
        }
        else if (agent.parameters['Seasons'] == "Spring"){
            if (agent.parameters['JapanCity']== "Hokkaido"){
               agent.add("In March the Temperature is still sometimes below Freezing. In Hokkaido the cherry blossoms come out in May!");
               agent.add(" Although the cherry blossoms start budding on the mainland in March, temperatures can still be below freezing in Hokkaido.");
            }
            else{
                agent.add(agent.parameters['JapanCity']+' weather in '+agent.parameters['Seasons']+' is generally cooling');
            }
        }
        else if (agent.parameters['Seasons'] == "Summer"){
            if (agent.parameters['JapanCity']=="Hokkaido") {
                agent.add('Summer in Hokkaido is cooler and the temperature in Hokkaido is around 20 ℃. ');
            }
            else {
                agent.add(agent.parameters['JapanCity']+' weather in '+agent.parameters['Seasons']+' is generally hot');
                agent.add(agent.parameters['JapanCity']+' has a humid subtropical climate. Summer (Jun–Sep) is hot.  Unlike Hokkaido, Winter (Dec–Feb) in '+agent.parameters['JapanCity']+' is mild.');
            }
  
        }
        else if (agent.parameters['Seasons'] == "Autumn"){
            agent.add(agent.parameters['JapanCity']+' weather in '+agent.parameters['Seasons']+' is generally cooling');
        }
      
        //end of weather intent
    
    }

  
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('TellDateIntent', telldatefunction);
    intentMap.set('Weather Intent', tellweatherfunction);
    agent.handleRequest(intentMap);
})
);


//Start the express server to listen to a port in the server
var listener = app.listen(process.env.PORT,
    process.env.IP,
    function () {
        console.log("server has started");
        console.log('Listening on port ' + listener.address().port);
    });
