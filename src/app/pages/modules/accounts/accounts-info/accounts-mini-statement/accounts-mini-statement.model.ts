import { commonOtpModel } from "src/app/model/common.model";


export const OTPINPUTMESSAGE: commonOtpModel = {
  headerMsg: 'OTP Verification',
  showCloseButton: false,
  subHeaderMsg: 'Please enter 6 digit OTP sent on Mobile Number ending with',
  serviceType: 'Login',
  authType: 'otp',
  params: '',
  otpkeyName: ''
};
