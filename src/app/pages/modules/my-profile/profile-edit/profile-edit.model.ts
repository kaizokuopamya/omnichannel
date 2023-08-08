import { commonOtpModel } from "src/app/model/common.model";
import { commonOtEmailpModel } from "src/app/model/common.model";

export const  FORMTYPES:any=[ 

    { "formType":"username" ,"formDetails": [{ "fieldName" : "username","minLength": 8, "maxLength":20 , "required" :"Y" }]},
    { "formType":"email" ,"formDetails": [{ "fieldName" : "emailId", "required" :"Y","regex":/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}]},
    { "formType":"aadhar" ,"formDetails": [{ "fieldName" : "aadhar","minLength": 12, "maxLength":12 }], "required" :"Y"},
    { "formType":"pan" ,"formDetails": [{ "fieldName" : "pan","minLength": 10, "maxLength":10 ,"regex":"/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/"}], "required" :"Y"},
    { "formType":"address" ,"formDetails": [
      { "fieldName" : "address1", "required" :"Y"},
      { "fieldName" : "address2"},
      { "fieldName" : "address3"},
      { "fieldName" : "city", "required" :"Y"},
      { "fieldName" : "state", "required" :"Y"},
      { "fieldName" : "pinCode", "required" :"Y"},
      { "fieldName" : "documentNumber"},
      
    ]
    },
  
  ]

  export const OTPINPUTMESSAGE:commonOtpModel = {
    headerMsg:'OTP Verification',
    showCloseButton:false,
    subHeaderMsg:'Please enter 6 digit OTP sent on Mobile Number ending with',
    serviceType:'Login',
    authType: '',
    params:'',
    otpkeyName:''
  };

  export const OTPEMAILINPUTMESSAGE:commonOtEmailpModel = {
    headerMsg:'OTP Verification',
    showCloseButton:false,
    subHeaderMsg:'Please enter 6 digit OTP sent on Mobile Number ending with',
    serviceType:'Login',
    params:'',
    otpkeyName:'',
    emailkeyName:'',
    emailAddress:''
  };