# Ableton Live and MQTT Integration with Meraki Cameras and Sensors

This project integrates real-world MQTT sensor data from Cisco Meraki devices with Ableton Live, enabling dynamic music and sound effects control. Utilizing Ableton's Live Object Model (LOM) through the `max4node` library, the application facilitates executing actions within Ableton Live based on MQTT messages, ideal for interactive installations, performances, and educational purposes.

## Project Overview

By translating MQTT sensor data into actionable commands within Ableton Live, this application bridges physical interactions with digital audio production. It supports triggering clips, toggling track states, and dynamically adjusting parameters, offering a unique platform to learn about MQTT and have some fun making music.

## Installation

### Prerequisites

- [Node.js and npm](https://nodejs.org/).
- [Ableton Live](https://www.ableton.com/en/live/), with Max for Live installed.
- An MQTT broker, such as [mosquitto](https://mosquitto.org/download/)

### Setup Instructions

1. Clone or download this repository.
2. Navigate to the project directory and run `npm install` to install dependencies, including the `max4node` library.
3. Configure `config.js` with MQTT broker details and sensor mappings.
4. Install the Max for Live device located at `node_modules/max4node/max_device/max4node.amxd` into Ableton Live (see below for detailed instructions).
5. Execute `node index.js` to start the application.

### Installing the Max for Live Device

To link the Node.js application with Ableton Live, you need to install the `max4node` Max for Live device:

1. Find the `max4node.amxd` device in your project's `node_modules/max4node/max_device/` directory after installing `max4node`.
2. Drag and drop the `max4node.amxd` file into Ableton Live to install it.
3. Ensure the device is loaded on a MIDI track to establish communication with the Node.js application.

For more information on `max4node`, visit the [npm package page](https://www.npmjs.com/package/max4node).

## Configuration (`config.js`)

The `config.js` file defines interactions between MQTT sensors and Ableton Live:

```javascript
module.exports = {
    mqtt: {
        server: 'mqtt://your_mqtt_broker_address',
        mqttSensors: [
            {
                topic: '/your/sensor/topic',
                description: "Sensor Description",
                abletonTrack: 1,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 10 },
                clipRange: { min: 0, max: 5 },
            },
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:FF:FF:FF/buttonReleased',
                description: "Button press length",
                abletonTrack: 1,
                type: 'buttonPress',
                sensorRange: { min: 0.1, max: 2 },
                clipRange: { min: 6, max: 6 },
                clip: 1
            },
            // Additional configurations...
        ]
    }
};
```

### Key Configuration Options

- **`abletonTrack`**: Specifies the target Ableton Live track.
- **`type`**: Specifies the type of sensor data (e.g., `peopleCount`, `buttonPress`).
- **`sensorRange` and `clipRange`**: Define linear mapping of sensor values to clip indices for controlling which clips are triggered.
- **`clip`**: Specifies the clip index for button press actions.

## Documentation References

- **Max Live Object Model (LOM)**: [Max LOM Documentation](https://docs.cycling74.com/max6/dynamic/c74_docs.html#live_object_model).
- **Cisco Meraki MQTT API**: [Meraki API Resources](https://developer.cisco.com/meraki/mv-sense/mqtt/), [MT MQTT Setup Guide](https://documentation.meraki.com/MT/MT_General_Articles/MT_MQTT_Setup_Guide).

## Example Use Cases

- **Interactive Installations**: Trigger audio clips/effects in Ableton Live based on sensor interactions.
- **Live Performances**: Enhance performances with sensors for dynamic music control.
- **Educational Tools**: Engage with music production and interaction design through hands-on projects.


