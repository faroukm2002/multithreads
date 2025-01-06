import { AppError } from "../../utils/AppError";
import { catchError } from "../../utils/catchError";
import { Model } from "mongoose"; // Import Model type from Mongoose

export const deleteOne =<T>(model: Model<T>, name: string) => {
  return catchError(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id); // Find and delete the document

    // If document not found, trigger error
    if (!document) {
      return next(new AppError(`${name} not found`, 404));
    }

    // Response structure
    const response: Record<string, T | null> = {};
    response[name] = document;

    // Send success response
    res.status(201).json({ message: "success", response });
  });
};




    // if(!category){

//   res.status(404).json({message:"category not found",})

// }
//   else{
//     // created
//     res.status(201).json({message:"success",category})
    
//     }

