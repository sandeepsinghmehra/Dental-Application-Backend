import { body, param, query, validationResult } from "express-validator";
import ErrorHandler from "../utils/utility";


const validateHandler = (req:any, res:any, next:any) => {
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg).join(", ");
    // console.log("errors", errors, errorMessages);
    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages, 400));
}
const registerValidator = () => [
    body("firstName", "Please Enter First Name").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
    body("gender", "Please Enter Gender").notEmpty(),
    body("dob", "Please Enter Dob").notEmpty(),
    body("email", "Please Enter Email").notEmpty(),
    body("mobile_number", "Please Enter Mobile Number").notEmpty(),
    body("countryCode", "Please Enter Country Code").notEmpty(),
    body("role", "Please Enter Role").notEmpty(),
    body("street1", "Please Enter Street1").notEmpty(),
    body("city", "Please Enter City").notEmpty(),
    body("state", "Please Enter State").notEmpty(),
    body("country", "Please Enter Country").notEmpty(),
    body("zip", "Please Enter Zip code").notEmpty(),
];
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
    registerValidator,
};