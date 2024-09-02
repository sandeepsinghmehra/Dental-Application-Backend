import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const jwtSecret:string | undefined = process.env.JWT_SECRET;

const cookieOptions:any = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
}
const sendToken = async (res: Response, user:any, code:number, message:string) => {
 
    const token = jwt.sign({_id: user[0]._id}, jwtSecret as string);

    return res
        .status(code)
        .cookie("dnt-access-token", token, cookieOptions)
        .json({
            success: true,
            token,
            user,
            message
        });
};

export { 
    sendToken, 
    cookieOptions, 
};