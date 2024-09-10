import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";


// Importing Routes
import userRoute from "./routes/user";
import { errorMiddleware } from './middlewares/error';
import helmet from 'helmet';
import rateLimit from './middlewares/rateLimit';


const app: Application = express();
// const PORT = process.env.PORT || 8099;
// const dbUri: string | undefined = process.env.MONGO_URI;


//Middleware
app.use(helmet());
// Enable CORS
app.use(cors());
// You can also configure CORS with options if needed
/*
const corsOptions = {
  origin: ['http://localhost:3000', 'http://yourdomain.com'], // Replace with your frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable cookies and other credentials
};

app.use(cors(corsOptions));
*/

app.use(express.json());

app.use(cookieParser()); // for accessing req.cookie in the auth middleware

app.get('/', rateLimit, (req, res) => {
    res.send('API is running...');
});

// Using Routes
app.use("/api/v1/user", userRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


export default app
