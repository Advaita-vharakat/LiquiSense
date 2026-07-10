const axios = require("axios");
const cheerio = require("cheerio");

const ESP32_URL = "http://192.168.0.120"; // your esp ip

let latestData = {};

async function fetchESPData() {
    try {
        const response = await axios.get(ESP32_URL);

        const $ = cheerio.load(response.data);

        // ⚠️ CHANGE SELECTORS based on ESP HTML ids
        latestData = {
            ph: parseFloat($("#ph").text()),
            temp: parseFloat($("#temp").text()),
            turbidity: parseFloat($("#turbidity").text()),
            conductivity: parseFloat($("#conductivity").text()),
            weight: parseFloat($("#weight").text()),
            density: parseFloat($("#density").text())
        };

    } catch (err) {
        console.log("ESP fetch failed");
    }
}

// fetch every second
setInterval(fetchESPData,1000);

module.exports = {
    getData: ()=> latestData
};
