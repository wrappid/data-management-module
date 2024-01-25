const {getMasterDataUtil, getModelDataFunc, postDataFunc, postCloneFormschemaFunc, postUpdateStringValueFunc, postDeleteStringValuesFunc, getBusinessEntityFunc} = require("../functions/dataManagement.functions");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

module.exports.masterData = async (req,res) => {
  try{
    let data = await getMasterDataUtil(req,res);
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
    let result = await getModelDataFunc(req, res);
    let {status, ...resData} = result;
    res.status(status).json({...resData}); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
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

module.exports.getBusinessEntity = async (req, res) => {
  try{
  // res.status(200).json({message: "API call Succesfully!!"});
    let result = await getBusinessEntityFunc(req, res);
    let {status, ...resData} = result;
    res.status(status).json({...resData});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }  
};