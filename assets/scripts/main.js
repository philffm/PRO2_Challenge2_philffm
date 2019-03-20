var tai_offset = 37;
var last_leap_second = "1 January 2017";

var timeInterval = setInterval(marsTime, 1000);
var timeInterval = setInterval(utcTime, 1000);

var runtime = 0; 
var nightModeActive = 0; 
var currentVoiceBubble=0;


backgrounds = ["dome.jpg", "dome_night.jpg"]
voicebubbles = ["bubble-1","bubble-2", "bubble-3", "bubble-4"]

initiate();

function initiate() {
  buttonlistener(".cta.darkmode",nightModeToggle);
  document.querySelector('.bubble > p > span').innerText = "Goede dag!";
  voiceAssistantInit();
}


function hideElement(elementClass) {

  document.querySelector(elementClass).style.display = "none";
  
}

function showElement(elementClass) {

  document.querySelector(elementClass).style.display = "flex";
  
}

function updateElement(elementClass,replaceContent){

    document.querySelector(elementClass).innerHTML = replaceContent;


}

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

  }

  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }




function marsTime() {
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
      startAnimation('hours');
    }
    if (ss <= 1 || runtime==0) {
      updateElement('span.digit.minutes',mm);
      startAnimation('minutes');
    }
    
    updateElement('span.digit.seconds',ss);
    startAnimation('seconds');


    runtime =+1;
}


function startAnimation(digitType) {


    var fadein_tween = TweenLite.from( 'span.digit.'+digitType, 1, {autoAlpha:.4, y: 7} );

  }


  
// Universal buttonlistener functions (had too many buttons to be checked, so I created one with 3 arguments)
function buttonlistener(cssSelector,callFunction,functionArgument) {
  document.querySelector(cssSelector).addEventListener("click", function(){
  
    callFunction(functionArgument);
  
  });
}


function nightModeToggle(){

  if (nightModeActive == 0) {

    document.querySelector('body').style.background = "url(assets/images/" + backgrounds[1]+")";
    document.querySelector('body').style.backgroundSize = "cover"
    nightModeActive=1;
    LoadCSS("assets/styles/nightmode.css");
    document.querySelector('.bubble > p > span').innerText = "Goedenavond!";



  }else {
    document.querySelector('body').style.background = "url(assets/images/" + backgrounds[0]+")";
    document.querySelector('body').style.backgroundSize = "cover"
    nightModeActive=0;
    document.querySelector('head > link:nth-child(6)').remove();
    document.querySelector('.bubble > p > span').innerText = "Goede dag!";


  }

  

}

function voiceAssistantInit() {
  hideElement('#bubble-1');
  hideElement('#bubble-2');
  hideElement('#bubble-3');
  hideElement('#bubble-4');
  buttonlistener(".btnVoice",voiceAssistantAction);
 
}

function voiceAssistantAction() {
 
  showElement("#"+voicebubbles[currentVoiceBubble]);
  var audio = new Audio('assets/audio/'+voicebubbles[currentVoiceBubble]+'.mp3');
  audio.play();
  currentVoiceBubble+=1;

  if (currentVoiceBubble==3) {
    showElement('#bubble-4')   
  }
   


}



function LoadCSS(cssURL) {

  // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css

  return new Promise( function( resolve, reject ) {

      var link = document.createElement( 'link' );

      link.rel  = 'stylesheet';

      link.href = cssURL;

      document.head.appendChild( link );

      link.onload = function() { 

          resolve(); 

      };
  } );
}
