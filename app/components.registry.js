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
import LanguageEditorForm from "./components/LanguageEditorForm";
import MasterData from "./components/MasterData";
import MedicalTestData from "./components/MedicalTestData";
import MedicineDatabase from "./components/MedicineDatabase";
import MedicineTestData from "./components/MedicineTestData";
import ScrapedDiseases from "./components/ScrapedDiseases";
import ScrapedMedicalTestData from "./components/ScrapedMedicalTestData";
import ScrapedMedicines from "./components/ScrapedMedicines";
import SupportedLanguages from "./components/SupportedLanguages";

export const ComponentRegistry = {
  BaseChemicals              : { comp: BaseChemicals },
  CrowdsourcedData           : { comp: CrowdsourcedData },
  CrowdsourcedDiseases       : { comp: CrowdsourcedDiseases },
  CrowdsourcedMedicalTestData: { comp: CrowdsourcedMedicalTestData },
  CrowdsourcedMedicines      : { comp: CrowdsourcedMedicines },
  Departments                : { comp: Departments },
  InuseDiseases              : { comp: InuseDiseases },
  InuseMedicalTestData       : { comp: InuseMedicalTestData },
  InuseMedicines             : { comp: InuseMedicines },
  LanguageDataManager        : { comp: LanguageDataManager },
  LanguageEditorForm         : { comp: LanguageEditorForm },
  MasterData                 : { comp: MasterData },
  MedicalTestData            : { comp: MedicalTestData },
  MedicineDatabase           : { comp: MedicineDatabase },
  MedicineTestData           : { comp: MedicineTestData },
  ScrapedDiseases            : { comp: ScrapedDiseases },
  ScrapedMedicalTestData     : { comp: ScrapedMedicalTestData },
  ScrapedMedicines           : { comp: ScrapedMedicines },
  SupportedLanguages         : { comp: SupportedLanguages }
};