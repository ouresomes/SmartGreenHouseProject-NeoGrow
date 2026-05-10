
const clientId = "Oure" + Math.random().toString(16).substr(2, 8);
    const host = 'wss://ouresomes1.cloud.shiftr.io:443'
    const options = {
  keepalive: 60,
  clientId: clientId,
  username: "ouresomes1",
  password: "spckKqjhEpdLCha3",
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  reconnectPeriod: 1000,
  connectTimeout: 3000,
}


console.log("Connect to Broker");
const client = mqtt.connect(host, options);

let latestTemp = null;
let latestSoil = null;

const tempLabels = [];
const tempData = [];

const moistureLabels = [];
const moistureData = [];

// Temperature Graph

const tempCtx = document.getElementById("tempChart").getContext("2d");

const tempChart = new Chart(tempCtx, {
    type: "line",
    data: {
        labels: tempLabels,
        datasets: [{
            data: tempData,
            borderColor: "#8a2be2",
            backgroundColor: "rgba(138, 43, 226, 0.15)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: "#8a2be2"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "#666"
                }
            },
            y: {
                ticks: {
                    color: "#666"
                }
            }
        }
    }
});

// Soil Moisture Graph

const moistureCtx = document.getElementById("moistureChart").getContext("2d");

const moistureChart = new Chart(moistureCtx, {
    type: "line",
    data: {
        labels: moistureLabels,
        datasets: [{
            data: moistureData,
            borderColor: "#8a2be2",
            backgroundColor: "rgba(138, 43, 226, 0.15)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: "#8a2be2"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "#666"
                }
            },
            y: {
                ticks: {
                    color: "#666"
                }
            }
        }
    }
});

// Connect to MQTT

client.on("connect", () => {

    console.log("MQTT Connected!");

    client.subscribe("Ur/Temp");
    client.subscribe("Ur/Soil");

    console.log("Subscribed to Topics");
});

// Data Recieve

client.on("message", (topic, message) => {

    const value = parseFloat(message.toString());

    console.log("TOPIC:", topic);
    console.log("VALUE:", value);

    if (topic === "Ur/Temp") {
        latestTemp = value;
    }

    if (topic === "Ur/Soil") {
        latestSoil = value;
    }
});

// Update Graphs Every 2 Seconds

setInterval(() => {

    const time = new Date().toLocaleTimeString();

    // Temperature Graph

    if (latestTemp !== null) {

        tempLabels.push(time);
        tempData.push(latestTemp);

        if (tempLabels.length > 15) {
            tempLabels.shift();
            tempData.shift();
        }

        tempChart.update();
    }

    // Soil Moisture Graph

    if (latestSoil !== null) {

        moistureLabels.push(time);
        moistureData.push(latestSoil);

        if (moistureLabels.length > 15) {
            moistureLabels.shift();
            moistureData.shift();
        }

        moistureChart.update();
    }

}, 2000);

// MQTT Error

client.on("error", (err) => {
    console.error("MQTT ERROR:", err);
});