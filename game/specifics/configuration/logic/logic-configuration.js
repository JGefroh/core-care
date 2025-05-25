const configuration = {
    rulesByName: {
        "footstep_trail": {
            conditions: [],
            effects: [
                {type: 'REGISTER_FOOTSTEP_TRAIL_FX', params: {}}
            ],
        },
        "door": {
            conditions: [],
            effects: [
                {type: 'REGISTER_DOOR', params: {}}
            ],
        },
        "dust": {
            conditions: [],
            effects: [
                {type: 'REQUEST_DUST_FX', params: { particleCount: 20, respectAngle: true, particleEmissionCyclesMax: 3}}
            ],
            frequency: 'once'
        },
        'cloud_fx': {
            conditions: [],
            effects: [
                {type: 'REQUEST_CLOUD_FX', params: { }}
            ],
            frequency: 'once'
        }
    },
    entityRules: {
        CLOUD_1: { rules: ['cloud_fx'] },
        CLOUD_2: { rules: ['cloud_fx'] },
    }
    
}
export default configuration;