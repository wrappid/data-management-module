/* eslint-disable no-unused-vars */
/* eslint-disable id-length */

function nLevelGroup(data, parentId) {
  let finalData = data
    .filter((d) => d.parentId == parentId)
    .map((h) => {
      return {
        ...h,
        __children: nLevelGroup(data, h.id),
      };
    });
      
  return finalData;
}
      
function nLevelFlat(data, finalData) {
  for (let i = 0; i < data.length; i++) {
    let ob = { ...data[i] };
    
    delete ob.__children;
    finalData.push(ob);
    finalData = nLevelFlat(data[i].__children, finalData);
  }
  return finalData;
}

export const SanChemDeptMap = (formData, apiMeta, state, others) => {
  // -- console.log("SANITING", apiMeta.endpoint, others);
  return {
    endpoint: apiMeta.endpoint.replace(":id", state?.mdm?.baseChemical?.id),
    values  : nLevelFlat(formData, { chemDeptMap: nLevelFlat(formData.chemDeptMap, []) }),
  };
};

export const SanChemDeptReadMap = (data) => {
  // -- console.log("SANITING", apiMeta, others);
  let temp = data?.rows?.map((m) => {
    return {
      groupHead: m.parentId === null ? true : false,
      hasEntry:
            m?.ChemicalDepartments && m?.ChemicalDepartments?.length > 0
              ? true
              : false,
      id      : m?.id,
      name    : m?.name,
      parentId: m?.parentId,
      priority:
            m?.ChemicalDepartments && m?.ChemicalDepartments?.length > 0
              ? m?.ChemicalDepartments[0]?.priority
              : 1,
    };
  });
    
  return { chemDeptMap: nLevelGroup(temp, null) };
};