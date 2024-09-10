import express from "express";
import {
  getMyProfile,
  mobileLoginUser,
  verifyMobileOtp,
} from "../controllers/user";
import { isAuthenticated } from "../middlewares/auth";
import { loginValidator, validateHandler, verifyOTPValidator } from "../lib/validator";

const app = express.Router();


// route - /api/v1/user/mobile-login
app.post("/mobile-login", loginValidator(), validateHandler, mobileLoginUser);

// route - /api/v1/user/verify-otp
app.post('/verify-otp', verifyOTPValidator(), validateHandler, verifyMobileOtp);

// route - /api/v1/user/me
// After here user must be logged In to access the routes
// app.get("/me", isAuthenticated, getMyProfile);
app.use(isAuthenticated);

app.get("/me", getMyProfile);

export default app;