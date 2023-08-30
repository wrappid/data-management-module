const dataManagementController = require("./controllers/dataManagement.controller")
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");
const { getMasterData, getModelData } = require("./validations/dataManagement.validation")

const controllersRegistry = {
    masterData: [CoreMiddlewaresRegistry.validation(getMasterData), dataManagementController.masterData],
    getModelData: [CoreMiddlewaresRegistry.validation(getModelData), dataManagementController.getModelData]
};

exports.controllersRegistry = controllersRegistry;