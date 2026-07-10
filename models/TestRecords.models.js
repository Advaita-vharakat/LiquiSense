const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
    device_id: String,
    temperature_c: Number,
    ph_value: Number,
    turbidity_raw: Number,
    conductivity_raw: Number,
    density_g_per_ml: Number,
    screening_status: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestRecord", TestSchema);
