import { commonOtpModel } from "src/app/model/common.model";

export const  FORMTYPES:any=[ 

    { "formType":"password" ,"formDetails": [
      { "fieldName" : "oldPassword","minLength": 8, "maxLength":20 , "required" :"Y" },
      { "fieldName" : "newPassword","minLength": 8, "maxLength":20, "regex": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", "required" :"Y"},
      { "fieldName" : "confirmNewPassword","minLength": 8, "maxLength":20 , "required" :"Y"}
    ]},
  
  ]
  export const OTPINPUTMESSAGE:commonOtpModel = {
    headerMsg:'OTP Verification',
    showCloseButton:false,
    subHeaderMsg:'Please enter 6 digit OTP sent on Mobile Number ending with',
    serviceType:'',
    authType: '',
    params:'',
    otpkeyName:''
  };