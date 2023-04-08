import mongoose from 'mongoose';
import {app} from './app'

const start = async () => {
    console.log("starting up....../.....")

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        mongoose.set('strictQuery',false)
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongo...")

    } catch (error) {
        console.log(error);
    }
    
    app.listen(3000, () => {
        console.log("App listen to port 3000...")
    })
};

start();