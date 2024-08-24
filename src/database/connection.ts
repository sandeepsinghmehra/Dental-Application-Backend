import mongoose from 'mongoose';

const connectDB = async (dbUri: string | undefined) => {
    try {
        await mongoose.connect(dbUri || "");
        console.log(`MongoDB connected successfully database at ${dbUri}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
