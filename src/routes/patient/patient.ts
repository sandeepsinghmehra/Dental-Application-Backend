import express from "express";
import { isPatientAuthenticated } from "../../middlewares/auth";
import { getAllDoctorsListService } from "../../controllers/patient/patient";




const app = express.Router();


// route - /api/v1/user/patient/give-location
app.post("/patient/give-location", isPatientAuthenticated, getAllDoctorsListService);


export default app;