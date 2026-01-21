// services/otpService.ts

import { promises } from "dns";
import OTP from "../models/otpModel";



 export  const generateOTP = async (email:string):Promise<number> => {
    const otp = Math.floor( 100000 + Math.random() * 900000)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    await OTP.create({email , otp:otp.toString(), expiresAt:expiresAt})
  
    return otp
  
}

export const checkOtpExistss = async(email:string,otp:number):Promise<boolean> => {
    const existingOtp = await OTP.findOne({email,otp})
    return !!existingOtp

}

export const verifyOtp = async (email:string ,otp:string,shouldDelete:boolean) : Promise<boolean> => {
    const savedOtp = await OTP.findOne({email,otp})
    if(!savedOtp){
        return false
    }
  if(shouldDelete){
    await OTP.deleteOne({email,otp})    
  }
    return true   

}

//(sami === ''){
// hello
//}