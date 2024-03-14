import { CoreMiddlewaresRegistry } from "@wrappid/service-core";

import * as dataManagementController from "./controllers/dataManagement.controller";
import { getMasterData } from "./validations/dataManagement.validation";

const controllersRegistry = {
  masterData: [CoreMiddlewaresRegistry.validation(getMasterData), dataManagementController.masterData],
  postUpdateStringValue: dataManagementController.postUpdateStringValue,
  postDeleteStringValues: dataManagementController.postDeleteStringValues,
  

  // postCloneFormschema: dataManagementController.postCloneFormschema,
  // getModelData: dataManagementController.getModelData,
  // postData: dataManagementController.postData,
  // getBusinessEntity: dataManagementController.getBusinessEntity
};
export default controllersRegistry;
