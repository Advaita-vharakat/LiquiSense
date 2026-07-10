const mongoose = require("mongoose");

const MonitoringSchema = new mongoose.Schema({
  item: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  readings: {
    ph: { type: Number, default: null },
    temp: { type: Number, default: null },
    turbidity: { type: Number, default: null },
    conductivity: { type: Number, default: null },
    weight: { type: Number, default: null },
    density: { type: Number, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Monitoring", MonitoringSchema);
