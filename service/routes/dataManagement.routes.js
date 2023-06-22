const express = require("express");

const dataManagementController = require("../controllers/dataManagement.controller");

// const testMiddleware = require("../middlewares/test.middleware");

const dataManagementRouter = express.Router();

dataManagementRouter.get("/role", dataManagementController.getRole);
dataManagementRouter.get("/department", dataManagementController.getDepartment);
dataManagementRouter.get("/relations", dataManagementController.getRelations);
dataManagementRouter.get("/addressType", dataManagementController.getAddressType);
dataManagementRouter.post("/deleteUserAccount", dataManagementController.deleteUserAccount);
dataManagementRouter.get("/prescriptionPdf/:id", dataManagementController.getPrescriptionPdf);
dataManagementRouter.post("/addLocale", dataManagementController.addLocalData);
dataManagementRouter.post("/stringValue/:id/update", dataManagementController.updateLocalData);
dataManagementRouter.post("/tableData/:id/generateLocale", dataManagementController.generateStringValue);
dataManagementRouter.post("/generateLocaleAll", dataManagementController.generateALLStringVAlue);

dataManagementRouter.get("/masterData", dataManagementController.getMasterData);
dataManagementRouter.post("/initialMasterData", dataManagementController.createMasterData);
dataManagementRouter.post("/initialVitalsdata", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/masterValidation", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/addDoctorDetails", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/addTemplateDesign", dataManagementController.generateALLStringVAlue);
dataManagementRouter.get("/prescriptionTemplateDesigns", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/rawFormUpload", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/syncDepartment", dataManagementController.generateALLStringVAlue);
dataManagementRouter.post("/chemical/:id/departments", dataManagementController.generateALLStringVAlue);


dataManagementRouter.get("/masterData", dataManagementController.getMasterData);
dataManagementRouter.post("/initialMasterData", dataManagementController.postInitialMasterData);
dataManagementRouter.post("/initialVitalsdata", dataManagementController.postinItialVitalsdata);
dataManagementRouter.post("/masterValidation", dataManagementController.postMasterValidation);
dataManagementRouter.post("/addDoctorDetails", dataManagementController.postDoctorDetails);
dataManagementRouter.post("/addTemplateDesign", dataManagementController.postTemplateDesign);
dataManagementRouter.get("/prescriptionTemplateDesigns", dataManagementController.getPrescriptionTemplateDesigns);
dataManagementRouter.post("/rawFormUpload", dataManagementController.postRawFormUpload);
dataManagementRouter.post("/syncDepartment", dataManagementController.postSyncDepartment);
dataManagementRouter.post("/chemical/:id/departments", dataManagementController.postChemicalDepartment);


dataManagementRouter.get("/medicines", dataManagementController.getMedicines);
dataManagementRouter.post("/medicineSyncer", dataManagementController.postMedicineSyncer);
dataManagementRouter.post("/departmentSyncer", dataManagementController.postDepartmentSyncer);



dataManagementRouter.get("/models", dataManagementController.getModel);
dataManagementRouter.get("/data/:model", dataManagementController.getModelData);
dataManagementRouter.get("/data/:model/:modelID", dataManagementController.getModelDataWithId);


dataManagementRouter.post("/data/:model", dataManagementController.createModel);
dataManagementRouter.put("/data/:model/:id", dataManagementController.updateModelData);
dataManagementRouter.put("/data/:model/status/:id", dataManagementController.updateModelStatus);
dataManagementRouter.patch("/data/:model/:id", dataManagementController.deleteModel);
dataManagementRouter.get("/version", dataManagementController.getVersion);

module.exports = dataManagementRouter;