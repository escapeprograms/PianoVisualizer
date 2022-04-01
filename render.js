var ctx = document.getElementById('canvas').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var width = ctx.canvas.width;
var height = ctx.canvas.height;
//note particles
var particles = [];
var Particle = function(note,x,y,color){
  this.note = note;//the attached note
  this.t = -1;//time left alive, defaulted to indefinite
  this.x = x;
  this.y = y;
  this.size = 10;
  this.color = color;

  this.draw = function(ctx){
    ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
  this.checkNote = function(){
    if (!notes[this.note]&&this.t<0){
      this.t = 10;//20 frames to die
    }
  }
  this.update = function(){
    this.checkNote();
    this.size *= 1.03;
    if (this.size > 40) this.size = 40;
    if (this.t > 0){
      this.size *= 0.9;
      for (var i = 0; i < this.color.length; i++){
        this.color[i] = Math.max(0,this.color[i]-5);//fade
      }
      this.t --;
    }
  }
}
//secondary particles
var drops = [];
var Drop = function(x,y,color){
  this.x = x;
  this.y = y;
  this.dx = Math.random()*20-10;
  this.dy = Math.random()*20-15;
  this.t = 20;//time left to live
  this.color = color;
  this.draw = function(ctx){
    ctx.fillStyle = `rgb(${this.color[0]+40},${this.color[1]+40},${this.color[2]+40})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,4,0,Math.PI*2);
    ctx.fill();
  }
  this.update = function(){
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 3;//gravity
    for (var i = 0; i < this.color.length; i++){
        this.color[i] = Math.max(0,this.color[i]-1);//fade
    }
    this.t --;
  }
}
//origin of particle spawn
var o = {
  x:width/2,
  y:height/2,
  angle:0,
  dx:0,
  dy:0,
  da:0
};
var combo = 0;
var resetTime = 0;
var lastMelody = 0;
//spawn a particle for a note
var spawn = function(note){
  //melody notes
  if (Math.abs(getPitch(note)-lastMelody)<8||//melody notes are close
      getPitch(note)-lastMelody>13){//melody high above the bass
    lastMelody = getPitch(note);
    if (o.x==width/2 && o.y==height/2){//after reset
      o.angle = Math.random()*Math.PI*2;//reset angle
      o.da = Math.sqrt(Math.random())*0.5;//skew toward more turns
    }
    //respawn if out of bounds, edge behavior
    if (o.x>width || o.x<0 || o.y>height || o.y<0){
      o.x = width/2;
      o.y = height/2;
    }
    particles.push(new Particle(note,o.x,o.y,
              [100+getPitch(note),255*o.y/height,50+getPitch(note)]));
    if (Math.random()>0.8){
        o.da *= -1;//switch directions sometimes
    }
    o.angle += o.da;
    o.dx = Math.cos(o.angle)*30;
    o.dy = Math.sin(o.angle)*30;
    o.x += o.dx;
    o.y += o.dy;
    combo ++;
    resetTime = 50-combo/3;
  }else{
    //nonmelody notes
    particles.push(new Particle(note,(getPitch(note)-48)*width/50+width/2+Math.random()*48,height-100-Math.random()*60,
                  [50,255*o.y/height,255*o.x/width]));
  }
  
}

var fps = 50;
var songTime = 0;//in order to keep repl error happy, redefine

setInterval(()=>{
  //draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, width, height); // background
  //note particles
  for (var i = 0; i < particles.length; i++){
    var p = particles[i];
    p.draw(ctx);
    p.update();
    //check for deletion
    if (p.t == 0){//when time left alive = 0
      //spawn particle drops
      if (p.size>12) {
        //console.log("DROPS")
        for (var x = 0; x < p.size; x++){
          drops.push(new Drop(p.x,p.y,p.color));
        }
      }
      //terminate particle
      particles = particles.slice(0,i).concat(particles.slice(i+1));
      i--;
    }
  }
  //drop particles
  for (var i = 0; i < drops.length; i++){
    var d = drops[i];
    d.draw(ctx);
    d.update();
    //check for deletion
    if (d.t == 0){//when time left alive = 0
      drops = drops.slice(0,i).concat(drops.slice(i+1));
      i--;
    }
  }
  //combo and reset timer
  if (resetTime <= 0) {
    o.x = width/2;
    o.y = height/2;
    combo = 0;
    lastMelody = 0;
  }
  resetTime--;

  //autoplay song
  if (songTime != -1){
    for (var i = 0; i < Math.min(25,noteTriggers.length); i++){
      var n = noteTriggers[i];
      if (songTime>n.start){
        notes[n.pitch] = true;//turn on key
        play(n.pitch);//play note
        spawn(n.pitch);//spawn particle w/ note
        stop(n.pitch,n.duration);//stop notes
        //turn off key
        noteTriggers = noteTriggers.slice(i+1);
        i--;
      }
    }
    songTime+=1/fps;
    if (noteTriggers.length==0) songTime = -1;//shut off autoplayer
  }
  
},1000/fps);