import express from "express";
import {
  getDoctorMyProfile,
  getPatientMyProfile,
  mobileLoginUser,
  verifyMobileOtp,
  patchPatientProfile,
  newUserRegister,
  reSendOTPService,
} from "../controllers/user";
import { isAuthenticated, isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth";
import { loginValidator, registerValidator, validateHandler, verifyOTPValidator } from "../lib/validator";
import { singleUpload } from "../middlewares/multer";


const app = express.Router();


// route - /api/v1/user/mobile-login
app.post("/mobile-login", loginValidator(), validateHandler, mobileLoginUser);

// route - /api/v1/user/verify-otp
app.post('/verify-otp', verifyOTPValidator(), validateHandler, verifyMobileOtp);

app.post("/new-user-register", registerValidator(), validateHandler, newUserRegister);
// app.post("/new-user-register", singleUpload, registerValidator(), validateHandler, newUserRegister);

app.post("/re-send-otp", loginValidator(), validateHandler, reSendOTPService);
// route - /api/v1/user/me
// After here user must be logged In to access the routes
app.get("/profile/patient/me", isPatientAuthenticated, getPatientMyProfile);
// app.patch("/patient/:id", isPatientAuthenticated, singleUpload, patchPatientProfile);
app.patch("/patient/:id", isPatientAuthenticated, singleUpload, patchPatientProfile);
// app.use(isAuthenticated);

// app.get("/me", getMyProfile);

app.get("/doctor/me", isDoctorAuthenticated, getDoctorMyProfile);

export default app;