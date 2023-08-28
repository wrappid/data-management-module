const {
  coreConstant,
  configProvider,
  databaseActions,
  databaseProvider,
} = require("@wrappid/service-core");

async function masterDataProcessing(data, level, model, status) {
  if (level === 0 || data.length === 0) {
    return [];
  }

  var currentLevelData = data;

  var finalData = [];
  for (var i = 0; i < currentLevelData.length; i++) {
    let whereOb = {
      parentId: currentLevelData[i].id,
    };
    if (status) {
      whereOb["_status"] = status;
    }

    var nextLevelData = await databaseActions.findAll("application", model, {
      where: whereOb,
      order: [["order", "asc"]],
    });

    currentLevelData[i].dataValues["Children"] = await masterDataProcessing(
      nextLevelData,
      level - 1,
      model
    );

    finalData.push(currentLevelData[i]);
  }

  return finalData;
}

const getMasterDataUtil = async (req, res) => {
  try {
    var level = req.query.level || 10;
    let whereOb = {
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


module.exports = { getMasterDataUtil };
