import { CoreMiddlewaresRegistry } from "@wrappid/service-core";


const ControllersRegistry = {
  masterData: [CoreMiddlewaresRegistry.validation(getMasterData), dataManagementController.masterData],
  getModelData: dataManagementController.getModelData,



  postData: dataManagementController.postData,
  postCloneFormschema: dataManagementController.postCloneFormschema,
  postUpdateStringValue: dataManagementController.postUpdateStringValue,
  postDeleteStringValues: dataManagementController.postDeleteStringValues,
  getBusinessEntity: dataManagementController.getBusinessEntity
};
export default ControllersRegistry;
