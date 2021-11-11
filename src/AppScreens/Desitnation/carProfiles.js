export const carProfiles = [
    {
        name: 'Super Tesla',
        params: {
            constantSpeedConsumptionInkWhPerHundredkm: "32,10.87:77,18.01",
            currentChargeInkWh: 20,
            maxChargeInkWh: 100,
            minChargeAtDestinationInkWh: 4,
            minChargeAtChargingStopsInkWh: 4,
        },
        body: {
            "chargingParameters": {
                "batteryCurve": [
                    {
                        "stateOfChargeInkWh": 50.0,
                        "maxPowerInkW": 200
                    },
                    {
                        "stateOfChargeInkWh": 70.0,
                        "maxPowerInkW": 100
                    },
                    {
                        "stateOfChargeInkWh": 80.0,
                        "maxPowerInkW": 40
                    }
                ],
                "chargingConnectors": [
                    {
                        "currentType": "AC3",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 11
                    },
                    {
                        "currentType": "DC",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "voltageRange": {
                            "minVoltageInV": 0,
                            "maxVoltageInV": 500
                        },
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 150
                    },
                    {
                        "currentType": "DC",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "voltageRange": {
                            "minVoltageInV": 500,
                            "maxVoltageInV": 2000
                        },
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2
                    }
                ],
                "chargingTimeOffsetInSec": 60
            }
        }
    },

    {
        name: 'Słabe BMW',
        params: {
            constantSpeedConsumptionInkWhPerHundredkm: "32,10.87:77,18.01",
            currentChargeInkWh: 20,
            maxChargeInkWh: 40,
            minChargeAtDestinationInkWh: 4,
            minChargeAtChargingStopsInkWh: 4,
        },
        body: {
            "chargingParameters": {
                "batteryCurve": [
                    {
                        "stateOfChargeInkWh": 50.0,
                        "maxPowerInkW": 200
                    },
                    {
                        "stateOfChargeInkWh": 70.0,
                        "maxPowerInkW": 100
                    },
                    {
                        "stateOfChargeInkWh": 80.0,
                        "maxPowerInkW": 40
                    }
                ],
                "chargingConnectors": [
                    {
                        "currentType": "AC3",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 11
                    },
                    {
                        "currentType": "DC",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "voltageRange": {
                            "minVoltageInV": 0,
                            "maxVoltageInV": 500
                        },
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 150
                    },
                    {
                        "currentType": "DC",
                        "plugTypes": [
                            "IEC_62196_Type_2_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base"
                        ],
                        "voltageRange": {
                            "minVoltageInV": 500,
                            "maxVoltageInV": 2000
                        },
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2
                    }
                ],
                "chargingTimeOffsetInSec": 60
            }
        }
    },

]