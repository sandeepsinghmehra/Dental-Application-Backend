import { NextFunction, Request, Response } from "express";
import { NewUserMobileRequestBody } from "../types/types";
import { User } from "../models/user";
import { TryCatch } from "../middlewares/tryCatch";
import ErrorHandler from "../utils/utility";
import twilio from 'twilio';
import { sendToken } from "../utils/features";
import httpError from "../utils/httpError";
import httpResponse from "../utils/httpResponse";
import responseMessage from "../constants/responseMessage";
import config from "../config/config";
import { generateOTP } from "../utils/otp";
import { uploadFilesToCloudinary } from "../utils/cloudinaryFeature";

// const textflow = require("textflow.js");


const accountSid =  config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const serviceID:any = config.TWILIO_SERVICE_ID;
const client = twilio(accountSid, authToken);
// console.log("serviceID: ", serviceID)
// console.log("accountSid: ", accountSid);
// console.log("authToken: ", authToken);
// textflow.useKey("6VAeDYFefF09aybKHWtCutyofIJkZGUtfhehrhiThErXILRvrE5JC0F8lNSerqFw");

const mobileLoginUser = TryCatch(
    async(
        req: Request<{}, {}, NewUserMobileRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { countryCode, mobile_number } = req.body;
        // console.log("mobile_number: ", mobile_number );
        if (!mobile_number ) return next(new ErrorHandler("Please send mobile number", 400));
        if (!countryCode ) return next(new ErrorHandler("Please give country code", 400));
        // if (!role ) return next(new ErrorHandler("Please choose role", 400));
    
        let user:any = await User.findOne({mobile_number});
        // console.log("user: ", user);
        // generate otp
        const otp = generateOTP(6);
        

        if (user !== null && Object.keys(user).length > 0) {
            console.log("otp: ", otp);
           
            const expiresOtpAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            user.otp = otp;
            user.expiresOtpAt = expiresOtpAt; // Assuming you have an expiresOtpAt field in your User schema
            await user.save(); // Save the updated user
            // await User.create({ otp, expiresOtpAt });
            // save otp to user collection
            // user.otp = otp;
            // await user.save();
            // Send OTP to the user's phone number using Twilio
            await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: config.TWILIO_PHONE_NUMBER!,
                to: `+${countryCode}${mobile_number}`
            });
            return res.status(200).json({
                success: true,
                message: `OTP send successfully on this number ${user.mobile_number}`,
            });
        } else {
            return res.status(200).json({
                success: true,
                message: `User does not exists on this number ${user.mobile_number}`,
            });
        }
    }
)

const verifyMobileOtp = TryCatch(
    async(
        req: Request<{}, {}, any>,
        res: Response,
        next: NextFunction
    ) => {
        
        const { countryCode, mobile_number, otp } = req.body;

        if (!mobile_number ) return next(new ErrorHandler("Please send mobile number", 400));
        if (!countryCode ) return next(new ErrorHandler("Please give country code", 400));
        if (!otp || otp.length !== 6 ) return next(new ErrorHandler("Please give 6 digit OTP", 400));

        let user:any = await User.findOne({mobile_number}).select('+otp');
        console.log("user: ", user);
        if(user !== null && Object.keys(user).length > 0){
            console.log("user.otp: ", user.otp, " otp: ", otp);
            if(user.otp === otp){
                // Convert the user object to a plain JavaScript object
                const userWithoutOtp = user.toObject();

                // Manually remove the otp field
                delete userWithoutOtp.otp; // Ensure the otp field is removed
                sendToken(res, userWithoutOtp, 201, "User login successfully");
            } else {
                return res.status(400).json({
                    success: false,
                    message: `User is not Verified!!`
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: `User is not exists this number`
            })
        }
    }
);

// Create a new user & save it to the db & save in cookie token
const newUserRegister = TryCatch(
    async(
        req: Request<{}, {}, any>,
        res: Response,
        next: NextFunction
    ) => {
        console.log("req.body: ", req.body);
    const { mobile_number, countryCode, role } = req.body;

    if (!mobile_number ) return next(new ErrorHandler("Please send mobile number", 400));
    if (!countryCode ) return next(new ErrorHandler("Please give country code", 400));
    if (!role ) return next(new ErrorHandler("Please choose role", 400));
    
    // const file: Express.Multer.File | undefined = req.file;

    // if(!file) return next(new ErrorHandler("Please Upload Avatar", 400));

    // const result = await uploadFilesToCloudinary([file]);

    // const avatar = {
    //     public_id: result[0]?.public_id,
    //     url: result[0]?.url,
    // }
    // console.log("avatar info: ", avatar);
    

    // let updateData = {
    //     firstName: firstName,
    //     middleName: middleName,
    //     lastName: lastName,
    //     avatar: avatar,
    //     bio: bio,
    //     gender: gender,
    //     address: {
    //         street1: street1,
    //         // street2: street2,
    //         city: city, state: state, country: country, zip: zip
    //     }
    // }
    let user:any = await User.findOne({mobile_number});
    // console.log("user: ", user, !(user === null), Object.keys(user)?.length > 0);
    const otp = generateOTP(6);
    console.log("otp: ", otp);
    if (user !== null && Object.keys(user).length > 0) {
        return next(new ErrorHandler("User exists, Please Login", 400));
    } else {
        const expiresOtpAt = new Date(Date.now() + 5 * 60 * 1000);
        if(role === "doctor"){
            user = await User.create({
                mobile_number,
                role,
                countryCode,
                status: 'pending',
                expiresOtpAt: expiresOtpAt,
                otp: otp
            }); 
        } else {
            user = await User.create({
                mobile_number,
                role,
                countryCode,
                status: 'patient_approved',
                expiresOtpAt: expiresOtpAt,
                otp: otp
            }) 
        }
    
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: config.TWILIO_PHONE_NUMBER!,
            to: `+${countryCode}${mobile_number}`
        });
        return res.status(201).json({
            success: true,
            message: `OTP send successfully on this number ${user.mobile_number}`,
        });
    }
});

const reSendOTPService = TryCatch(
    async(
        req: Request<{}, {}, NewUserMobileRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { countryCode, mobile_number } = req.body;
        // console.log("mobile_number: ", mobile_number );
        if (!mobile_number ) return next(new ErrorHandler("Please send mobile number", 400));
        if (!countryCode ) return next(new ErrorHandler("Please give country code", 400));
    
        let user:any = await User.findOne({mobile_number});
        // console.log("user: ", user);
        // generate otp
        const otp = generateOTP(6);
        

        if ( Object.keys(user).length > 0) {
            console.log("otp: ", otp);
           
            const expiresOtpAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            user.otp = otp;
            user.expiresOtpAt = expiresOtpAt; // Assuming you have an expiresOtpAt field in your User schema
            await user.save(); // Save the updated user
            // await User.create({ otp, expiresOtpAt });
            // save otp to user collection
            // user.otp = otp;
            // await user.save();
            // Send OTP to the user's phone number using Twilio
            await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: config.TWILIO_PHONE_NUMBER!,
                to: `+${countryCode}${mobile_number}`
            });
            return res.status(200).json({
                success: true,
                message: `OTP send successfully on this number ${user.mobile_number}`,
            });
        } else {
            return res.status(200).json({
                success: true,
                message: `User does not exists on this number ${user.mobile_number}`,
            });
        }
    }
); 

const getPatientMyProfile = TryCatch(async (req:any, res, next) => {
    const user:any = await User.findById({ _id: req.userId });

    if(user.role !== "patient") return next(new ErrorHandler("You are not a patient", 400));
    // console.log("user", user);
    httpResponse(req, res, 200, responseMessage.SUCCESS, user);
});

const patchPatientProfile = TryCatch(async (req:any, res, next) => {
    const _id = req.params.id;
    let updateData = req.body; // assuming form-data is used
    let userEmail;
    // If there's a file, include it in the update data
    console.log("updateData", updateData, req.file);
    if (req.file) {
        updateData.avatar = req.file.path;
    }
    userEmail=updateData.email;
    updateData = {
        firstName: updateData.firstName,
        middleName: updateData.middleName,
        lastName: updateData.lastName,
        avatar: updateData.avatar,
        bio: updateData.bio,
        gender: updateData.gender,
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            $set: {
                email: userEmail,
                profile: updateData  // Include this if there's a file uploaded
            }
        },
        { new: true }
        // { new: true, runValidators: true }  // Ensure validators run and return the updated document
    );

    // console.log("updatedUser", updatedUser);

    if (!updatedUser) return next(new ErrorHandler("Patient not found", 404));

    // console.log("user", user);
    httpResponse(req, res, 200, responseMessage.SUCCESS, updatedUser);
});

const getDoctorMyProfile = TryCatch(async (req:any, res, next) => {
    const user:any = await User.findById({ _id: req.userId });

    if(user.role !== "doctor") return next(new ErrorHandler("You are not a doctor", 400));
    // console.log("user", user);
    httpResponse(req, res, 200, responseMessage.SUCCESS, user);
});

export {
    mobileLoginUser, 
    verifyMobileOtp, 
    newUserRegister,
    reSendOTPService,
    getPatientMyProfile, 
    getDoctorMyProfile,
    patchPatientProfile,
};