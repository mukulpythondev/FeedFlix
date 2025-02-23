import mongoose ,{Schema, Document } from "mongoose";

export interface Message extends Document {
    message:string;
    createdAt:Date
}
export interface User extends Document {
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verfiyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}
const messageSchema:Schema<Message>= new Schema({
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, 'Username is required '],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        match:[/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,"Use a valid mail"],
        required:[true, 'Email is required ']
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    password:{
        type:String,
        required:[true, 'Password is required ']
    },
    verifyCode:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true
    },
    verfiyCodeExpiry:{
        type:Date,
        required:true
    },
    messages:[messageSchema]
})
export const UserModel= (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)