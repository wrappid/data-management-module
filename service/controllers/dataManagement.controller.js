const {dataManagementFunctions,postDataFunc, postCloneFormschemaFunc, postUpdateStringValueFunc, postDeleteStringValuesFunc} = require("../functions/dataManagement.functions")
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

module.exports.masterData = async (req,res) => {
  try{
    let data = await dataManagementFunctions.getMasterDataUtil(req,res);
    // console.log("API Call sucessfully");
    let { status, ...restData } = data;
    res.status(status).json(restData);
  }catch(error){
    console.error("Error:: ", error);
    res.status(500).json({ message: error.message });
  }         
                  
};


module.exports.getModelData = async (req,res) => {
  try {
    // let model = req.params.model;
    // console.log("model=" + model);

    // var baseQuery = {};
    // if (req.query.search) {
    //   baseQuery["search"] = req.query.search;
    // }
    // let columns = db[model]?.rawAttributes || [];
    // let fieldsData = Object.keys(columns).filter((col) => {
    //   return ![
    //     "id",
    //     "createdAt",
    //     "createdBy",
    //     "updatedAt",
    //     "updatedBy",
    //   ].includes(col);
    // });
    // fieldsData.forEach((field) => {
    //   if (req.query[field]) {
    //     switch (columns[field].type.toString()) {
    //       case "INTEGER":
    //         baseQuery[field] = req.query[field];
    //         return;
    //       default:
    //         baseQuery[field] = {
    //           [sequelize.Op.like]: `%${req.query[field]}%`,
    //         };
    //         return;
    //     }
    //   }
    // });

    // var pageQuery = {};
    // pageQuery["start"] = req.query.start;
    // pageQuery["length"] = req.query.length;
    // // below parameters not considered now
    // // pageQuery["page"] = req.query.page;
    // // pageQuery["maxRowInPage"] = req.query.maxRowInPage;
    // // pageQuery["pagesToCache"] = req.query.maxRowInPage;
    // // pageQuery["orderBy"] = req.query.orderBy;
    // // pageQuery["order"] = req.query.order;

    // // Get Data From Model
    // // let _data = await db[model].findAll();
    // console.log("___________________________________");
    // //   console.log("data=" + Object.keys(_data[0].dataValues));
    // console.log(Object.keys(db[model].rawAttributes));
    // console.log("___________________________________");

    // paginate(db[model], [], baseQuery, pageQuery)
    //   .then((_data) => {
    //     res.status(200).json({
    //       message: "Data fetched successfully",
    //       data: _data,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).json({ message: "Error to fetch data from model" });
    //   });
    throw new Error("API unavailable!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to fetch data from model" });
  }
};


module.exports.postData = async (req,res) => {
  try{
    // res.status(200).json({message: "API call succesfully!!"});
    let result = await postDataFunc(req, res);
    let {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    res.status(500).json({message: err});
  }
};

module.exports.postCloneFormschema = async (req, res) => {
  try{ 
    // res.status(200).json({message: "API call succesfully!!"});
    let result = await postCloneFormschemaFunc(req, res);
    let {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};

module.exports.postUpdateStringValue = async (req, res) => {
  try{ 
    // res.status(200).json({message: "API call succesfully!!"});
    let result = await postUpdateStringValueFunc(req, res);
    let {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};

module.exports.postDeleteStringValues = async (req, res) => {
  try{
    // res.status(200).json({ message: "API call sucessfully!!"});
    let result = postDeleteStringValuesFunc(req, res);
    let {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};