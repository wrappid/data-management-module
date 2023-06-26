import BaseChemicals from "./components/BaseChemicals";
import CrowdsourcedData from "./components/CrowdsourcedData";
import CrowdsourcedDiseases from "./components/CrowdsourcedDiseases";
import CrowdsourcedMedicalTestData from "./components/CrowdsourcedMedicalTestData";
import CrowdsourcedMedicines from "./components/CrowdsourcedMedicines";
import Departments from "./components/Departments";
import InuseDiseases from "./components/InuseDiseases";
import InuseMedicalTestData from "./components/InuseMedicalTestData";
import InuseMedicines from "./components/InuseMedicines";
import LanguageDataManager from "./components/LanguageDataManager";
import MasterData from "./components/MasterData";
import MedicalTestData from "./components/MedicalTestData";
import MedicineDatabase from "./components/MedicineDatabase";
import MedicineTestData from "./components/MedicineTestData";
import LanguageEditorForm from "./components/LanguageEditorForm";
import SupportedLanguages from "./components/SupportedLanguages";
import ScrapedDiseases from "./components/ScrapedDiseases";
import ScrapedMedicalTestData from "./components/ScrapedMedicalTestData";
import ScrapedMedicines from "./components/ScrapedMedicines";

export const ComponentRegistry = {
  InuseDiseases              : { comp: InuseDiseases},
  InuseMedicalTestData: { comp: InuseMedicalTestData},
  LanguageDataManager : { comp: LanguageDataManager },
  InuseMedicines      : { comp: InuseMedicines },
  LanguageEditorForm  : { comp: LanguageEditorForm},
  CrowdsourcedDiseases: {comp: CrowdsourcedDiseases,},
  MasterData         : { comp: MasterData },
  CrowdsourcedMedicalTestData: { comp: CrowdsourcedMedicalTestData},
  MedicalTestData    : { comp: MedicalTestData},
  BaseChemicals              : {
        comp: BaseChemicals,
    },
  MedicineDatabase: {comp: MedicineDatabase,},
  CrowdsourcedData  : { comp: CrowdsourcedData},
  MedicineTestData: {
        comp: MedicineTestData,
    },
  CrowdsourcedMedicines: { comp: CrowdsourcedMedicines },
  Departments          : { comp: Departments },
  SupportedLanguages: {
        comp: SupportedLanguages,
    },
  ScrapedDiseases       : { comp: ScrapedDiseases },
  ScrapedMedicalTestData: { comp: ScrapedMedicalTestData },
  ScrapedMedicines      : { comp: ScrapedMedicines }
};