const testValidations = require("./validations/test.validation");
const dataManagementValidations = require("./validations/dataManagement.validation")
const validationsRegistry = {
    ...testValidations,
    ...dataManagementValidations
};

exports.validationsRegistry = validationsRegistry;