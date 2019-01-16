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

    function tellweatherfunction(agent) {
        agent.add(`The weather is good!`);
    }

    // Weather Intent
    app.post('/fulfillment', (req, res) => {
        if (req.body.result.action === 'weather') {
          let city = req.body.result.parameters['JapanCity'];
          let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+f94fb06603ef464c16a935d57b3e2eb1+'&q='+city;
      
          request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
              let json = JSON.parse(body);
              let msg = json.weather[0].description + ' and the temperature is ' + json.main.temp + ' ℉';
              return res.json({
                speech: msg,
                displayText: msg,
                source: 'weather'});
            } else {
              return res.status(400).json({
                status: {
                  code: 400,
                  errorType: 'I failed to look up the city name.'}});
            }})
        }
    //end of weather intent

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
