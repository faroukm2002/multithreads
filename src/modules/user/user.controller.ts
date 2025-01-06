import { catchError } from "../../utils/catchError";
import { AppError } from "../../utils/AppError";
import { userModel } from "../../../database/models/user.model";
import { NextFunction, Request, Response } from "express";
import { deleteOne } from "../handlers/refactor";
import { ApiFeatures } from "../../utils/Apifeatures";





// const addUser= catchError(async(req:Request,res:Response,next:NextFunction)=>{
//   let users=await userModel.findOne({email:req.body.email})
//   if(users) return next(new AppError("duplicate email",409))
// const User= new userModel(req.body)
// await User.save()
// // created
// res.status(201).json({message:"success",User})

// })



 
const getAllUser= catchError(async(req:Request,res:Response,next:NextFunction)=>{
  let apifeatures= new ApiFeatures( userModel.find(),req.query)
  .pagination().filter().fields().search().sort()
  
    const users = await apifeatures.mongooseQuery
    res.status(201).json({ message: 'success', page:apifeatures.page, users });
  
  })


  const getUserByID= catchError(async(req:Request,res:Response,next:NextFunction)=>{
    const user= await userModel.findById(req.params.id)
    res.status(201).json({message:"success",user})
     
    })
 

const updateUser= catchError(async(req:Request,res:Response,next:NextFunction)=>{
  const{id}=req.params
   const User= await userModel.findByIdAndUpdate(
    id,
    req.body,
    {new:true})
  // created

  // !User && res.status(404).json({message:"User not found",}) 
  !User && next(new AppError('User not found',404))

  User &&   res.status(201).json({message:"success",User})


  }  )
  




    
  

  const deleteUser= deleteOne(userModel,'User')

 
export { 
  // addUser,  
  getAllUser,
  getUserByID,
  updateUser,
  deleteUser,



 }
