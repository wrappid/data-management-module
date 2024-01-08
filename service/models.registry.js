const Complaints = require("./models/Complaints.model");
const MedicineCompanies = require("./models/MedicineCompanies.model");
const MedicineDetails = require("./models/MedicineDetails.model");
const MedicinePackages = require("./models/MedicinePackages.model");
const Medicines = require("./models/Medicines.model");
const ChemicalCompositions = require("./models/ChemicalCompositions.model");
const CompositionDepartments = require("./models/CompositionDepartments.model");
const Formulations = require("./models/Formulations.model");
const Departments = require("./models/Departments.model");
const Diagnoses = require("./models/Diagnoses.model");
const Procedures = require("./models/Procedures.model");
const Tests = require("./models/Tests.model");
const Applications = require("./models/Applications.model");
const DataTableOptions = require("./models/DataTableOptions.model");
const MasterData = require("./models/MasterData.model");
const Reffers = require("./models/Reffers.model");
const SupportedLanguages = require("./models/SupportedLanguages.model");
const modelsRegistry = {
    
    
"Complaints":{
    database: "application",
    model: Complaints
},
"MedicineCompanies":{
    database: "application",
    model: MedicineCompanies
},
"MedicineDetails":{
    database: "application",
    model: MedicineDetails
},
"MedicinePackages":{
    database: "application",
    model: MedicinePackages
},
"Medicines":{
    database: "application",
    model: Medicines
},
"ChemicalCompositions":{
    database: "application",
    model: ChemicalCompositions
},
"CompositionDepartments":{
    database: "application",
    model: CompositionDepartments
},
"Formulations":{
    database: "application",
    model: Formulations
},
"Departments":{
    database: "application",
    model: Departments
},
"Diagnoses":{
    database: "application",
    model: Diagnoses
},
"Procedures":{
    database: "application",
    model: Procedures
},
"Tests":{
    database: "application",
    model: Tests
},
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
"Reffers":{
    database: "application",
    model: Reffers
},
"SupportedLanguages":{
    database: "application",
    model: SupportedLanguages
},
};

exports.modelsRegistry = modelsRegistry;