const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const modal = $("#modal");
const typeText = $("#typeText");
const message = "Birthdays sirf age badhane ke liye nahi hote — they are a reminder that the right people are genuinely happy you exist. I hope this year brings you solid wins, peaceful nights, big laughs, unexpected adventures and memories that make you say: haan, yeh year worth it tha. Happy Birthday, Abhimanyu! 💙✨";

let typingTimer;
function openModal(){
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  typeText.textContent = "";
  clearInterval(typingTimer);
  let i = 0;
  typingTimer = setInterval(() => {
    typeText.textContent += message[i++] || "";
    if(i >= message.length) clearInterval(typingTimer);
  }, 19);
  burst(145);
  sparkleNotes();
}
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}
$("#surpriseBtn").addEventListener("click", openModal);
$("#closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });
$("#boomBtn").addEventListener("click", () => { burst(240); sparkleNotes(true); });

const toast = $("#toast");
function openGift(){
  toast.classList.add("show");
  burst(110);
  sparkleNotes(true);
  setTimeout(()=>toast.classList.remove("show"),3400);
}
$("#giftBtn").addEventListener("click", e => { e.stopPropagation(); openGift(); });
$("#giftCard").addEventListener("click", openGift);

$("#wishBtn").addEventListener("click", () => {
  $("#wishResult").classList.add("show");
  burst(190);
  sparkleNotes(true);
});

// reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.13});
$$('.reveal').forEach(el=>observer.observe(el));

// confetti
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
function resize(){
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize", resize); resize();
const colors = ["#ffd65a","#ff5faf","#6ee8ff","#a87cff","#ffffff","#67f0b2"];
function burst(count=120){
  const originX = innerWidth * .5;
  const originY = innerHeight * .35;
  for(let i=0;i<count;i++){
    pieces.push({
      x:originX + (Math.random()-.5)*90,
      y:originY + (Math.random()-.5)*35,
      vx:(Math.random()-.5)*12,
      vy:-Math.random()*9-4,
      g:.18+Math.random()*.08,
      r:Math.random()*Math.PI,
      vr:(Math.random()-.5)*.35,
      size:5+Math.random()*7,
      color:colors[(Math.random()*colors.length)|0],
      life:120+Math.random()*75
    });
  }
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  pieces.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.g; p.r+=p.vr; p.life--;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
    ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.5);
    ctx.restore();
  });
  pieces=pieces.filter(p=>p.life>0 && p.y<innerHeight+50);
  requestAnimationFrame(draw);
}
draw();

// Original instrumental playlist made with WebAudio.
let audioCtx;
let masterGain;
let musicTimer = null;
let isPlaying = false;
let currentTrack = 0;
let beat = 0;
let progressTimer = null;
let startedAt = 0;

const tracks = [
  {
    title:"Birthday Glow", mood:"Warm • bright • feel-good", bpm:92, duration:188,
    chords:[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]],
    melody:[523.25,659.25,783.99,659.25,587.33,523.25,493.88,523.25]
  },
  {
    title:"Celebration Nights", mood:"Upbeat • energetic • party", bpm:118, duration:174,
    chords:[[261.63,329.63,392],[196,246.94,293.66],[220,277.18,329.63],[174.61,220,261.63]],
    melody:[659.25,783.99,880,783.99,659.25,587.33,659.25,987.77]
  },
  {
    title:"Golden Memories", mood:"Soft • nostalgic • late-night", bpm:76, duration:201,
    chords:[[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[164.81,196,246.94]],
    melody:[440,523.25,659.25,587.33,523.25,493.88,440,392]
  }
];

function ensureAudio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = .52;
    masterGain.connect(audioCtx.destination);
  }
  if(audioCtx.state === "suspended") audioCtx.resume();
}

function tone(freq, when, duration, volume=.04, type="sine"){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  o.type = type; o.frequency.setValueAtTime(freq, when);
  filter.type = "lowpass"; filter.frequency.value = type === "triangle" ? 1900 : 2600;
  g.gain.setValueAtTime(.0001, when);
  g.gain.exponentialRampToValueAtTime(volume, when+.025);
  g.gain.exponentialRampToValueAtTime(.0001, when+duration);
  o.connect(filter); filter.connect(g); g.connect(masterGain);
  o.start(when); o.stop(when+duration+.03);
}

function softKick(when, vol=.035){
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type="sine"; o.frequency.setValueAtTime(110,when); o.frequency.exponentialRampToValueAtTime(48,when+.15);
  g.gain.setValueAtTime(vol,when); g.gain.exponentialRampToValueAtTime(.0001,when+.18);
  o.connect(g); g.connect(masterGain); o.start(when); o.stop(when+.2);
}

function scheduleBar(){
  if(!isPlaying) return;
  ensureAudio();
  const t = tracks[currentTrack];
  const beatSec = 60/t.bpm;
  const now = audioCtx.currentTime + .035;
  const chord = t.chords[Math.floor(beat/4)%t.chords.length];
  chord.forEach((f,i)=> tone(f, now, beatSec*3.8, .018, i===0?"sine":"triangle"));
  for(let i=0;i<4;i++){
    const bt=now+i*beatSec;
    softKick(bt, currentTrack===1?.045:.028);
    if(currentTrack===1 && i%2===1) tone(2200,bt, .045,.007,"square");
    const note=t.melody[(beat+i)%t.melody.length];
    tone(note, bt+beatSec*.08, beatSec*.55, currentTrack===2?.018:.025, "sine");
    if(currentTrack===0 && i===3) tone(note*1.5,bt+beatSec*.45,beatSec*.28,.012,"triangle");
  }
  beat += 4;
  musicTimer = setTimeout(scheduleBar, beatSec*4*1000-50);
}

function updatePlayerUI(){
  const navBtn = $("#musicBtn");
  const heroBtn = $("#heroMusicBtn");
  if(navBtn) navBtn.textContent = isPlaying ? "♫ Pause music" : "♫ Play music";
  if(heroBtn) heroBtn.textContent = isPlaying ? "♫ Pause birthday music" : "♫ Play birthday music";
}

function startTrack(index=currentTrack){
  ensureAudio();
  clearTimeout(musicTimer); clearInterval(progressTimer);
  currentTrack=index; beat=0; isPlaying=true; startedAt=Date.now();
  scheduleBar(); updatePlayerUI();
  progressTimer=setInterval(()=>{
    const elapsed=(Date.now()-startedAt)/1000;
    const duration=tracks[currentTrack].duration;
  },250);
}
function stopTrack(){
  isPlaying=false; clearTimeout(musicTimer); clearInterval(progressTimer); updatePlayerUI();
}
function toggleTrack(){ isPlaying?stopTrack():startTrack(currentTrack); }

$("#musicBtn").addEventListener("click",toggleTrack);
const heroMusicBtn = $("#heroMusicBtn");
if(heroMusicBtn) heroMusicBtn.addEventListener("click", toggleTrack);

function sparkleNotes(big=false){
  ensureAudio();
  const now=audioCtx.currentTime;
  const notes=big?[523.25,659.25,783.99,1046.5]:[659.25,783.99,987.77];
  notes.forEach((f,i)=>tone(f,now+i*.11,.36,big?.038:.024,"sine"));
}

// initial gentle celebration
setTimeout(()=>burst(60),700);
updatePlayerUI();
