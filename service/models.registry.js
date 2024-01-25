const Applications = require("./models/Applications.model");
const DataTableOptions = require("./models/DataTableOptions.model");
const MasterData = require("./models/MasterData.model");
const SupportedLanguages = require("./models/SupportedLanguages.model");
const StringValues = require("./models/StringValues.model");
const modelsRegistry = {
 
"Applications":{
    database: "application",
    model: Applications
},
"DataTableOptions":{
    database: "application",
    model: DataTableOptions
},
"MasterData":{
    database: "application",
    model: MasterData
},
"SupportedLanguages":{
    database: "application",
    model: SupportedLanguages
},
"StringValues": {
    database: "application",
    model: StringValues
}
};

exports.modelsRegistry = modelsRegistry;