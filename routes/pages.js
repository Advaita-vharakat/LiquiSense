const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
res.render("dashboard");
});

router.get("/monitor",(req,res)=>{
res.render("monitor");
});

router.get("/fssai",(req,res)=>{
res.render("fssai");
});

router.get("/schemes",(req,res)=>{
res.render("schemes");
});

router.get("/settings",(req,res)=>{
res.render("settings");
});

// Save monitoring result
router.post('/save-monitor', async (req, res) => {
	try {
		const TestRecord = require('../models/TestRecords.models');
		const payload = req.body || {};

		// Map expected fields (fallbacks)
		const record = new TestRecord({
			device_id: payload.device_id || 'simulator',
			temperature_c: payload.temperature_c || null,
			ph_value: payload.ph_value || null,
			turbidity_raw: payload.turbidity_raw || null,
			conductivity_raw: payload.conductivity_raw || null,
			density_g_per_ml: payload.density_g_per_ml || null,
			screening_status: payload.screening_status || 'UNKNOWN'
		});

		await record.save();
		res.json({ ok: true, id: record._id });
	} catch (err) {
		console.error('save-monitor error', err);
		res.status(500).json({ ok: false, error: err.message });
	}
});

// Export monitoring records as CSV
router.get('/export', async (req, res) => {
	try {
		const Monitoring = require('../models/Monitoring');
		const rows = await Monitoring.find().sort({ createdAt: -1 }).lean();

		const headers = ['item','startTime','endTime','ph','temp','turbidity','conductivity','weight','density','createdAt'];
		const lines = [headers.join(',')];

		rows.forEach(r => {
			const vals = [];
			vals.push(`"${(r.item||'').toString().replace(/"/g,'""')}"`);
			vals.push(r.startTime ? `"${new Date(r.startTime).toISOString()}"` : '');
			vals.push(r.endTime ? `"${new Date(r.endTime).toISOString()}"` : '');
			const rd = r.readings || {};
			vals.push(rd.ph != null ? rd.ph : '');
			vals.push(rd.temp != null ? rd.temp : '');
			vals.push(rd.turbidity != null ? rd.turbidity : '');
			vals.push(rd.conductivity != null ? rd.conductivity : '');
			vals.push(rd.weight != null ? rd.weight : '');
			vals.push(rd.density != null ? rd.density : '');
			vals.push(r.createdAt ? `"${new Date(r.createdAt).toISOString()}"` : '');

			lines.push(vals.join(','));
		});

		const csv = lines.join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="monitorings.csv"');
		res.send(csv);
	} catch (err) {
		console.error('export error', err);
		res.status(500).send('Error generating CSV');
	}
});

// Generate a simple PDF report of recent monitoring records
router.get('/report', async (req, res) => {
	try {
		const PDFDocument = require('pdfkit');
		const Monitoring = require('../models/Monitoring');
		const rows = await Monitoring.find().sort({ createdAt: -1 }).limit(200).lean();

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename="monitorings-report.pdf"');

		const doc = new PDFDocument({ margin: 40, size: 'A4' });
		doc.pipe(res);

		doc.fontSize(18).text('LiquiSense - Monitoring Report', { align: 'center' });
		doc.moveDown();
		doc.fontSize(10);

		rows.forEach((r, idx) => {
			doc.fillColor('#111').text(`${idx+1}. Item: ${r.item || 'N/A'}`, { continued: false });
			const rd = r.readings || {};
			doc.text(`   pH: ${rd.ph ?? '-'}   Temp: ${rd.temp ?? '-'}   Turbidity: ${rd.turbidity ?? '-'}   Conductivity: ${rd.conductivity ?? '-'}   Weight: ${rd.weight ?? '-'}   Density: ${rd.density ?? '-'}`);
			doc.text(`   Start: ${r.startTime ? new Date(r.startTime).toLocaleString() : '-'}   Created: ${r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}`);
			doc.moveDown(0.5);
		});

		doc.end();
	} catch (err) {
		console.error('report error', err);
		res.status(500).send('Error generating PDF');
	}
});

module.exports = router;
