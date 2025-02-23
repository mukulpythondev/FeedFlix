import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request:Request, response:Response)
{
    await dbConnect();
    try {
      const {username,email,password} = await request.json()
      const existingUserByUserName= await UserModel.findOne({
        username,
        isVerified:true
      })
      if(existingUserByUserName!=null )
      {
        return Response.json({
          success:true,
         message:"username is already taken" 
        }, {status: 400})
      }
      const existingUserByEmail= await UserModel.findOne({ email})
      const verifyCode= Math.floor(100000+Math.random()*900000).toString()
      if(existingUserByEmail!=null )
        {
          if(existingUserByEmail.isVerified)
          {
            return Response.json({
              success:true,
             message:"email is already taken" 
            }, {status: 400})
          }
          else
            {
              const hashedPassword= await bcrypt.hash(password,10);
              existingUserByEmail.password=hashedPassword
              existingUserByEmail.verfiyCodeExpiry= new Date(Date.now()+3600000);
              await existingUserByEmail.save();

            }
        }
        else
        {
          const hashedPassword= await bcrypt.hash(password,10);
          const expiryDate= new Date();
          expiryDate.setHours(expiryDate.getHours()+1)
          const newUser=new UserModel({
              username,
                email,
                password:hashedPassword,
                verifyCode,
                isAcceptingMessage:true,
                messages:[],
                verfiyCodeExpiry:expiryDate
          })
          await newUser.save()
        }

        // send the otp
      const emailResponse=  await sendVerificationEmail(email,username,verifyCode)
      if(!emailResponse.success)
        return Response.json({success:false, message:emailResponse.message},{status:500})

      return Response.json({success:true, message:"user registered successfully. Please verify your mail."},{status:201})

    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success:false,
            message:"Error registering user"
        },
        {
            status:500
        }
    )
    }
}