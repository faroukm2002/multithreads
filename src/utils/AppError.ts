
export class AppError extends Error{
    public readonly statusCode: number
    
    constructor(message:string,statusCode:number){
        super(message)
            // Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode 
        // line of error 
        Error.captureStackTrace(this,this.constructor);
    }
}
