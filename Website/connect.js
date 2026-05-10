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

client.on('connect', () => {
  console.log("Broker Connected, clientId : " + clientId);
    document.getElementById("connect-status").innerHTML="Connected";
    document.getElementById("connect-status").style.color="Green";
});

client.subscribe('Ur/#', { qos: 1 });
client.on('message', function (topic, data) {
    if(topic == "Ur/Humid"){
        document.getElementById("humid").innerHTML = data;
    }
    if(topic == "Ur/Temp"){
        document.getElementById("temp").innerHTML = data;
    }
    if(topic == "Ur/Gas"){
        document.getElementById("gas").innerHTML = data;
    }
    if(topic == "Ur/Light"){
        document.getElementById("ldr").innerHTML = data;
    }
    if(topic == "Ur/Soil"){
        document.getElementById("soil").innerHTML = data;
    }
    if(topic == "Ur/Lamp"){
        if(data == "ON"){
            document.getElementById("lamp").innerHTML = "On";
        }
        else{
            document.getElementById("lamp").innerHTML = "Off";
        }
    }
    if(topic == "Ur/Pump"){
        if(data == "ON"){
            document.getElementById("Status").innerHTML = "On";
        }
        else{
            document.getElementById("Status").innerHTML = "Off";
        }
    }
});

let payload = data.toString();
function controlDevice(element){
const status = element.checked ? "1" : "0";
client.publish("Ur/Switch", status, { qos: 1 });

const lampSwitch = document.getElementById("Switch");

lampSwitch.addEventListener("change", () => {
   console.log("SWITCH CLICKED");
});
}


