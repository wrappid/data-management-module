// asyncSelect and formSubmitSanitization

import { masterData } from "./functions/asyncSelect.functions";
import { San_URL_ADD_PATH_PARAM_ID, SanChemDeptMap, SanChemDeptReadMap } from "./functions/sanity.functions";

export const FunctionsRegistry = {
  DefaultLangEditDel: () => {},

  SanChemDeptMap: SanChemDeptMap,
    
  SanChemDeptReadMap: SanChemDeptReadMap,
  masterData: masterData,
  
  San_URL_ADD_PATH_PARAM_ID: San_URL_ADD_PATH_PARAM_ID
    
};

