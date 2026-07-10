/* ===============================
   LIQUISENSE DASHBOARD MAIN JS
================================= */

/* ===== SIDEBAR ACTIVE LINK ===== */

const links = document.querySelectorAll(".sidebar a");

links.forEach(link=>{
   try{
      if(link.getAttribute('href') === window.location.pathname || link.href === window.location.href){
         link.classList.add('active');
      }
   }catch(e){/* ignore */}
});

/* ===== SIDEBAR TOGGLE ===== */
const sidebar = document.getElementById('appSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
if(sidebarToggle && sidebar){
   // restore saved state
   const savedSidebar = localStorage.getItem('liquisense-sidebar');
   if(savedSidebar === 'collapsed') sidebar.classList.add('collapsed');

   sidebarToggle.addEventListener('click', ()=>{
      const collapsed = sidebar.classList.toggle('collapsed');
      localStorage.setItem('liquisense-sidebar', collapsed ? 'collapsed' : 'open');
      sidebar.setAttribute('aria-expanded', String(!collapsed));
   });
}


/* ===== LIVE CLOCK ===== */

function updateClock(){

const clock = document.getElementById("liveClock");

if(!clock) return;

const now = new Date();

clock.innerText = now.toLocaleString();

}

setInterval(updateClock,1000);
updateClock();


/* ===== DUMMY SENSOR DATA ===== */

function updateSensors(){

const temp = document.getElementById("temp");
const ph = document.getElementById("ph");
const density = document.getElementById("density");
const status = document.getElementById("status");

if(!temp) return;

const temperature = (20 + Math.random()*5).toFixed(2);
const phValue = (6 + Math.random()).toFixed(2);
const densityValue = (1 + Math.random()*0.05).toFixed(3);

temp.innerText = temperature + " °C";
ph.innerText = phValue;
density.innerText = densityValue;

/* Screening Simulation */

let state="PASS";

if(phValue<6.2 || densityValue<1.01) state="SUSPICIOUS";
if(phValue<5.8 || densityValue<0.98) state="FAIL";

status.innerText = state;

status.classList.remove("pass","fail","suspicious");

if(state==="PASS") status.classList.add("pass");
if(state==="FAIL") status.classList.add("fail");
if(state==="SUSPICIOUS") status.classList.add("suspicious");

}

setInterval(updateSensors,3000);


/* ===== CARD HOVER EFFECT ===== */

const cards = document.querySelectorAll(".card");

cards.forEach(card=>{
card.addEventListener("mouseenter",()=>{
card.style.transform="translateY(-6px)";
});
card.addEventListener("mouseleave",()=>{
card.style.transform="translateY(0px)";
});
});


/* ===== CONNECTION STATUS SIMULATION ===== */

function updateConnection(){

const conn=document.getElementById("connection");

if(!conn) return;

const states=["Connected","Disconnected"];

const state=states[Math.floor(Math.random()*2)];

conn.innerText=state;

if(state==="Connected"){
conn.style.color="#10b981";
}else{
conn.style.color="#ef4444";
}

}

setInterval(updateConnection,8000);


/* ===== CONSOLE INIT ===== */

console.log("LiquiSense Dashboard Loaded Successfully");

/* ===== THEME TOGGLE ===== */
// Apply saved theme (support legacy 'ls_theme')
{
   const saved = localStorage.getItem('liquisense-theme') || localStorage.getItem('ls_theme');
   if (saved === 'light') document.body.classList.add('light-mode');
   else document.body.classList.remove('light-mode');

   // Listen to storage changes so theme updates propagate across tabs/pages
   window.addEventListener('storage', (e)=>{
      if(e.key === 'liquisense-theme' || e.key === 'ls_theme'){
         const val = localStorage.getItem('liquisense-theme') || localStorage.getItem('ls_theme');
         if(val === 'light') document.body.classList.add('light-mode');
         else document.body.classList.remove('light-mode');
      }
   });
}

/* ===== UPCOMING EVENTS: REGISTER HANDLER ===== */
document.addEventListener('click', function(e){
  const btn = e.target.closest && e.target.closest('.register-btn');
  if(!btn) return;
  const eventId = btn.getAttribute('data-event') || 'unknown';
  // simulate registration
  btn.disabled = true;
  btn.innerText = 'Registered';
  // Optionally store registration in localStorage
  const key = 'liquisense-registered-' + eventId;
  localStorage.setItem(key, '1');
});
