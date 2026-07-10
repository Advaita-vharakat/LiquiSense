const express = require("express");
const router = express.Router();
const espFetcher = require("../config/espFetcher");

router.get("/live",(req,res)=>{
    res.json(espFetcher.getData());
});

module.exports = router;
