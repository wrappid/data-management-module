const {
  coreConstant,
  configProvider,
  databaseActions,
  databaseProvider,
} = require("@wrappid/service-core");

const {
  getFormSchema,
  updateStringValue,
  createStringValue,
  getRequiredDB
} = require("./datamanagement.helper");

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

const postDataFunc = async (req, res) => {
  try {
    let model = req.params.model;
    console.log("model=" + model);
    if (!model) {
      throw new Error("Model is missing in path parameter");
    }
    if (!databaseProvider.application.models[model]) {
      throw new Error("Model[" + model + "] is not defined in database");
    }

    let body = req.body;
    console.log(body);

    // data preparation
    Object.keys(
      databaseProvider.application.models[model].rawAttributes
    ).forEach((rawAttribute) => {
      // if json save object in db
      if (
        databaseProvider.application.models[model].rawAttributes[
          rawAttribute
        ].type
          .toString()
          .startsWith("JSON") &&
        body.hasOwnProperty(rawAttribute) &&
        body[rawAttribute] !== ""
      ) {
        body[rawAttribute] = JSON.parse(body[rawAttribute]);
      }
    });

    // null if attribute value is empty
    Object.keys(body).forEach((_bodyKey) => {
      if (!body.hasOwnProperty(_bodyKey) || body[_bodyKey] === "") {
        body[_bodyKey] = null;
      }
    });

    // update model
    var result = await databaseActions.create("application", model, {
      ...body,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });

    console.log(result);

    if (result)
      return {
        status: 200,
        entity: model,
        message: model + " created successfully",
      };
    // res.status(200).json({
    //   entity: model,
    //   message: model + " created successfully",
    // });
    else throw new Error("Something went wrong");
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error to create " + model, error: error };
    // res.status(500).json({
    //   entity: model,
    //   message: "Error to create " + model,
    //   error: error,
    // });
  }
};

const postCloneFormschemaFunc = async (req, res) => {
  try {
    let formID = req.params.formID;
    if (!formID) {
      return { status: 500, message: "formID is missing api path parameter" };
      // return res.status(500).json({
      //   message: "formID is missing api path parameter",
      // });
    }

    let formSchema = await getFormSchema(formID);
    // object cloneSchema
    let cloneSchema = {
      formID: formSchema?.formID + "-" + new Date().getTime(),
      name: `Custom ${formSchema.name}`,
      authRequired: true,
      _status: coreConstant.entityStatus.DRAFT,
      schema: formSchema.schema,
      extraInfo: formSchema.extraInfo,
      entityRef: `${formSchema?.entityRef}-${new Date().getTime()}`,
    };

    if (formSchema) {
      const clonedFormSchema = await databaseActions.create(
        "application",
        "FormSchemas",
        {
          ...cloneSchema,
          createdBy: req.user.userId,
        }
      );
      return {
        status: 200,
        formID: clonedFormSchema.formID,
        data: clonedFormSchema,
      };
      // res.status(200).json({
      //   formID: clonedFormSchema.formID,
      //   data: clonedFormSchema,
      // });
    } else {
      return { status: 204 };
      // res.status(204);
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: error?.message || error,
      message: "Something went wrong",
    };
    // res.status(500).json({
    //   error: error?.message || error,
    //   message: "Something went wrong",
    // });
  }
};

const postUpdateStringValueFunc = async (req, res) => {
  try {
    var data = await updateStringValue(databaseProvider, req);
    console.log("Local data updated");
    return { status: 200, message: "Local data updateed successfully" };
    // res.status(200).json({
    //   message: "Local data updateed successfully",
    // });
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Local data update error" };
    // res.status(500).json({
    //   message: "Local data update error",
    // });
  }
};

const postDeleteStringValuesFunc = async (req, res) => {
  try {
    let data = await createStringValue(req);
    console.log("Local data added");
    return { status: 200, message: "Local data added" };
    // res.status(200).json({
    //   message: "Local data added",
    // });
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Local data add error" };
    // res.status(500).json({
    //   message: "Local data add error",
    // });
  }
};

const getModelDataFunc = async (req, res) => {
  try {
    let _data = {
      rows: Object.keys(databaseProvider.application.models)
        ?.filter((key) => {
          return key
            .toLocaleLowerCase()
            .includes(req.query._searchValue?.toLocaleLowerCase());
        })
        .map((key) => {
          return { id: key, name: getNormalCaseFromCamelCase(key) };
        }),
      totalRecords: Object.keys(databaseProvider.application.models).length,
    };
    return {status:200, message:"Models fetched successfully", data: _data};
    // res.status(200).json({
    //   message: "Models fetched successfully",
    //   data: _data,
    // });
  } catch (error) {
    console.error(error);
    return {status:500, message: "Error to fetch models"};
    // res.status(500).json({ message: "Error to fetch models" });
  }
};

const getBusinessEntityFunc = async (req, res) => {
  try {
    let database = req.params.database;
    let requestedDB = getRequiredDB(database);

    let table = req.params.table;
    let rawAttributes = requestedDB[table]?.rawAttributes || {};

    let _data = {
      entity: table,
      rows: Object.keys(rawAttributes)
        ?.filter((key) => {
          return key
            .toLocaleLowerCase()
            .includes(req.query._searchValue?.toLocaleLowerCase());
        })
        .map((key) => {
          return { id: key, name: getNormalCaseFromCamelCase(key) };
        }),
      totalRecords: Object.keys(rawAttributes).length,
    };
    return {status:200,message: "Attributes fetched successfully",data: _data, };
    // res.status(200).json({
    //   message: "Attributes fetched successfully",
    //   data: _data,
    // });
  } catch (error) {
    console.error(error);
    return {status:500, message: "Error to fetch attributes"  };
    // res.status(500).json({ message: "Error to fetch attributes" });
  }
};

function getNormalCaseFromCamelCase(camelCase){
  const result = camelCase.replace(/([A-Z])/g, " $1");
  const normalCase = result.charAt(0).toUpperCase() + result.slice(1);
  return normalCase;
};


module.exports = {
  getMasterDataUtil,
  postDataFunc,
  postCloneFormschemaFunc,
  postCloneFormschemaFunc,
  postUpdateStringValueFunc,
  postDeleteStringValuesFunc,
  getModelDataFunc,
  getBusinessEntityFunc
};
