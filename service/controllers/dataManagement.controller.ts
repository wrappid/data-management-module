import {Request, Response} from "express";

import { getMasterDataUtil, postUpdateStringValueFunc, postDeleteStringValuesFunc } from "../functions/dataManagement.functions";
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

export const masterData = async (req: Request, res: Response) => {
  try{
    const data = await getMasterDataUtil(req);
    const { status, ...restData } = data;
    res.status(status).json(restData);
  }catch(error:any){
    console.error("Error:: ", error);
    res.status(500).json({ message: error.message });
  }         
                  
};


export const postUpdateStringValue = async (req: Request, res: Response) => {
  try{ 
    const result = await postUpdateStringValueFunc(req);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(error:any){
    console.log(error);
    res.status(500).json({message: error});
  }
};

export const postDeleteStringValues = async (req: Request, res: Response) => {
  try{
    const result:any = postDeleteStringValuesFunc(req);
    const {status, ...resdata} = result;
    res.status(status).json({...resdata});
  }catch(error:any){
    console.log(error);
    res.status(500).json({message: error});
  }
};

