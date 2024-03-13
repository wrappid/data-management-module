import { databaseActions, databaseProvider } from "@wrappid/service-core";

import { updateStringValue, createStringValue } from "./datamanagement.helper";

async function masterDataProcessing(data:any, level:any, model:any, status:any) {
  if (level === 0 || data.length === 0) {
    return [];
  }

  const currentLevelData = data;

  const finalData:any = [];
  for (let i = 0; i < currentLevelData.length; i++) {
    const whereOb:any = {
      parentId: currentLevelData[i].id,
    };
    if (status) {
      whereOb["_status"] = status;
    }

    const nextLevelData = await databaseActions.findAll("application", model, {
      where: whereOb,
      order: [["order", "asc"]],
    });

    currentLevelData[i].dataValues["Children"] = await masterDataProcessing(
      nextLevelData,
      level - 1,
      model, status
    );

    finalData.push(currentLevelData[i]);
  }

  return finalData;
}

const getMasterDataUtil = async (req:any) => {
  try {
    const level = req.query.level || 10;
    const whereOb:any = {
      name: req.query.name,
    };
    if (req.query._status) {
      whereOb["_status"] = req.query._status;
    }
    if (req.query.parentId) {
      whereOb["parentId"] = req.query.parentId;
    }
    let data = await databaseActions.findAll("application", "MasterData", {
      where: whereOb,
    });
    if (data.length == 1) {
      console.log("master data fetched successfully", data.length);
      if (level > 0) {
        data = await masterDataProcessing(
          data,
          level,
          "MasterData",
          whereOb._status
        );
      }
      return {
        status: 200,
        message: "Master data fetched successfully",
        data: data,
      };
    } else {
      return { status: 500, message: "master data not found", data: data };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const postUpdateStringValueFunc = async (req: any) => {
  try {
    await updateStringValue(databaseProvider, req);
    console.log("Local data updated");
    return { status: 200, message: "Local data updateed successfully" };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Local data update error" };
  }
};

// eslint-disable-next-line no-unused-vars
const postDeleteStringValuesFunc = async (req: any) => {
  try {
    await createStringValue(req);
    console.log("Local data added");
    return { status: 200, message: "Local data added" };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Local data add error" };
  }
};



export {
  getMasterDataUtil,
  postUpdateStringValueFunc,
  postDeleteStringValuesFunc,
};
