import MasterData from "./components/MasterData";
import MedicalTestData from "./components/MedicalTestData";
import MedicineDatabase from "./components/MedicineDatabase";
import MedicineTestData from "./components/MedicineTestData";
import LanguageDataManager from "./components/LanguageDataManager";
import LanguageEditorForm from "./components/LanguageEditorForm";
import SupportedLanguages from "./components/SupportedLanguages";
import InuseDiseases from "./components/InuseDiseases";
import InuseMedicalTestData from "./components/InuseMedicalTestData";
import InuseMedicines from "./components/InuseMedicines";
import ScrapedDiseases from "./components/ScrapedDiseases";
import ScrapedMedicalTestData from "./components/ScrapedMedicalTestData";
import ScrapedMedicines from "./components/ScrapedMedicines";
import CrowdsourcedDiseases from "./components/CrowdsourcedDiseases";
import CrowdsourcedMedicalTestData from "./components/CrowdsourcedMedicalTestData";
import CrowdsourcedMedicines from "./components/CrowdsourcedMedicines";
import CrowdsourcedData from "./components/CrowdsourcedData";
import Departments from "./components/Departments";
import BaseChemicals from "./components/BaseChemicals";

export const ComponentRegistry = {
    MasterData: {
        comp: MasterData,
    },
    MedicalTestData: {
        comp: MedicalTestData,
    },
    MedicineDatabase: {
        comp: MedicineDatabase,
    },
    MedicineTestData: {
        comp: MedicineTestData,
    },
    LanguageDataManager: {
        comp: LanguageDataManager,
    },
    LanguageEditorForm: {
        comp: LanguageEditorForm,
    },
    SupportedLanguages: {
        comp: SupportedLanguages,
    },
    InuseDiseases: {
        comp: InuseDiseases,
    },
    InuseMedicalTestData: {
        comp: InuseMedicalTestData,
    },
    InuseMedicines: {
        comp: InuseMedicines,
    },
    ScrapedDiseases: {
        comp: ScrapedDiseases,
    },
    ScrapedMedicalTestData: {
        comp: ScrapedMedicalTestData,
    },
    ScrapedMedicines: {
        comp: ScrapedMedicines,
    },
    CrowdsourcedDiseases: {
        comp: CrowdsourcedDiseases,
    },
    CrowdsourcedMedicalTestData: {
        comp: CrowdsourcedMedicalTestData,
    },
    CrowdsourcedMedicines: {
        comp: CrowdsourcedMedicines,
    },
    CrowdsourcedData: {
        comp: CrowdsourcedData,
    },
    Departments: {
        comp: Departments,
    },
    BaseChemicals: {
        comp: BaseChemicals,
    }
}