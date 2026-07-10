const express = require("express");
const router = express.Router();
const Monitoring = require("../models/Monitoring");

router.post("/save", async (req, res) => {

  try {

    const monitoring = new Monitoring(req.body);

    await monitoring.save();

    res.json({ success:true });

  } catch(err) {

    console.error(err);
    res.status(500).json({ error:"Save failed" });

  }

});

module.exports = router;
