import ky from 'ky';

const endpoint = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const vehicleEngineType = 'electric'
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';
export class RouteGenerator {
    constructor(startPoint = [52,21], endPoint = [49,20], constantSpeedConsumptionInkWhPerHundredkm ="32,10.87:77,18.01", currentChargeInkWh=20, maxChargeInkWh=40, minChargeAtDestinationInkWh=4,minChargeAtChargingStopsInkWh=4) {
        this.startPoint = startPoint
        this.endPoint = endPoint
        this.constantSpeedConsumptionInkWhPerHundredkm = constantSpeedConsumptionInkWhPerHundredkm
        this.currentChargeInkWh = currentChargeInkWh
        this.maxChargeInkWh = maxChargeInkWh
        this.minChargeAtDestinationInkWh = minChargeAtDestinationInkWh
        this.minChargeAtChargingStopsInkWh = minChargeAtChargingStopsInkWh
    }
    getEndpointURL(){
        return endpoint + this.startPoint[0]+','+this.startPoint[1]+':'+this.endPoint[0]+','+this.endPoint[1]+'/json?key='+key+'&vehicleEngineType='+vehicleEngineType+'&constantSpeedConsumptionInkWhPerHundredkm='+this.constantSpeedConsumptionInkWhPerHundredkm+'&currentChargeInkWh='+this.currentChargeInkWh+'&maxChargeInkWh='+this.maxChargeInkWh+'&minChargeAtDestinationInkWh='+this.minChargeAtDestinationInkWh+'&minChargeAtChargingStopsInkWh='+this.minChargeAtChargingStopsInkWh
    }

    async makeOptimalRouteApiCall(endpoint, body){
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    computeOptimalRoute(){
        let enpointURL = this.getEndpointURL()
        let body = {json: {
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
                          }}};
        return this.makeOptimalRouteApiCall(enpointURL, body)
    }

}