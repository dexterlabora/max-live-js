module.exports = {
    mqtt: {
        server: 'mqtt://127.0.0.1',
        mqttSensors: [
            {
                topic: '/merakimv/Q2NV-HBDU-SP23/0',
                property: "counts.person",
                description: "mv2-1 people",
                abletonTrack: 1,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            {
                topic: '/merakimv/Q2NV-Q2R7-YUTH/0',
                property: "counts.person",
                description: "mv2-2 people",
                abletonTrack: 2,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            {
                topic: '/merakimv/Q2NV-QA8G-UKYQ/0',
                property: "counts.person",
                description: "mv2-3 people",
                abletonTrack: 3,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            {
                topic: '/merakimv/Q2NV-LQL9-WYFW/0',
                property: "counts.person",
                description: "mv2-4 people",
                abletonTrack: 4,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            {
                topic: '/merakimv/Q2NV-MK89-BW79/0',
                property: "counts.person",
                description: "mv2-5 people",
                abletonTrack: 5,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            {
                topic: '/merakimv/Q2NV-P3HY-6TBZ/0',
                property: "counts.person",
                description: "mv2-6 people",
                abletonTrack: 6,
                type: 'peopleCount',
                sensorRange: { min: 0, max: 6 },
                clipRange: { min: 0, max: 6 }
            },
            





           
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/38:84:79:00:C3:BA/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 1
            }, 
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:73:77/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 2
            }, 
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:72:AF/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 3
            }, 
            
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:73:96/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 4
            }, 
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:71:E9/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 5

            }, 
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:70:AC/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 6
            }, 
            {
                topic: 'meraki/v1/mt/L_643451796760566006/ble/B8:AB:61:3C:70:92/buttonReleased',
                property: "pressDuration",
                description: "button press length",
                abletonTrack: 8,
                type: 'buttonPress',
                clip: 7
            }
            // {
            //     topic: 'meraki/v1/mt/L_643451796760561416/ble/38:84:79:00:C3:BA/buttonReleased',
            //     property: "pressDuration",
            //     description: "button press length",
            //     //abletonTrack: 5,
            //     type: 'buttonPress',
            //     sensorRange: { min: 0.1, max: 2 },
            //     action: 'live_set stop_all_clips' // https://docs.cycling74.com/max6/dynamic/c74_docs.html#live_object_model
            // }
        ]
    }
};
