import { databaseActions } from "@wrappid/service-core";




const updateStringValue = async (databaseProvider:any, req:any) => {
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
  

async function createStringValue(req:any) {
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
 

  
  
export {updateStringValue, createStringValue};