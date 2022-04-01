currentMidi = null;
var noteTriggers = [];

function parseFile(file) {
noteTriggers = [];
//read the file
const reader = new FileReader();
reader.onload = function (e) {
const midi = new Midi(e.target.result);
//document.getElementById("out").innerHTML = JSON.stringify(midi, undefined, 2);
currentMidi = midi;

//create an array
midi.tracks.forEach((t)=>{
  data = t.notes;
  data.forEach((n)=>{
      if (n.midi>=32){//cut out extra low notes
        noteTriggers.push({//add note to list
        pitch : n.name,
        start : n.time,
        duration : n.duration
      });
      }
  });
});
//sort noteTriggers by start time
quicksort(0,noteTriggers.length-1);
console.log(currentMidi);//print out midi file for later saving
};

reader.readAsArrayBuffer(file);
}

function exchange(i,j){
  var temp = noteTriggers[i];
  noteTriggers[i] = noteTriggers[j];
  noteTriggers[j] = temp;
}

function quicksort(low,high){
  var i = low, j = high;
        // Get the pivot element from the middle of the list
        var pivot = noteTriggers[Math.floor(low + (high-low)/2)].start;

        // Divide into two lists
        while (i <= j) {
            // If the current value from the left list is smaller than the pivot
            // element then get the next element from the left list
            while (noteTriggers[i].start < pivot) {
                i++;
            }
            // If the current value from the right list is larger than the pivot
            // element then get the next element from the right list
            while (noteTriggers[j].start > pivot) {
                j--;
            }

            // If we have found a value in the left list which is larger than
            // the pivot element and if we have found a value in the right list
            // which is smaller than the pivot element then we exchange the
            // values.
            // As we are done we can increase i and j
            if (i <= j) {
                exchange(i, j);
                i++;
                j--;
            }
        }
        // Recursion
        if (low < j){
            quicksort(low, j);}
        if (i < high){
            quicksort(i, high);}
}

//read custom file
document.getElementById("filereader")
					.addEventListener("change", (e) => {
						//get the files
						const files = e.target.files;
						if (files.length > 0) {
							const file = files[0];
							parseFile(file);
						}
					});

//read a default file
/*sample songs from:
https://www.youtube.com/channel/UCVSJyQ0r1U4QNPzVaki30dQ
https://www.youtube.com/watch?v=NJlfEGiZS3k

*/
document.getElementById("samplesong")
					.addEventListener("change", (e) => {
            songTime = -1;//stop any current song
            noteTriggers = [];
						//get the files
            var xmlhttp = new XMLHttpRequest();
            var url = document.getElementById("samplesong").value+".txt";

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var midi = JSON.parse(this.responseText);
                    currentMidi = midi;//transfer midi data to currentMidi
                    //create an array
                    currentMidi.tracks.forEach((t)=>{
                      data = t.notes;
                      data.forEach((n)=>{
                        if (n.midi>=32){//cut out extra low notes
                          noteTriggers.push({//add note to list
                          pitch : n.name,
                          start : n.time,
                          duration : n.duration
                        });
                        }
                    });
                    });
                    //sort noteTriggers by start time
                    quicksort(0,noteTriggers.length-1);
                }
            };
            xmlhttp.open("GET", url, false);
            xmlhttp.send();
					});

//play songs + visuals
var songTime = 0;
var runSong = function(){
  songTime = 0;
  console.log("autoplaying song...");
}
