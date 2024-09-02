import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import { User } from "../models/user";
import { TryCatch } from "./error";
import ErrorHandler from "../utils/utility";

// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const isAuthenticated = TryCatch(async(req:any, res, next) => {

  // console.log("req.cookies", req.cookies['dnt-access-token']);
  const token =  req.cookies['dnt-access-token'];

  if(!token) return next(new ErrorHandler("Please login to access this route", 401));

  //verify token
  const decodedData:any = jwt.verify(token, process.env.JWT_SECRET as string);

  req.userId = decodedData._id;
  const user = await User.findById(decodedData._id);

  req.user = user
  next();
});

// Middleware to make sure only admin is allowed
const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Saale Login Kr phle", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Saale Fake ID Deta Hai", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Saale Aukat Nhi Hai Teri", 403));

  next();
});

export { isAuthenticated, adminOnly };