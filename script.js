'use strict';
/* ════════════════════════════════════════
   CosmicQuiz — script.js
   ════════════════════════════════════════ */

/* ── DATA ── */
const QUESTIONS = [
  { q:"What is the capital of France?",                     opts:["London","Berlin","Paris","Madrid"],                                  ans:2, cat:"Geography" },
  { q:"Which planet is known as the Red Planet?",           opts:["Venus","Mars","Jupiter","Saturn"],                                   ans:1, cat:"Science" },
  { q:"What is 12 × 12?",                                   opts:["132","144","148","124"],                                             ans:1, cat:"Math" },
  { q:"Who wrote Romeo and Juliet?",                        opts:["Charles Dickens","Mark Twain","William Shakespeare","Jane Austen"],  ans:2, cat:"Literature" },
  { q:"Which element has the chemical symbol 'O'?",         opts:["Gold","Oxygen","Osmium","Ozone"],                                   ans:1, cat:"Science" },
  { q:"What is the largest ocean on Earth?",                opts:["Atlantic","Indian","Arctic","Pacific"],                             ans:3, cat:"Geography" },
  { q:"In which year did World War II end?",                opts:["1943","1944","1945","1946"],                                        ans:2, cat:"History" },
  { q:"How many sides does a hexagon have?",                opts:["5","6","7","8"],                                                     ans:1, cat:"Math" },
  { q:"Who painted the Mona Lisa?",                         opts:["Van Gogh","Picasso","Leonardo da Vinci","Rembrandt"],               ans:2, cat:"Art" },
  { q:"What is the approximate speed of light?",           opts:["300,000 km/s","150,000 km/s","450,000 km/s","100,000 km/s"],       ans:0, cat:"Science" },
  { q:"Which country invented paper?",                      opts:["Egypt","India","China","Greece"],                                   ans:2, cat:"History" },
  { q:"What is the chemical formula for water?",            opts:["CO2","H2O","O2","NaCl"],                                           ans:1, cat:"Science" },
  { q:"How many bones are in the adult human body?",        opts:["196","206","216","226"],                                            ans:1, cat:"Biology" },
  { q:"Which language has the most native speakers?",       opts:["English","Spanish","Mandarin Chinese","Hindi"],                    ans:2, cat:"Culture" },
  { q:"What is the smallest prime number?",                 opts:["0","1","2","3"],                                                    ans:2, cat:"Math" },
  { q:"Which continent is the Sahara Desert located on?",   opts:["Asia","South America","Australia","Africa"],                       ans:3, cat:"Geography" },
  { q:"What gas do plants absorb from the atmosphere?",     opts:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],                   ans:2, cat:"Biology" },
  { q:"Who developed the theory of relativity?",            opts:["Isaac Newton","Albert Einstein","Nikola Tesla","Stephen Hawking"],  ans:1, cat:"Science" },
  { q:"What is the largest planet in our solar system?",    opts:["Saturn","Neptune","Jupiter","Uranus"],                             ans:2, cat:"Science" },
  { q:"In which year did humans first land on the Moon?",   opts:["1965","1967","1969","1971"],                                       ans:2, cat:"History" }
];
const LETTERS = ['A','B','C','D'];

/* ── STATE ── */
let cur      = 0;
let answers  = new Array(20).fill(null);
let score    = 0;
let busy     = false;

/* ── DOM ── */
const $  = id => document.getElementById(id);
const introScreen  = $('intro-screen');
const quizScreen   = $('quiz-screen');
const resultScreen = $('result-screen');
const startBtn     = $('start-btn');
const restartBtn   = $('restart-btn');
const qCard        = $('q-card');
const qBody        = $('q-body');
const qIndexBadge  = $('q-index-badge');
const catChip      = $('cat-chip');
const optsWrap     = $('options-wrap');
const prevBtn      = $('prev-btn');
const nextBtn      = $('next-btn');
const nextLabel    = $('next-label');
const trailDots    = $('trail-dots');
const scoreNum     = $('score-num');
const scoreBadge   = $('score-badge');
const curQEl       = $('cur-q');
const progressFill = $('progress-fill');
const progressGlow = $('progress-glow');
const feedbackStrip= $('feedback-strip');
const stripInner   = $('strip-inner');
const cursorGlow   = $('cursor-glow');

/* ════════════════════════════════════════
   CURSOR GLOW
   ════════════════════════════════════════ */
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ════════════════════════════════════════
   AURORA CANVAS BACKGROUND
   ════════════════════════════════════════ */
(function initAurora(){
  const canvas = $('aurora-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, t = 0;

  const waves = [
    { color:'rgba(0,245,212,', speed:0.0008, amp:0.28, phase:0, y:0.35 },
    { color:'rgba(247,37,133,', speed:0.0006, amp:0.22, phase:2.1, y:0.55 },
    { color:'rgba(123,47,255,', speed:0.001,  amp:0.18, phase:4.2, y:0.45 },
    { color:'rgba(0,180,255,',  speed:0.0007, amp:0.24, phase:1.2, y:0.65 }
  ];

  /* Starfield */
  let stars = [];
  function initStars(){
    stars = Array.from({length:120}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.2+0.2,
      a: Math.random()*0.6+0.1,
      sp: Math.random()*0.0015+0.0005,
      ph: Math.random()*Math.PI*2
    }));
  }

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  function drawAurora(){
    ctx.clearRect(0,0,W,H);

    /* Stars */
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.sp * 1000 + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200,220,255,${alpha})`;
      ctx.fill();
    });

    /* Aurora waves */
    waves.forEach(w => {
      const baseY = H * w.y;
      const amplitude = H * w.amp;

      ctx.beginPath();
      ctx.moveTo(0, H);
      for(let x=0; x<=W; x+=4){
        const y = baseY
          + Math.sin(x*0.004 + t*w.speed*1000 + w.phase) * amplitude * 0.6
          + Math.sin(x*0.009 + t*w.speed*800  + w.phase*1.3) * amplitude * 0.3
          + Math.sin(x*0.002 + t*w.speed*1200 + w.phase*0.7) * amplitude * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();

      const grd = ctx.createLinearGradient(0, baseY - amplitude, 0, baseY + amplitude);
      grd.addColorStop(0,   w.color + '0)');
      grd.addColorStop(0.4, w.color + '0.06)');
      grd.addColorStop(0.6, w.color + '0.04)');
      grd.addColorStop(1,   w.color + '0)');
      ctx.fillStyle = grd;
      ctx.fill();
    });

    t += 1/60;
    requestAnimationFrame(drawAurora);
  }

  window.addEventListener('resize', resize);
  resize();
  drawAurora();
})();

/* ════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════ */
function fireConfetti(amount = 150){
  const canvas = $('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#00f5d4','#f72585','#ffd166','#7b2fff','#06d6a0','#60a5fa','#fb923c'];
  const pieces = Array.from({length:amount}, () => ({
    x:  Math.random() * canvas.width,
    y:  -20 - Math.random()*120,
    w:  Math.random()*11 + 5,
    h:  Math.random()*5  + 3,
    vx: (Math.random()-0.5)*5,
    vy: Math.random()*5  + 2,
    rot:   Math.random()*360,
    vrot:  (Math.random()-0.5)*8,
    alpha: 1,
    color: COLORS[Math.floor(Math.random()*COLORS.length)]
  }));

  let live = true;
  let dead = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dead = 0;
    pieces.forEach(p => {
      if(p.alpha<=0){dead++;return;}
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.09; p.rot += p.vrot;
      if(p.y > canvas.height) p.alpha -= 0.05;
    });
    if(dead < pieces.length && live) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
  setTimeout(()=>{ live=false; }, 6000);
}

/* ════════════════════════════════════════
   SCREEN TRANSITIONS
   ════════════════════════════════════════ */
function switchScreen(from, to, cb){
  from.classList.add('exit');
  setTimeout(()=>{
    from.classList.remove('active','exit');
    to.classList.add('active');
    if(cb) cb();
  }, 450);
}

/* ════════════════════════════════════════
   TRAIL DOTS
   ════════════════════════════════════════ */
function buildDots(){
  trailDots.innerHTML = '';
  for(let i=0;i<20;i++){
    const d = document.createElement('div');
    d.className = 'tdot';
    trailDots.appendChild(d);
  }
}
function refreshDots(){
  const dots = trailDots.querySelectorAll('.tdot');
  dots.forEach((d,i)=>{
    d.className = 'tdot';
    if(i===cur){ d.classList.add('t-active'); return; }
    if(answers[i]===null) return;
    d.classList.add(answers[i]===QUESTIONS[i].ans ? 't-correct' : 't-wrong');
  });
}

/* ════════════════════════════════════════
   PROGRESS BAR
   ════════════════════════════════════════ */
function updateProgress(){
  const pct = Math.max(5, Math.round(((cur+1)/20)*100));
  progressFill.style.width = pct + '%';
  progressGlow.style.right = (100 - pct) + '%';
}

/* ════════════════════════════════════════
   LOAD QUESTION
   ════════════════════════════════════════ */
function loadQuestion(){
  const q = QUESTIONS[cur];
  qIndexBadge.textContent = String(cur+1).padStart(2,'0');
  catChip.textContent     = q.cat;
  qBody.textContent       = q.q;
  curQEl.textContent      = cur + 1;
  nextLabel.textContent   = cur === 19 ? 'Finish' : 'Next';
  prevBtn.disabled        = cur === 0;

  updateProgress();
  refreshDots();
  buildOptions();
  updateFeedback();

  /* Shimmer on card */
  qCard.classList.remove('shimmer');
  void qCard.offsetWidth;
  qCard.classList.add('shimmer');
}

/* ════════════════════════════════════════
   BUILD OPTIONS
   ════════════════════════════════════════ */
function buildOptions(){
  optsWrap.innerHTML = '';
  const q        = QUESTIONS[cur];
  const answered = answers[cur] !== null;

  q.opts.forEach((opt, i)=>{
    const btn = document.createElement('button');
    btn.className = 'opt opt-enter';
    btn.style.animationDelay = (i * 0.07) + 's';
    btn.innerHTML =
      `<span class="opt-letter">${LETTERS[i]}</span>` +
      `<span class="opt-text">${opt}</span>`;

    if(answered){
      btn.disabled = true;
      if(i === q.ans)                              btn.classList.add('correct');
      else if(i === answers[cur])                  btn.classList.add('wrong');
      else if(answers[cur]!==q.ans && i===q.ans)  btn.classList.add('reveal-correct');
    } else {
      btn.addEventListener('click', ()=> pickAnswer(i));
    }
    optsWrap.appendChild(btn);
  });
}

/* ════════════════════════════════════════
   PICK ANSWER
   ════════════════════════════════════════ */
function pickAnswer(i){
  if(answers[cur]!==null) return;
  const q     = QUESTIONS[cur];
  const right = i === q.ans;

  answers[cur] = i;
  if(right){
    score++;
    scoreNum.textContent = score;
    scoreBadge.classList.remove('bump');
    void scoreBadge.offsetWidth;
    scoreBadge.classList.add('bump');
  }

  const btns = optsWrap.querySelectorAll('.opt');
  btns.forEach((b,idx)=>{
    b.disabled = true;
    b.style.animationDelay = '0s';
    if(idx===q.ans)  b.classList.add('correct');
    else if(idx===i) b.classList.add('wrong');
  });

  showFeedback(right);
  refreshDots();
}

/* ════════════════════════════════════════
   FEEDBACK STRIP
   ════════════════════════════════════════ */
function updateFeedback(){
  if(answers[cur]===null){
    stripInner.classList.remove('show','is-correct','is-wrong');
    return;
  }
  showFeedback(answers[cur]===QUESTIONS[cur].ans);
}
function showFeedback(right){
  stripInner.classList.remove('show','is-correct','is-wrong');
  void stripInner.offsetWidth;
  stripInner.innerHTML = right
    ? '✅&nbsp; Correct! Great job.'
    : '❌&nbsp; Incorrect — correct answer revealed.';
  stripInner.classList.add('show', right ? 'is-correct' : 'is-wrong');
}

/* ════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════ */
function navigate(dir){
  if(busy) return;
  busy = true;

  const outCls  = dir===1 ? 'q-exit-left'  : 'q-exit-right';
  const inCls   = dir===1 ? 'q-enter-left' : 'q-enter-right';

  qCard.classList.add(outCls);
  optsWrap.classList.add('opts-exit');

  setTimeout(()=>{
    cur += dir;
    qCard.classList.remove(outCls);
    optsWrap.classList.remove('opts-exit');
    loadQuestion();
    qCard.classList.add(inCls);
    optsWrap.classList.add('opts-enter');
    setTimeout(()=>{
      qCard.classList.remove(inCls);
      optsWrap.classList.remove('opts-enter');
      busy = false;
    }, 340);
  }, 200);
}

/* ════════════════════════════════════════
   RESULTS
   ════════════════════════════════════════ */
function showResults(){
  const pct     = Math.round((score/20)*100);
  const wrong   = answers.filter((a,i)=> a!==null && a!==QUESTIONS[i].ans).length;
  const skipped = answers.filter(a=> a===null).length;

  $('rs-correct').textContent = score;
  $('rs-wrong').textContent   = wrong;
  $('rs-skip').textContent    = skipped;
  $('r-pct').textContent      = pct + '%';

  let medal, headline, tagline;
  if(pct===100){ medal='🏆'; headline='Perfect Score!';      tagline='Absolutely flawless. You\'re a true mastermind.'; }
  else if(pct>=85){ medal='🥇'; headline='Outstanding!';    tagline='Exceptional performance — you know your stuff.'; }
  else if(pct>=70){ medal='🥈'; headline='Well Done!';       tagline='Solid knowledge. Just a few more practice rounds!'; }
  else if(pct>=50){ medal='🥉'; headline='Good Effort!';     tagline='A decent attempt — keep studying and try again.'; }
  else            { medal='📚'; headline='Keep Practicing!'; tagline='Every expert was once a beginner. You\'ll get there.'; }

  $('result-medal').textContent  = medal;
  $('r-headline').textContent    = headline;
  $('r-tagline').textContent     = tagline;

  switchScreen(quizScreen, resultScreen, ()=>{
    setTimeout(()=>{
      /* Animate ring */
      const circ   = 540.35;
      $('r-ring-fg').style.strokeDashoffset = circ - (circ * pct / 100);

      /* Count up score */
      const el = $('r-score-num');
      let count = 0;
      const id = setInterval(()=>{
        count = Math.min(count + 1, score);
        el.textContent = count;
        if(count >= score) clearInterval(id);
      }, 60);

      if(pct >= 50) fireConfetti(pct >= 80 ? 200 : 120);
    }, 500);
  });
}

/* ════════════════════════════════════════
   RESTART
   ════════════════════════════════════════ */
function restart(){
  cur     = 0;
  score   = 0;
  answers = new Array(20).fill(null);
  scoreNum.textContent = '0';
  $('r-ring-fg').style.strokeDashoffset = '540.35';

  switchScreen(resultScreen, quizScreen, ()=>{
    buildDots();
    loadQuestion();
  });
}

/* ════════════════════════════════════════
   EVENTS
   ════════════════════════════════════════ */
startBtn.addEventListener('click', ()=>{
  switchScreen(introScreen, quizScreen, ()=>{
    buildDots();
    loadQuestion();
  });
});

prevBtn.addEventListener('click', ()=>{ if(cur>0) navigate(-1); });

nextBtn.addEventListener('click', ()=>{
  if(cur<19) navigate(1);
  else showResults();
});

restartBtn.addEventListener('click', restart);

/* Keyboard shortcuts */
document.addEventListener('keydown', e=>{
  if(!quizScreen.classList.contains('active')) return;
  if(e.key==='ArrowRight' || e.key==='ArrowDown')  nextBtn.click();
  if(e.key==='ArrowLeft'  || e.key==='ArrowUp')    { if(!prevBtn.disabled) prevBtn.click(); }
  const idx = ['1','2','3','4'].indexOf(e.key);
  if(idx!==-1){
    const btns = optsWrap.querySelectorAll('.opt');
    if(btns[idx] && !btns[idx].disabled) btns[idx].click();
  }
});