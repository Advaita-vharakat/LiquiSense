(function(){

/* -------------------- CONFIG -------------------- */

const ESP32_API = "/api/esp32/live";

const safetyThresholds = {
'Raw Milk': { category:'dairy', ph:{min:6.5,max:7.2}, temp:{min:4,max:8}, turbidity:{max:2}, conductivity:{min:3000,max:5000}, density:{min:1.025,max:1.035}, weight:{min:100}},
'Pasteurized Milk': { category:'dairy', ph:{min:6.6,max:7.1}, temp:{min:4,max:6}, turbidity:{max:1.5}, conductivity:{min:2800,max:4800}, density:{min:1.025,max:1.034}, weight:{min:100}},
'Butter': { category:'dairy', ph:{min:5.5,max:7.5}, temp:{min:10,max:20}, turbidity:{max:5}, conductivity:{min:1000,max:3000}, density:{min:0.9,max:0.95}, weight:{min:50}},
'Cheese': { category:'dairy', ph:{min:5,max:6.8}, temp:{min:10,max:15}, turbidity:{max:3}, conductivity:{min:2000,max:4000}, density:{min:1.0,max:1.1}, weight:{min:30}},
'Chicken': { category:'meat', ph:{min:6,max:7}, temp:{min:2,max:4}, turbidity:{max:4}, conductivity:{min:3000,max:6000}, density:{min:1.05,max:1.1}, weight:{min:500}},
'Beef': { category:'meat', ph:{min:5.5,max:6.8}, temp:{min:0,max:4}, turbidity:{max:3}, conductivity:{min:3500,max:6500}, density:{min:1.06,max:1.12}, weight:{min:500}},
'Mutton': { category:'meat', ph:{min:5.8,max:6.9}, temp:{min:0,max:4}, turbidity:{max:3}, conductivity:{min:3000,max:6000}, density:{min:1.05,max:1.1}, weight:{min:500}},
'Spinach': { category:'vegetable', ph:{min:6,max:7.5}, temp:{min:4,max:8}, turbidity:{max:6}, conductivity:{min:1500,max:3000}, density:{min:0.95,max:1.05}, weight:{min:50}},
'Carrot': { category:'vegetable', ph:{min:6.5,max:7.5}, temp:{min:4,max:8}, turbidity:{max:4}, conductivity:{min:1000,max:2500}, density:{min:1.0,max:1.08}, weight:{min:80}},
'Potato': { category:'vegetable', ph:{min:5.5,max:7.5}, temp:{min:4,max:10}, turbidity:{max:5}, conductivity:{min:800,max:2000}, density:{min:1.07,max:1.1}, weight:{min:100}},
'Wheat': { category:'grain', ph:{min:6,max:7}, temp:{min:10,max:20}, turbidity:{max:10}, conductivity:{min:500,max:2000}, density:{min:1.4,max:1.5}, weight:{min:100}},
'Rice': { category:'grain', ph:{min:6,max:7}, temp:{min:10,max:20}, turbidity:{max:8}, conductivity:{min:400,max:1500}, density:{min:1.45,max:1.55}, weight:{min:100}}
};

/* -------------------- STATE -------------------- */

const sensorMetrics=['ph','temp','turbidity','conductivity','weight','density'];
let chartInstances={};
const sensorDataHistory={ph:[],temp:[],turbidity:[],conductivity:[],weight:[],density:[]};
let isMonitoring=false;
let currentItem='';
let monitoringStartTime=null;
let intervalRef=null;

/* -------------------- DOM -------------------- */

const $=(s)=>document.querySelector(s);
const startBtn=$("#startMonitor");
const monitorPanel=$("#monitorPanel");
const monitorTitle=$("#monitorTitle");
const stopMonitor=$("#stopMonitor");
const saveData=$("#saveData");
const monitorStatus=$("#monitorStatus");
const itemSelect=$("#itemSelect");
const expectedBox=$("#expectedValues");
const expectedContent=$("#expectedContent");

/* -------------------- DROPDOWN INIT -------------------- */

function populateDropdown(category='all'){
itemSelect.innerHTML='';
Object.keys(safetyThresholds).forEach(item=>{
if(category==='all'||safetyThresholds[item].category===category){
const opt=document.createElement('option');
opt.value=item;
opt.textContent=item;
itemSelect.appendChild(opt);
}
});
}

document.querySelectorAll('.chip').forEach(chip=>{
chip.addEventListener('click',()=>{
document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
chip.classList.add('active');
populateDropdown(chip.dataset.category);
});
});

itemSelect.addEventListener('change',()=>{
const item=itemSelect.value;
const rules=safetyThresholds[item];
expectedBox.classList.remove('hidden');
expectedContent.innerHTML=Object.keys(rules)
.filter(k=>k!=='category')
.map(k=>{
	const key = k;
	const name = key.charAt(0).toUpperCase() + key.slice(1);
	const rule = rules[key];
	// units map
	const units = {ph:'', temp:'°C', turbidity:'NTU', conductivity:'µS/cm', weight:'g', density:'g/cm³'};
	const unit = units[key] || '';
	if (rule && typeof rule === 'object'){
		const hasMin = Object.prototype.hasOwnProperty.call(rule,'min');
		const hasMax = Object.prototype.hasOwnProperty.call(rule,'max');
		if (hasMin && hasMax){
			return `${name}: ${rule.min}${unit} - ${rule.max}${unit}`;
		} else if (hasMin){
			return `${name}: ≥ ${rule.min}${unit}`;
		} else if (hasMax){
			return `${name}: ≤ ${rule.max}${unit}`;
		}
	}
	// fallback — show raw value
	return `${name}: ${JSON.stringify(rule)}`;
}).join("<br>");
});

populateDropdown();

/* -------------------- CHART -------------------- */

function initializeCharts(){
sensorMetrics.forEach(metric=>{
const canvas=document.getElementById(metric+"Chart");
if(!canvas) return;
chartInstances[metric]=new Chart(canvas.getContext('2d'),{
type:'line',
data:{labels:[],datasets:[{data:[],borderWidth:2,fill:false}]},
options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}
});
});
}

function updateChart(metric,value){
const chart=chartInstances[metric];
if(!chart) return;
chart.data.labels.push(new Date().toLocaleTimeString());
chart.data.datasets[0].data.push(value);
if(chart.data.labels.length>20){
chart.data.labels.shift();
chart.data.datasets[0].data.shift();
}
chart.update('none');
}

/* -------------------- SENSOR UPDATE -------------------- */

function updateSensorReadings(data){

$('#phValue').innerText=data.ph.toFixed(2);
$('#tempValue').innerText=data.temp.toFixed(1);
$('#turbidityValue').innerText=data.turbidity.toFixed(2);
$('#conductivityValue').innerText=data.conductivity.toFixed(0);
$('#weightValue').innerText=data.weight.toFixed(1);
$('#densityValue').innerText=data.density.toFixed(3);

sensorMetrics.forEach(metric=>{
updateChart(metric,data[metric]);
sensorDataHistory[metric].push({time:new Date(),value:data[metric]});
});
}

/* -------------------- ESP32 FETCH -------------------- */

async function fetchESP32Data(){
try{
const res=await fetch(ESP32_API);
if(!res.ok) throw new Error();
const data=await res.json();
updateSensorReadings(data);
monitorStatus.innerText="📡 Live ESP32 Data Connected";
}catch{
monitorStatus.innerText="❌ ESP32 Connection Failed";
}
}

/* -------------------- EVENTS -------------------- */

startBtn.addEventListener('click',()=>{

currentItem=itemSelect.value;
if(!currentItem) return;

monitorTitle.innerText=`Monitoring: ${currentItem}`;
monitorPanel.classList.remove('hidden');
isMonitoring=true;
monitoringStartTime=new Date();

sensorMetrics.forEach(m=>sensorDataHistory[m]=[]);
chartInstances={};
initializeCharts();

intervalRef=setInterval(()=>{
if(!isMonitoring){
clearInterval(intervalRef);
return;
}
fetchESP32Data();
},1000);

});

stopMonitor.addEventListener('click',()=>{
isMonitoring=false;
clearInterval(intervalRef);
monitorPanel.classList.add('hidden');
});

saveData.addEventListener('click',async()=>{
	// Build readings as single numeric snapshot (latest value) to match server schema
	const readingsSnapshot = {};
	sensorMetrics.forEach(metric=>{
		const history = sensorDataHistory[metric];
		if(history && history.length){
			readingsSnapshot[metric] = history[history.length-1].value;
		} else {
			// fallback: try reading from DOM
			const el = document.getElementById(metric+"Value");
			const parsed = el ? parseFloat(el.innerText.replace(/[^0-9.\-]/g,'')) : null;
			readingsSnapshot[metric] = isFinite(parsed) ? parsed : null;
		}
	});

	const payload = {
		item: currentItem,
		startTime: monitoringStartTime,
		endTime: new Date(),
		readings: readingsSnapshot
	};

	try{
		const res = await fetch('/api/monitoring/save',{
			method:'POST',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify(payload)
		});
		if(res.ok){
			alert("Data saved");
			isMonitoring=false;
			monitorPanel.classList.add('hidden');
		} else {
			const body = await res.json().catch(()=>null);
			console.error('Save failed', res.status, body);
			alert('Save failed');
		}
	}catch(err){
		console.error('Save error', err);
		alert("Save failed");
	}
});

})();
