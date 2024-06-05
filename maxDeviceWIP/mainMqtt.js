var mqtt = require('mqtt');
var isReady = false;
var rbeState = {};
var apis = {};
var config;

function log(message) {
    post(message + "\n"); // Use post to log messages in Max console
}

// Initialize Max environment and LiveAPI
function init() {
    if (!config) {
        log("Config not loaded");
        return;
    }
    isReady = true;
    log("Max for Live Initialized");
    initializeMQTT();
}

function initializeMQTT() {
    log("Starting Ableton and MQTT Integration...");

    // Connect to MQTT Broker
    var client = mqtt.connect(config.mqtt.server);
    client.on('connect', function() {
        log("MQTT Connected to " + config.mqtt.server);
        config.mqtt.mqttSensors.forEach(function(sensor) {
            client.subscribe(sensor.topic, function(err) {
                if (!err) {
                    log("Subscribed to " + sensor.topic + ": " + sensor.description);
                } else {
                    log("Error subscribing to " + sensor.topic + ": " + err.message);
                }
            });
        });
    });

    client.on('message', function(topic, message) {
        var data = JSON.parse(message.toString());
        var sensorConfig = config.mqtt.mqttSensors.find(function(sensor) {
            return sensor.topic === topic;
        });
        if (!sensorConfig) return;
        handleMessage(topic, data, sensorConfig);
    });

    client.on('error', function(error) {
        log("MQTT Error: " + error.message);
    });

    client.on('offline', function() {
        log("MQTT Client Offline");
    });

    client.on('reconnect', function() {
        log("MQTT Client Reconnecting...");
    });
}

// Handle incoming MQTT messages
function handleMessage(topic, data, sensorConfig) {
    log("Received message on topic " + topic);
    if (sensorConfig.type === "buttonPress") {
        handleButtonPress(sensorConfig, data);
    } else {
        handleSensorData(topic, data, sensorConfig);
    }
}

function handleButtonPress(sensorConfig, data) {
    var action = data.action;
    var pressDuration = data.pressDuration;
    log("Button action: " + action + ", duration: " + pressDuration);

    if (action === "shortPress") {
        log('Starting clip for short press');
        triggerClipInAbleton(sensorConfig.abletonTrack, sensorConfig.clip - 1);
    } else if (action === "longPress") {
        log('Stopping clip for long press');
        triggerClipInAbleton(sensorConfig.abletonTrack, -1);
    }
}

function handleSensorData(topic, data, sensorConfig) {
    var fieldValue = getFieldValue(data, sensorConfig.property);
    var prevState = rbeState[topic];

    if (prevState !== fieldValue) {
        log("Value change detected on " + sensorConfig.description + ": " + fieldValue);
        rbeState[topic] = fieldValue;
        var clipIndex = mapSensorValueToClipIndex(fieldValue, sensorConfig) - 1;
        triggerClipInAbleton(sensorConfig.abletonTrack, clipIndex);
    }
}


function getFieldValue(data, propertyPath) {
    return propertyPath.split('.').reduce(function(acc, part) {
        return acc && acc[part];
    }, data) || 0;
}

function mapSensorValueToClipIndex(value, sensorConfig) {
    var sensorRange = sensorConfig.sensorRange;
    var clipRange = sensorConfig.clipRange;
    var sensorSpan = sensorRange.max - sensorRange.min;
    var clipSpan = clipRange.max - clipRange.min;
    var scaledValue = ((value - sensorRange.min) / sensorSpan) * clipSpan + clipRange.min;
    return Math.min(Math.max(Math.round(scaledValue), clipRange.min), clipRange.max);
}

function triggerClipInAbleton(trackIndex, clipIndex) {
    if (clipIndex < 0) {
        log("Stopping all clips on track " + trackIndex);
        callApi("live_set tracks " + trackIndex, 'stop_all_clips');
    } else {
        log("Firing clip " + clipIndex + " on track " + trackIndex);
        callApi("live_set tracks " + trackIndex + " clip_slots " + clipIndex + " clip", 'fire');
    }
}

function callApi(path, method, args) {
    if (!isReady) return;
    var api = getApi(path);
    api.call(method, args || []);
}

function getApi(path) {
    if (apis[path]) return apis[path];
    apis[path] = new LiveAPI(path);
    return apis[path];
}

// Receive configuration data from Max patch
function anything() {
    var input = messagename;
    if (inlet == 0) {
        config = JSON.parse(input);
        log("Config loaded: " + JSON.stringify(config));
        init();
    }
}


