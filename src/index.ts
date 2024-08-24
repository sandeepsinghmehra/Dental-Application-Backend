import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './database/connection';

// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const app = express();
const PORT = process.env.PORT || 8099;
const dbUri: string | undefined = process.env.MONGO_URI;

// Connect to MongoDB
connectDB(dbUri);

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

app.get('/', (req, res) => {
    res.send('API is running...');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
