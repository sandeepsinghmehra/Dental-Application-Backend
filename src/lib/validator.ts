import { body, param, query, validationResult } from "express-validator";
import ErrorHandler from "../utils/utility";


const validateHandler = (req:any, res:any, next:any) => {
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg).join(", ");
    // console.log("errors", errors, errorMessages);
    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages, 400));
}
const loginValidator = () => [
    body("mobile_number", "Please Enter Mobile Number").notEmpty(),
    body("countryCode", "Please Enter Country Code").notEmpty(),
    body("role", "Please Enter Password").notEmpty(),
];

const verifyOTPValidator = () => [
    body("mobile_number", "Please Enter Mobile Number").notEmpty(),
    body("countryCode", "Please Enter Country Code").notEmpty(),
    body("otp", "Please Enter OTP").notEmpty(),
];

export {  
    validateHandler, 
    loginValidator,
    verifyOTPValidator, 
};