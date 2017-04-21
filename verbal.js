/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500
var slowEyeColor = "black"
var fastEyeColor = "red"

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
      setEyeColor(fastEyeColor);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "it-IT";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
        setEyeColor(slowEyeColor);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;

  if (user_said.toLowerCase().includes("tempo a") && user_said.toLowerCase().includes(" e ")) {
    var weather_re1 = /tempo a\s(.+)\se\s(.+)/i;  // creating a regular expression
    var mcity_parse_array = user_said.match(weather_re1) // parsing the input string with the regular expression
    console.log(mcity_parse_array) // let's print the array content to the console log so we understand what's inside the array.
    response = "Il tempo a " + mcity_parse_array[1] + "e piovoso" + "e in" + mcity_parse_array[2] + "e soleggiato";
    }
    else if (user_said.toLowerCase().includes("tempo a")) {
    var weather_re2 = /tempo a\s(.+)/i;  // creating a regular expression
    var city_parse_array = user_said.match(weather_re2) // parsing the input string with the regular expression
    console.log(city_parse_array)
    response = "Il tempo a " + city_parse_array[1] + "e piovoso";
    }
    else if (user_said.toLowerCase().includes("tempo fuori")) {
    response = "Il tempo a San Francisco e piovoso";
    }    
    else if (user_said.toLowerCase().includes("previsioni del tempo")) {
    response = "Il tempo a San Francisco e piovoso";
        console.log("Test");
    }     
    else if (user_said.toLowerCase().includes("è il tempo")) {
    var type_re = /è il tempo\s(.*)/i;  // creating a regular expression
    var type_parse_array = user_said.match(type_re) // parsing the input string with the regular expression
    console.log(type_parse_array)
    response = "Si, il tempo a San Francisco e" + type_parse_array[1];
    } 
    else if (user_said.toLowerCase().includes("ciao")) {
    response = "arrivederci";
    state = "initial"
    } else {
    response = " non capisco";
    }
    return response;
    console.log(user_said);
}

/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 0.5 //between 0.1
  u.pitch = 1 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Luca"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
