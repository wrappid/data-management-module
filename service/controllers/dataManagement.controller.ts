import {Request, Response} from "express";

import { getMasterDataUtil, getModelDataFunc, postDataFunc, postCloneFormschemaFunc, postUpdateStringValueFunc, postDeleteStringValuesFunc, getBusinessEntityFunc } from "../functions/dataManagement.functions";
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

export const masterData = async (req: Request, res: Response) => {
  try{
    const data = await getMasterDataUtil(req,res);
    const { status, ...restData } = data;
    res.status(status).json(restData);
  }catch(error){
    console.error("Error:: ", error);
    res.status(500).json({ message: error.message });
  }         
                  
};


export const getModelData = async (req: Request, res: Response) => {
  try {
    const result = await getModelDataFunc(req, res);
    const {status, ...resData} = result;
    res.status(status).json({...resData}); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};


export const postData = async (req: Request, res: Response) => {
  try{
    const result = await postDataFunc(req, res);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    res.status(500).json({message: err});
  }
};

export const postCloneFormschema = async (req: Request, res: Response) => {
  try{ 
    const result = await postCloneFormschemaFunc(req, res);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};

export const postUpdateStringValue = async (req: Request, res: Response) => {
  try{ 
    const result = await postUpdateStringValueFunc(req, res);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};

export const postDeleteStringValues = async (req: Request, res: Response) => {
  try{
    const result:any = postDeleteStringValuesFunc(req, res);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }
};

export const getBusinessEntity = async (req: Request, res: Response) => {
  try{
    const result = await getBusinessEntityFunc(req, res);
    const {status, ...resData} = result;
    res.status(status).json({...resData});
  }catch(err){
    console.log(err);
    res.status(500).json({message: err});
  }  
};