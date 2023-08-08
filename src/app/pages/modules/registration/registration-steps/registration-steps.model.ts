import { commonOtpModel } from "src/app/model/common.model";
import { RegistrationStepper } from "src/app/model/registrationsteps.model";

export const REGISTRATIONSTEP: RegistrationStepper[] =
[{
    "stepIndex": 1,
    "stepname":"Account Details",
    "stepActive": true,
    "stepStatus": "inprogress",
    "tabName": "step1"
  },
  {
    "stepIndex": 2,
    "stepname": "Channel Credentials",
    "stepActive": false,
    "stepStatus": "incomplete",
    "tabName": "step2"
  },
  {
    "stepIndex": 3,
    "stepname": "Set Login Credentials",
    "stepActive": false,
    "stepStatus": "incomplete",
    "tabName": "step3"
  },
  // {
  //   "stepIndex": 4,
  //   "stepname": "Create UPI ID",
  //   "stepActive": false,
  //   "stepStatus": "incomplete",
  //   "tabName": "step4"
  // },
  {
    "stepIndex": 4,
    "stepname": "Set MPIN",
    "stepActive": false,
    "stepStatus": "incomplete",
    "tabName": "step4"
  },
  {
    "stepIndex": 5,
    "stepname": "Set TPIN",
    "stepActive": false,
    "stepStatus": "incomplete",
    "tabName": "step5"
  }
]

export const REGISTRATIONOTPINPUTMESSAGE:commonOtpModel = {
  headerMsg:'OTP Verification',
  showCloseButton:false,
  subHeaderMsg:'Please enter 6 digit OTP sent on Mobile Number ending with',
  serviceType:'REGISTRATION',
  otpValidateEndpoint:"",
  authType: 'OTP',
  params:'',
  otpkeyName:'',
  mobStaticEncKey:''
};
