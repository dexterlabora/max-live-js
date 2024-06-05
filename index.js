const mqtt = require('mqtt');
const Max4Node = require('max4node');
const config = require('./config'); 

const max = new Max4Node();
max.bind();
console.log("Ableton and MQTT Integration Starting...");

max.get({
    path: 'live_set master_track mixer_device volume',
    property: 'value'
}).once('value', val => {
    console.log('Master track volume: ' + val);
});

const rbeState = {};

// Connect to MQTT Broker
const client = mqtt.connect(config.mqtt.server);

client.on('connect', () => {
    console.log("Connecting to MQTT broker: " + config.mqtt.server);
    config.mqtt.mqttSensors.forEach(sensor => {
        client.subscribe(sensor.topic, err => {
            if (!err) {
                console.log(`Subscribed to ${sensor.topic}: ${sensor.description}`);
            }
        });
    });
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    const sensorConfig = config.mqtt.mqttSensors.find(sensor => sensor.topic === topic);
    if (!sensorConfig) return;

    handleMessage(topic, data, sensorConfig);
});

function handleMessage(topic, data, sensorConfig) {
    if (sensorConfig.type === "buttonPress") {
        handleButtonPress(topic, data, sensorConfig);
    } else {
        handleSensorData(topic, data, sensorConfig);
    }
}

function handleButtonPress(topic, data, sensorConfig) {
    const { action, pressDuration } = data;
    console.log(`Button action: ${action}, duration: ${pressDuration}`);

    if (action === "shortPress") {
        console.log('Starting clip for short press');
        let clipIndex = sensorConfig.clip -1
        triggerClipInAbleton(sensorConfig.abletonTrack, clipIndex, topic);
    } else if (action === "longPress") {
        console.log('Stopping clip for long press');
        triggerClipInAbleton(sensorConfig.abletonTrack, -1, topic);
    }
}

function handleSensorData(topic, data, sensorConfig) {
    const fieldValue = getFieldValue(data, sensorConfig.property);
    const prevState = rbeState[topic];

    if (prevState !== fieldValue) {
        console.log(`Value change detected on ${sensorConfig.description}: ${fieldValue}`);
        rbeState[topic] = fieldValue;

        const clipIndex = mapSensorValueToClipIndex(fieldValue, sensorConfig) - 1;
        triggerClipInAbleton(sensorConfig.abletonTrack, clipIndex, topic);
    }
}

function getFieldValue(data, propertyPath) {
    return propertyPath.split('.').reduce((acc, part) => acc && acc[part], data) || 0;
}

function mapSensorValueToClipIndex(value, sensorConfig) {
    const { sensorRange, clipRange } = sensorConfig;
    const sensorSpan = sensorRange.max - sensorRange.min;
    const clipSpan = clipRange.max - clipRange.min;
    const scaledValue = ((value - sensorRange.min) / sensorSpan) * clipSpan + clipRange.min;
    return Math.min(Math.max(Math.round(scaledValue), clipRange.min), clipRange.max);
}

async function triggerClipInAbleton(trackIndex, clipIndex, topic) {
    if (clipIndex < 0) {
        console.log(`Stopping all clips on track ${trackIndex}`);
        max.call({ path: `live_set tracks ${trackIndex}`, method: 'stop_all_clips' });
    } else {
        console.log(`Firing clip ${clipIndex} on track ${trackIndex}`);
        max.call({ path: `live_set tracks ${trackIndex} clip_slots ${clipIndex} clip`, method: 'fire', topic });
    }
}