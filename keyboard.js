//update keys pressed
var menuOpen = true;
var notes = {};//all current notes are saved here
function addKey(e) {
  if(e) {
    var note = findNote(e.code);
    if (notes[note]!=true&&note!==""){
      play(note);//only play if key is just pressed
      spawn(note);//spawn particle w/ note
    }
    //toggle menu
    if (e.code=="Space"){
      menuOpen = !menuOpen;
      var menu = document.getElementsByClassName("main")[0];
      if (menuOpen) menu.style="display:block;";
      if (!menuOpen) menu.style = "display:none;";
    }
  }

}
function removeKey(e) {
  if(e) {
    //stop note
    var note = findNote(e.code);
    stop(note);
  }
}

//play music + event listener
const synths = [];

const synth = new Tone.Sampler({
	urls: {
    "C2": "C2.mp3",
		"D#2": "Ds2.mp3",
		"F#2": "Fs2.mp3",
		"A2": "A2.mp3",
    "C3": "C3.mp3",
		"D#3": "Ds3.mp3",
		"F#3": "Fs3.mp3",
		"A3": "A3.mp3",
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
    "C5": "C5.mp3",
		"D#5": "Ds5.mp3",
		"F#5": "Fs5.mp3",
		"A5": "A5.mp3",
    "C6": "C6.mp3",
		"D#6": "Ds6.mp3",
		"F#6": "Fs6.mp3",
		"A6": "A6.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

function play(note){
  var now = Tone.now();//start now
  synth.triggerAttack(note, now)
  notes[note] = true;//add to current notes playing
}
function stop(note,x){//optional delay
  var now = Tone.now() + 0.2;//end after delay
  if (x) {//with delay
    now += x;
    setTimeout(()=>{
      notes[note]=false;//remove from current note splaying
    },x*1000);
  }else{
    notes[note] = false;//remove from current note splaying
  }
  synth.triggerRelease(note, now)
  
}
//find the note name of corrosponding key
function findNote(key){
  var note = "";
  switch (key){
    //lower octave
    case "KeyZ":
      note = "C3";
      break;
    case "KeyS":
      note = "C#3";
      break;
    case "KeyX":
      note = "D3";
      break;
    case "KeyD":
      note = "D#3";
      break;
    case "KeyC":
      note = "E3";
      break;
    case "KeyV":
      note = "F3";
      break;
    case "KeyG":
      note = "F#3";
      break;
    case "KeyB":
      note = "G3";
      break;
    case "KeyH":
      note = "G#3";
      break;
    case "KeyN":
      note = "A3";
      break;
    case "KeyJ":
      note = "A#3";
      break;
    case "KeyM":
      note = "B3";
      break;
    case "Comma":
      note = "C4";
      break;
    case "KeyL":
      note = "C#4";
      break;
    case "Period":
      note = "D4";
      break;
    case "Semicolon":
      note = "D#4";
      break;
    case "Slash":
      note = "E4";
      break;
    //upper octave
    case "KeyQ":
      note = "C4";
      break;
    case "Digit2":
      note = "C#4";
      break;
    case "KeyW":
      note = "D4";
      break;
    case "Digit3":
      note = "D#4";
      break;
    case "KeyE":
      note = "E4";
      break;
    case "KeyR":
      note = "F4";
      break;
    case "Digit5":
      note = "F#4";
      break;
    case "KeyT":
      note = "G4";
      break;
    case "Digit6":
      note = "G#4";
      break;
    case "KeyY":
      note = "A4";
      break;
    case "Digit7":
      note = "A#4";
      break;
    case "KeyU":
      note = "B4";
      break;
    case "KeyI":
      note = "C5";
      break;
    case "Digit9":
      note = "C#5";
      break;
    case "KeyO":
      note = "D5";
      break;
    case "Digit0":
      note = "D#5";
      break;
    case "KeyP":
      note = "E5";
      break;
    case "BracketLeft":
      note = "F5";
      break;
    case "Equal":
      note = "F#5";
      break;
    case "BracketRight":
      note = "G5";
      break;
    default:
      note = "";
      break;
  }
  return note;
}

//find pitch # from note name
function getPitch(note){
  var letter = note[0];//first char
  var octave = note[note.length-1];//last char
  var mod = 0;//modulo
  switch (letter) {
    case "C":
      mod = 0;
      break;
    case "D":
      mod = 2;
      break;
    case "E":
      mod = 4;
      break;
    case "F":
      mod = 5;
      break;
    case "G":
      mod = 7;
      break;
    case "A":
      mod = 9;
      break;
    case "B":
      mod = 11;
      break;
    default:
      mod = 0;
      break;
  }
  if (note.length==3) mod++;//3 char long -> the note is sharp
  return octave*12+mod;
}