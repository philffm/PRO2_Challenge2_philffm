/* Load all the vars*/

/* Set time intervals for updating the according functions*/
var timeInterval = setInterval(marsTime, 1000);
var timeInterval = setInterval(utcTime, 1000);
var runtime = 0; /* Ensures numbers will be updated at start but don't flash every second*/
var nightModeActive = 0; /* Init night mode */
var nightModeToggled = null;
var currentVoiceBubble=0; /* Init voice bubble state */

/* Array of possible backgrounds to choose from*/
backgrounds = ["dome.jpg", "dome_night.jpg"]
/* Array of voice answer cards (bubbles) */
voicebubbles = ["bubble-1","bubble-2", "bubble-3", "bubble-4"]

initiate();

function initiate() {
  /* Create button listener for voice assistant button */
  buttonlistener(".cta.darkmode",nightModeToggle);
  document.querySelector('.bubble > p > span').innerText = "Goede dag!";
  voiceAssistantInit();
}

/* Universal function to hide elements */
function hideElement(elementClass) {
  document.querySelector(elementClass).style.display = "none";
}

/* Universal function to show elements */
function showElement(elementClass) {
  document.querySelector(elementClass).style.display = "flex";
}

/* Universal function to update elements with given content */
function updateElement(elementClass,replaceContent){

    document.querySelector(elementClass).innerHTML = replaceContent;


}

/* Calculate UTC time and inject to elements */
function utcTime() {
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    hh = checkTime(hh);
    mm = checkTime(mm);
    ss = checkTime(ss);

    updateElement('span.utcdigit.hours',hh);
    updateElement('span.utcdigit.minutes',mm);
    updateElement('span.utcdigit.seconds',ss);
    updateElement('span.value_gmttimestring',hh+ ' '+ mm + "o clock");
  }
/* Universal function to hide elements */
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

/* Mars clock calculation and injection to elements*/
function marsTime() {
    /* MarsTime related vars*/
    /* calculation steps adapted from http://jtauber.github.io/mars-clock/ */
    var tai_offset = 37;
    var d = new Date();
    var millis = d.getTime();
    var jd_ut = 2440587.5 + (millis / 8.64E7);
    var jd_tt = jd_ut + (tai_offset + 32.184) / 86400;
    var j2000 = jd_tt - 2451545.0;
    var msd = (((j2000 - 4.5) / 1.027491252) + 44796.0 - 0.00096);
    var mtc = (24 * msd) % 24;
    var x = mtc * 3600;
    var hh = Math.floor(x / 3600);
    if (hh < 10) hh = "0" + hh;
    var y = x % 3600
    var mm = Math.floor(y / 60);
    if (mm < 10) mm = "0" + mm;
    var ss = Math.round(y % 60);
    if (ss < 10) ss = "0" + ss;
    if (mm < 1 || runtime==0) {
      updateElement('span.digit.hours',hh);
      startDigitAnimation('hours');
    }
    if (ss <= 1 || runtime==0) {
      updateElement('span.digit.minutes',mm);
      startDigitAnimation('minutes');
    }
    updateElement('span.digit.seconds',ss);
    startDigitAnimation('seconds');
    runtime =+1;

    /* Interface adapts to time change (after 8pm mars time it will change to dark mode  */
    if (hh>20 && nightModeToggled==null) {
      nightModeToggle
      nightModeActive=1;
    }

}

/* Universal digit animation for all types, so they can be controlled individually*/

function startDigitAnimation(digitType) {

  var fadein_tween = TweenLite.from( 'span.digit.'+digitType, 1, {autoAlpha:.4, y: 7} );
} 

/* Universal animation for every other element*/

function startAnimation(elementClass) {

  var fadein_tween = TweenLite.from( elementClass, 2, {autoAlpha:1  , y: 30} );

} 

  
// Universal buttonlistener functions (had too many buttons to be checked, so I created one with 3 arguments)
function buttonlistener(cssSelector,callFunction,functionArgument) {
  document.querySelector(cssSelector).addEventListener("click", function(){
  
    callFunction(functionArgument);
  
  });
}

// Toggle for night mode - injects and switches to different css (darkmode) and changes the salutation
function nightModeToggle(){

  if (nightModeActive == 0) {

    document.querySelector('body').style.background = "url(assets/images/" + backgrounds[1]+")";
    document.querySelector('body').style.backgroundSize = "cover"
    nightModeActive=1;
    LoadCSS("assets/styles/nightmode.css");
    document.querySelector('.bubble > p > span').innerText = "Goedenavond!";
    nightModeToggled += 1;


  }else {
    document.querySelector('body').style.background = "url(assets/images/" + backgrounds[0]+")";
    document.querySelector('body').style.backgroundSize = "cover"
    nightModeActive=0;
    document.querySelector('head > link:nth-child(6)').remove();
    document.querySelector('.bubble > p > span').innerText = "Goede dag!";
    nightModeToggled += 1;

  }
  
}

// Initialize "voice assistant" - hide all the answer cards in order to reveal them click by click
function voiceAssistantInit() {
  hideElement('#bubble-1');
  hideElement('#bubble-2');
  hideElement('#bubble-3');
  hideElement('#bubble-4');
  buttonlistener(".btnVoice",voiceAssistantAction);
}

// Voice Assistant function, that gets triggered every time when user presses voice-button. 
function voiceAssistantAction() {
 
  showElement("#"+voicebubbles[currentVoiceBubble]);
  // scrapes text of individual answer card / voice bubble 
  var currentVoiceBubbleText = document.querySelector("#"+voicebubbles[currentVoiceBubble]).innerText;
  // output of Text with HTML5 TTS 
  var msg = new SpeechSynthesisUtterance(currentVoiceBubbleText); window.speechSynthesis.speak(msg); 
  
  // old function (HTML5 audio - mp3), works just as fine - could be fallback for old browsers not supporting TTS
  /*var audio = new Audio('assets/audio/'+voicebubbles[currentVoiceBubble]+'.mp3');
  audio.play(); */
  
  // sets answer state +1 so the next bubble that shows up will be the next array item
  currentVoiceBubble+=1;
  startAnimation("#"+voicebubbles[currentVoiceBubble])

  // bubble 3 and 4 should be shown together but are 2 separate elements
  if (currentVoiceBubble==3) {
    showElement('#bubble-4')   
    hideElement('.btnVoice')
  }
   


}


// Universal function to inject CSS 
function LoadCSS(cssURL) {

  return new Promise( function( resolve, reject ) {

      var link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = cssURL;
      document.head.appendChild( link );
      link.onload = function() { 
          resolve(); 
      };
  } );
}
