import { NextFunction, Request, Response } from "express";
import { NewUserMobileRequestBody, NewUserRequestBody } from "../types/types";
import { User } from "../models/user";
import { TryCatch } from "../middlewares/error";
import ErrorHandler from "../utils/utility";
import twilio from 'twilio';
import dotenv from 'dotenv';
import { sendToken } from "../utils/features";

// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });


const otpStore = {};
const accountSid =  process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceID:any = process.env.TWILIO_SERVICE_ID;
const client = twilio(accountSid, authToken);
// console.log("serviceID: ", serviceID)
// console.log("accountSid: ", accountSid);
// console.log("authToken: ", authToken);

const mobileLoginUser = TryCatch(
    async(
        req: Request<{}, {}, NewUserMobileRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { mobile_number } = req.body;
        // console.log("mobile_number: ", mobile_number );
        if (!mobile_number ) return next(new ErrorHandler("Please send mobile number", 400));
    
        let user:any = await User.find({mobile_number});
        // console.log("user: ", user);
        if (user.length > 0) {
            // console.log("if called")
            client.verify.v2.services(serviceID)
                .verifications
                .create({to: mobile_number, channel: 'sms'})
                .then((verification: any) => {
                    console.log(verification.sid);
                    return res.status(200).json({
                        success: true,
                        message: `OTP send successfully on this number ${user[0].mobile_number}`
                    });
                })
                .catch((error) => {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid mobile number`,
                    })
                }) 
        } else {
       
            user = await User.create({
                mobile_number
            });
            // console.log("user created: ", `OTP send successfully on this number ${user.mobile_number}`, user);
            client.verify.v2.services(serviceID)
                .verifications
                .create({to: mobile_number, channel: 'sms'})
                .then((verification: any) => {
                    console.log(verification.sid);
                    return res.status(201).json({
                        success: true,
                        message: `OTP send successfully on this number ${user.mobile_number}`,
                    });
                })
                .catch((error) => {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid mobile number`,
                    })
                })
        }
    }
)

const verifyMobileOtp = TryCatch(
    async(
        req: Request<{}, {}, any>,
        res: Response,
        next: NextFunction
    ) => {
        const userInputOtp = req.body;
        // console.log("userInputOtp: ", userInputOtp);
        const { mobile_number, otp } = req.body;

        client.verify.v2.services(serviceID) 
        .verificationChecks.create({
          to: `${mobile_number}`,
          code: otp,
        })
        .then(async (data) => {
          if (data.status === "approved") {
            console.log("approved succussfully");
            let user:any = await User.find({mobile_number});
            sendToken(res, user, 201, "User login successfully");
          } else {
            return res.status(400).send({
              message: "User is not Verified!!",
              data,
            });
          }
        })
        .catch((error) => {
            return res.status(400).json({
                success: false,
                message: `User is not Verified!!`,
            })
        });
    }
)

const getMyProfile = TryCatch(async (req:any, res) => {

    return res.status(200).json({
        success: true,
        data: req.user,
    })
});

export {
    mobileLoginUser, 
    verifyMobileOtp, 
    getMyProfile, 
};