import * as hospialFunction from "../functions/medIndiaHospital.function";

const hospitalFunc = async(req:any,res:any)=>{
  const data : any = await hospialFunction.scrapeData();
  return res.status(200).json({message: "Data fetch succesfully", data});
};

export {
  hospitalFunc
};