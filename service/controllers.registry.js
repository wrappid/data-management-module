const dataManagementController = require("./controllers/dataManagement.controller")
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");
const {getMasterData} = require("./validations/dataManagement.validation")

const controllersRegistry = {
    "masterData": [CoreMiddlewaresRegistry.validation(getMasterData) ,dataManagementController.masterData]
};

exports.controllersRegistry = controllersRegistry;