import { coreConstant, databaseActions, databaseProvider } from "@wrappid/service-core";

const updateStringValue = async (databaseProvider: any, req: any) => {
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
    async (t: any) => {
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
          updatedBy: req.user.userID,
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
          createdBy: req.user.userID,
          updatedBy: req.user.userID,
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

async function createStringValue(req: any) {
  console.log("BODY", req.body);
  // var table = req.body.table;
  await databaseActions.findOne("application", "StringValues", {});
  const whereOb = { key: req.body.key, locale: req.body.locale };

  const exists = await databaseActions.findAll("application", "StringValues", {
    attributes: ["id", "key", "locale"],
    where: whereOb,
  });

  if (exists && exists.length > 0) {
    throw "Data exists for locale";
  }

  await databaseActions.create("application", "StringValues", {
    ...req.body,
    _status: "active",
    createdBy: req.user.userID,
    updatedBy: req.user.userID,
  });
}

async function generateStringValue(req: any) {
  const table = req.body?.table;
  const rowID = req.params?.id;
  const result = await databaseProvider.application.sequelize.transaction(
    async (t: any) => {
      const data = await databaseActions.findByPk("application", table, rowID);
      if (!data) {
        console.error("Data not found in table " + table);
        throw "Data not found in table " + table;
      }

      const cols = Object.keys(data.dataValues);
      // console.log("COLS", cols);
      if (!cols.find((c) => c === "stringValue")) {
        console.error("String value column missing in table " + table);
        throw "String value column missing in table " + table;
      }

      const newKey = getLocaleKey();
      const newLabel = getLabel(data, table);

      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const [nrows, rows] = await databaseActions.update(
        "application",
        "StringValues",
        {
          stringValue: newKey,
          updatedBy: req.user.userID,
        },
        {
          where: {
            id: rowID,
          },
        },
        { transaction: t }
      );

      if (nrows < 1) {
        console.error("Update error");
        throw "Update error";
      }

      const defaultLanguage = await databaseActions.findOne("application", "SupportedLanguages",
        {
          where: {
            locale: "en_IN",
          },
        }
      );

      if (!defaultLanguage) {
        console.error("Default language does not exists");
        throw "Default language does not exists";
      }

      const newdata = await databaseActions.create(
        "application",
        "StringValues",
        {
          key: newKey,
          value: newLabel,
          locale: defaultLanguage.id,
          _status: coreConstant.entityStatus.ACTIVE,
          createdBy: req.user.userID
        },
        {
          transaction: t,
        }
      );
      return newdata;
    });
  return result;
}

function getLocaleKey() {
  return Date.now();
}

function getLabel(data: {label?: string}, table: string) {
  if (table === "MasterData" && data?.label) {
    return data.label;
  }

  return null;
}

export { createStringValue, generateStringValue, updateStringValue };

