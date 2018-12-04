//This section list the required libraries
var express = require("express");
//create an instance of express server

const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const {WebhookClient,Card,} = require('dialogflow-fulfillment');

//create an instance of express server
const app = express().use(bodyParser.json());

app.post('/fulfillment', functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    function welcome(agent) {
        agent.add(`Welcome to my agent in Heroku!`);
        agent.add(new Card({
            title: `This is Agent in Heroku`,
            imageUrl: 'http://weknowyourdreams.com/images/robot/robot-02.jpg',
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


    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
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
