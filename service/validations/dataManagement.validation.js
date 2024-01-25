const yup = require("yup");

const getMasterData = {
  query: yup
    .object({
      level: yup.string().notRequired(),
      name: yup.string().notRequired(),
      _status: yup.string().notRequired(),
      parentId: yup.string().notRequired(),
    })
    .noUnknown()
    .strict(),
};



module.exports = { getMasterData };