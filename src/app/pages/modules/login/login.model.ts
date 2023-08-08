import { commonOtpModel } from "src/app/model/common.model";
import { FooterData } from "src/app/model/footer.model";



// data for login data.

export const LOGINPAGEFOOTERDATA: FooterData[] = [
    {
        image: 'assets/images/svg/language-g.svg',
        url: 'languageChange',
        name: 'LANGUAGE'
    },
    {
        image: 'assets/images/svg/location-g.svg',
        url: 'locateUs',
        name: 'LOCATE_US'
    },
    {
        image: 'assets/images/svg/contact-g.svg',
        url: 'contactUs',
        name: 'CONTACT_US'
    },
    {
        image: 'assets/images/svg/more.svg',
        url: 'moreServices',
        name: 'MORE_SERVICES'
    },
]

export const OTPINPUTMESSAGE:commonOtpModel = {
    headerMsg:'OTP Verification',
    showCloseButton:false,
    subHeaderMsg:'Please enter 6 digit OTP sent on Mobile Number ending with',
    serviceType:'Login',
    otpValidateEndpoint:"",
    authType: 'OTP',
    params:'',
    otpkeyName:'',
    mobStaticEncKey:''
  };