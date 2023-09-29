const MasterData = require("./models/MasterData.model")
const modelsRegistry = {
    
    "MasterData": {
        database: "application",
        model   : MasterData
    }
};

exports.modelsRegistry = modelsRegistry;