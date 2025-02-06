import { z } from "zod";

const userNameValidaton= z.string().min(2,"Username minimum length is 2").max(20, "Username maximum length is 20").regex(/^[a-zA-Z0-9]+$/
,"Username must not contain any special character")
export const signUPSchema= z.object({
    username:userNameValidaton,
    email: z.string().email({message:"Invalid email"}),
    password:z.string().min(8,{message:"Password must be atleast 8 character"})
})