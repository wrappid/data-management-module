const dataManagementController = require("./controllers/dataManagement.controller")
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");
const { getMasterData, getModelData } = require("./validations/dataManagement.validation")

const controllersRegistry = {
    masterData: [CoreMiddlewaresRegistry.validation(getMasterData), dataManagementController.masterData],
    getModelData: [CoreMiddlewaresRegistry.validation(getModelData), dataManagementController.getModelData],



    postData: dataManagementController.postData,
    postCloneFormschema: dataManagementController.postCloneFormschema,
    postUpdateStringValue: dataManagementController.postUpdateStringValue,
    postDeleteStringValues: dataManagementController.postDeleteStringValues
};

exports.controllersRegistry = controllersRegistry;