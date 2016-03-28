/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Odd Facts for a fact"
 *  Alexa: "Here's your odd fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing odd facts.
 */
var ODD_FACTS = [
    "The word \"queue\" is the only word in the English language that is still pronounced the same way when the last four letters are removed.",
    "Beetles taste like apples, wasps like pine nuts, and worms like fried bacon.",
    "Of all the words in the English language, the word ‘set' has the most definitions!",
    "What is called a \"French kiss\" in the English speaking world is known as an \"English kiss\" in France",
    "\"Almost\" is the longest word in the English language with all the letters in alphabetical order.",
    "\"Rhythm\" is the longest English word without a vowel.",
    "In 1386, a pig in France was executed by public hanging for the murder of a child",
    "A cockroach can live several weeks with its head cut off!",
    "Human thigh bones are stronger than concrete.",
    "You can't kill yourself by holding your breath",
    "There is a city called Rome on every continent.",
    "It's against the law to have a pet dog in Iceland!",
    "Your heart beats over 100,000 times a day!",
    "Horatio Nelson, one of England's most illustrious admirals was throughout his life, never able to find a cure for his sea-sickness.",
    "The skeleton of Jeremy Bentham is present at all important meetings of the University of London",
    "Right handed people live, on average, nine years longer than left-handed people",
    "Your ribs move about 5 million times a year, everytime you breathe!",
    "The elephant is the only mammal that can't jump!",
    "One quarter of the bones in your body, are in your feet!",
    "Like fingerprints, everyone's tongue print is different!",
    "The first known transfusion of blood was performed as early as 1667, when Jean-Baptiste, transfused.",
    "Fingernails grow nearly 4 times faster than toenails!",
    "Most dust particles in your house are made from dead skin!",
    "The present population of 5 billion plus people of the world is predicted to become 15 billion by 2.",
    "Women blink nearly twice as much as men.",
    "Adolf Hitler was a vegetarian, and had only ONE testicle.",
    "Honey is the only food that does not spoil. Honey found in the tombs of Egyptian pharaohs has been.",
    "Months that begin on a Sunday will always have a \"Friday the 13th.\"",
    "Coca-Cola would be green if coloring weren't added to it.",
    "On average a hedgehog's heart beats 300 times a minute.",
    "More people are killed each year from bees than from snakes.",
    "The average lead pencil will draw a line 35 miles long or write approximately 50,000 English words.",
    "More people are allergic to cow's milk than any other food.",
    "Camels have three eyelids to protect themselves from blowing sand.",
    "The placement of a donkey's eyes in its' heads enables it to see all four feet at all times!",
    "The six official languages of the United Nations are: English, French, Arabic, Chinese, Russian and Spanish. ",
    "Earth is the only planet not named after a god.",
    "It's against the law to burp, or sneeze in a church in Nebraska.",
    "You're born with 300 bones, but by the time you become an adult, you only have 206.",
    "Some worms will eat themselves if they can't find any food!",
    "Dolphins sleep with one eye open!",
    "It is impossible to sneeze with your eyes open",
    "The worlds oldest piece of chewing gum is 9000 years old!",
    "The longest recorded flight of a chicken is 13 seconds",
    "Queen Elizabeth I regarded herself as a paragon of cleanliness. She declared that she bathed once every three months, whether she needed it or not.",
    "Slugs have 4 noses.",
    "Owls are the only birds who can see the color blue.",
    "A man named Charles Osborne had the hiccups for 69 years!",
    "A giraffe can clean its ears with its 21-inch tongue!",
    "The average person laughs 10 times a day!",
    "An ostrich's eye is bigger than its brain"
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * OddFacts is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var OddFacts = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
OddFacts.prototype = Object.create(AlexaSkill.prototype);
OddFacts.prototype.constructor = OddFacts;

OddFacts.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("OddFacts onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

OddFacts.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("OddFacts onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
OddFacts.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("OddFacts onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

OddFacts.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Odd Facts tell me an odd fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the odd facts list
    var factIndex = Math.floor(Math.random() * ODD_FACTS.length);
    var fact = ODD_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your odd fact: " + fact;

    response.tellWithCard(speechOutput, "OddFacts", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the OddFacts skill.
    var oddFacts = new OddFacts();
    oddFacts.execute(event, context);
};

