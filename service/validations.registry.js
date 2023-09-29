const dataManagementValidations = require("./validations/dataManagement.validation")
const validationsRegistry = {
    ...dataManagementValidations
};

exports.validationsRegistry = validationsRegistry;