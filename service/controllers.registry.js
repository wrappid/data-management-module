const dataManagementController = require("./controllers/dataManagement.controller")
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");
const { getMasterData } = require("./validations/dataManagement.validation")

const controllersRegistry = {
    masterData: [CoreMiddlewaresRegistry.validation(getMasterData), dataManagementController.masterData],
    getModelData: dataManagementController.getModelData,



    postData: dataManagementController.postData,
    postCloneFormschema: dataManagementController.postCloneFormschema,
    postUpdateStringValue: dataManagementController.postUpdateStringValue,
    postDeleteStringValues: dataManagementController.postDeleteStringValues,
    getBusinessEntity: dataManagementController.getBusinessEntity
};

exports.controllersRegistry = controllersRegistry;