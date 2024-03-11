import { coreConstant, databaseProvider, databaseActions } from "@wrappid/service-core";

const { httpMethod, entityStatus } = coreConstant;


const getFormSchema = async (formID, auth = true) => {
  try {
    let formSchema = await getFormSchemaFromDB(formID, auth);
    if (!formSchema && auth) {
      formSchema = generateFormSchema(formID);
    }
    return formSchema;
  } catch (error) {
    console.error("----------------------------------------");
    console.error("formSchema.helper>getFormSchema");
    console.error(error);
    console.error("----------------------------------------");
    throw error;
  }
};


async function generateFormSchema(modelName) {
  try {
    /**
    * @todo check if present in business entity
    */
  
    const schema = await getEntitySchema(modelName);
    let fieldsData = [];
    if (schema && schema?.model) {
      const entityDB = "application" || schema?.database;
      fieldsData = getColumnsFromSchema(entityDB, schema)?.filter((col) => {
        return !auditAttributes.includes(col.id);
      });
      fieldsData?.forEach((fieldData:any) => {
        fieldData.type = getFieldType(fieldData.type);
      });
    }
  
    const endpoint = "/data/" + modelName;
    const formSchema = {
      create: {
        endpoint: endpoint,
        method: httpMethod.HTTP_POST,
        authRequired: true,
        successType: [
          "CREATE_" + modelName.toLocaleUpperCase() + "_SUCCESS",
          "CREATE_DATA_SUCCESS",
        ],
        errorType: [
          "CREATE_" + modelName.toLocaleUpperCase() + "_ERROR",
          "CREATE_DATA_ERROR",
        ],
        // reload: true,
      },
      // read: {
      //   endpoint: endpoint,
      //   method: httpMethod.HTTP_GET,
      //   authRequired: true,
      //   successType: "READ_" + modelName.toLocaleUpperCase() + "_SUCCESS",
      //   errorType: "READ_" + modelName.toLocaleUpperCase() + "_ERROR",
      //   onSubmitRefine: "San_URL_ADD_PATH_PARAM_ID",
      // },
      edit: {
        endpoint: endpoint,
        method: httpMethod.HTTP_PUT,
        authRequired: true,
        successType: [
          "UPDATE_" + modelName.toLocaleUpperCase() + "_SUCCESS",
          "UPDATE_DATA_SUCCESS",
        ],
        errorType: [
          "UPDATE_" + modelName.toLocaleUpperCase() + "_ERROR",
          "UPDATE_DATA_ERROR",
        ],
        onSubmitRefine: "San_URL_ADD_PATH_PARAM_ID",
      },
      delete: {
        endpoint: endpoint,
        method: httpMethod.HTTP_PATCH,
        authRequired: true,
        successType: [
          "DELETE_" + modelName.toLocaleUpperCase() + "_SUCCESS",
          "DELETE_DATA_SUCCESS",
        ],
        errorType: [
          "DELETE_" + modelName.toLocaleUpperCase() + "_ERROR",
          "DELETE_DATA_ERROR",
        ],
        onSubmitRefine: "San_URL_ADD_PATH_PARAM_ID",
      },
      fields: fieldsData,
      actions: [],
    };
    return { formID: modelName, schema: formSchema };
  } catch (error) {
    console.error("----------------------------------------");
    console.error("formSchema.helper>generateFormSchemaFromTableAttributes");
    console.error(error);
    console.error("----------------------------------------");
    throw error;
  }
}
  
/**
   *
   * @param {*} dbName
   * @param {*} formID
   */
async function getFormSchemaFromDB(formID, auth) {
  try {
    const dbName = "application";
    const dbSequelize = databaseProvider[dbName].Sequelize;
    const whereClause = {
      formID: formID,
      _status: entityStatus.PUBLISHED,
    };
    if (auth) {
      whereClause["authRequired"] = true;
    } else {
      whereClause["authRequired"] = {
        [dbSequelize.Op.or]: {
          [dbSequelize.Op.eq]: false,
          [dbSequelize.Op.is]: null,
        },
      };
    }
  
    const formSchema = await databaseActions.findOne(dbName, "FormSchemas", {
      where: whereClause,
    });
    return formSchema;
  } catch (error) {
    console.error("----------------------------------------");
    console.error("formSchema.helper>getFormSchema");
    console.error(error);
    console.error("----------------------------------------");
    throw error;
  }
}


const updateStringValue = async (databaseProvider, req) => {
  // var table = req.body.table;
  // var whereOb = {};
  // switch (table) {
  //   case "MasterData":
  //     whereOb = id ? { id } : { key: req.body.key, locale: req.body.locale };
  //     break;
  //   default:
  //     break;
  // }
  
  const result = await databaseProvider.application.sequelize.transaction(
    async (t:any) => {
      const stringValue = await databaseActions.findOne(
        "application",
        "StringValues",
        {
          where: {
            id: req.params.id,
          },
        },
        /**
         * @todo
         * Need to fix service-core findOne
         */
        // { transaction: t }
      );
      await databaseActions.update(
        "application",
        "StringValues",
        {
          _status: "inactive",
          updatedBy: req.user.userId,
        },
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction: t }
      );
      console.log("Old data deactivated");
  
      const freshData = {
        // key: req.body.key,
        key: stringValue.key,
        value: req.body.value,
        locale: req.body.locale,
      };
      console.log("BODY", freshData);
  
      const data = await databaseActions.create(
        "application",
        "StringValues",
        {
          ...freshData,
          _status: "active",
          createdBy: req.user.userId,
          updatedBy: req.user.userId,
        },
        {
          transaction: t,
        }
      );
      console.log("New Data created");
      return data.id;
    }
  );
  console.log("Transaction commited");
  return result;
};
  

async function createStringValue(req) {
  console.log("BODY", req.body);
  // var table = req.body.table;
  await databaseActions.findOne("application","StringValues", {});
  const whereOb = { key: req.body.key, locale: req.body.locale };
  
  const exists = await databaseActions.findAll("application","StringValues",{
    attributes: ["id", "key", "locale"],
    where: whereOb,
  });
  
  if (exists && exists.length > 0) {
    throw "Data exists for locale";
  }
  
  await databaseActions.create("application","StringValues",{
    ...req.body,
    _status: "active",
    createdBy: req.user.userId,
    updatedBy: req.user.userId,
  });
}
 
const getRequiredDB = (selectedDB) => {
  switch (selectedDB) {
    case config.DB_CONST.RXEFY_MEDICINE_DB:
      return medicineDB;
    case config.DB_CONST.RXEFY_DB:
    default:
      return databaseProvider.application;
  }
};

const config = {
  DB_CONST: {
    RXEFY_DB: "RXEFY_DB",
    RXEFY_MEDICINE_DB: "RXEFY_MEDICINE_DB",
  },
};
  
  
export default {getFormSchema, updateStringValue, createStringValue, getRequiredDB};