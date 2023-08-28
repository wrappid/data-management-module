const TestDatas = require("./models/TestDatas.model");
const MasterData = require("./models/MasterData.model")
const modelsRegistry = {
    "TestDatas": {
        database: "application",
        model   : TestDatas
    },
    "MasterData": {
        database: "application",
        model   : MasterData
    }
};

exports.modelsRegistry = modelsRegistry;