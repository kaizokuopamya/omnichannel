import { SideNavData } from "../pages/common-ui/sidenav/sidenav.model";


export class commonOtpModel {
    headerMsg:string;
    subHeaderMsg:string;
    showCloseButton:boolean;
    serviceType:string;
    otpSendEndpint?:string;
    otpValidateEndpoint?:string;
    mobStaticEncKey?:any;
    authType?:string;
    params?:any;
    numCount?: number ;
    otpkeyName:any
};

export class commonOtEmailpModel {
  headerMsg:string;
  subHeaderMsg:string;
  showCloseButton:boolean;
  serviceType:string;
  otpSendEndpint?:string;
  otpValidateEndpoint?:string;
  mobStaticEncKey?:any;
  params?:any;
  otpkeyName:any
  emailkeyName:any
  emailAddress:any
};

export enum AccountType{
  FIXED_DEPOSITE_ACCOUNT = "TDA",
  RECURRING_DEPOSITE_ACCOUNT = "RDA",
  SAVING_ACCOUNT = "SBA",
  CURRENT_ACCOUNT = "CAA",
  CASH_CREDIT = "CCA",
  OVER_DRAFT_ACCOUNT = "ODA",
  LOAN_ACCOUNT = "LAA",
  DEMAND_DRAFT = "DDA",
}


export const TRANSACTIONRECEIPTOBJ = {
  date: '',
  msg: '',
  trans_Id: '',
  from_acc: '',
  to_acc: '',
  payee_name: '',
  payee_id: '',
  paymentType: '',
  amount: '',
  remarks: '',
  receiptType: '',
  RRN: '',
  redirectUrl: '',
  name: '',
  mobileNo: '',
  emailId: '',
  accountNo: '',
  accountHolderName: '',
  accountNickName: '',
  transferLimit: '',
  ifscCode: '',
  internationalTransfer: '',
  chequeType: '',
  chequeNo: '',
  startCheque: '',
  stopCheque: '',
  branchName: '',
  loanType: '',
  type: '',
  payeeAddr: '',
  payerAddr: '',
  upiOmnifromAcc: '',
  scheduledDate: '',
  scheduledType: '',
  isScheduled: false,
  mmid: '',
  confirmmobilenumber: '',
  modeOfTransfer: '',
  benificaryBankName: '',


  //hotlistcard
  debitCardNumber: '',
  accountNumber: '',
  reason: '',
  rrn: '',
  response: '',
  cardNo: '',
  cardType: '',

  // Add payee Object
  payeeAccNumber: '',
  payeeAccName: '',
  payeeNickname: '',
  payeeIfscCode: '',
  payeeMobileNo: '',
  payeeMMID: '',
  payeeVpa: '',
  payeeTransLimit: '',
  payeeIfsc: '',
  payeeAccNo: '',
  payeeNickName: '',


  // postive pay
  selectedName: '',
  selectAccount:'',
  chequeNumber:'',
  datepicker1:'',
  micr: '',
  fromChequeNo:'',
  toChequeNo:'',

  // freeze account
  refID: '',
  typeOfFreeze: '',

  //donation object
  payeeName: '',

  //apy object
  dob: '',
  nomineeName: '',
  debitAcc: '',
  pensionAmt: '',
  premiumAmt: '',
  premiumFreq: '',
  dateOfEnroll: '',
  nomineeAge: '',
  pranNo: '',
  premiumAmount: '',

  //request-cheq book
  accNumber: '',
  checkPageNo: '',
  commAddress: '',

  //apply-card
  cardVariant: '',
  isPhysicalApplied: '',

  //quicklock
  operation: '',

  cbsCode: '',
  newCardNo: '',
  cardMode: '',
  cardApplyType: '',
  blockReason: '',

  cardOnOffType: '',
  cardOperationType: '',
  MaskCardNumber: '',

  //cardless cash withdraw
  tempPin: '',
  receiverMobileNo: '',
  cardlessType: '',
  reqData: '',
  expyDate: '',
};

export const PROFILEEDITOBJ = {
  username: '',
  newUserName: '',
  emailId: '',
  address1: '',
  address2: '',
  address3: '',
  city: '',
  state: '',
  pinCode: '',
  documentNumber: '',
  addressProof: '',
  accNo: '',
  mobileNo: '',
  profileImage: '',
}

export const REGFEILDDATA = {
  custId: '',
  accNo: '',
  cardNumber1: '',
  cardNumber2: '',
  cardNumber3: '',
  cardNumber4: '',
  cardNumber5: '',
  cardNumber6: '',

  expDate1: '',
  expDate2: '',
  expDate3: '',
  expDate4: '',
  cardPin1: '',
  cardPin2: '',
  cardPin3: '',
  cardPin4: '',

  ibUserName: '',
  ibPassword: '',
  ibmpin: '',
  bankToken: '',
  username: '',
  password: '',
  confPassword: '',
  quest1: '',
  ans1: '',
  quest2: '',
  ans2: '',
  quest3: '',
  ans3: '',
  tpin: '',
  confTpin: '',
  mpin1: '',
  mpin2: '',
  mpin3: '',
  mpin4: '',
  mpin5: '',
  mpin6: '',
  confMpin1: '',
  confMpin2: '',
  confMpin3: '',
  confMpin4: '',
  confMpin5: '',
  confMpin6: '',
  cvvPin1:'',
  cvvPin2:'',
  cvvPin3:'',
  cvvPin4:'',
};
export const FORMVALIDATOR:any = []
// demo data for side nav menu


export const SIDEMENU:SideNavData[] = [
  {
    "Status": "Active",
    "imageName": "dashboard.svg",
    "sequenceNo": "1",
    "rights": "T",
    "menuName": "DASHBOARD",
    "JSON_KEY": "dashboard.svg",
    "ID": "920",
    "type": "HAMBURGER",
    "URL": "dashboard",
    "textToDisplay": "null",
    "isEnable": "Y"
  },
  {
    "Status": "Active",
    "imageName": "my_account.svg",
    "sequenceNo": "3",
    "rights": "T",
    "menuName": "MY_ACCOUNTS",
    "JSON_KEY": "my_account.svg",
    "ID": "9003",
    "type": "HAMBURGER",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y",
    "subMenu": [
      {"id" : 139,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "OPERATIVE_ACCOUNT","menulogo" : null,"appid" : 5,"submenuname" : "OPERATIVE_ACCOUNT","seqdisplay" : 10,"rights" : "T","pageurl" : "myAccount","enabled" : "Y"}, 
      {"id" : 142,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "MY_DEPOSITS","menulogo" : null,"appid" : 5,"submenuname" : "MY_DEPOSITS","seqdisplay" : 10,"rights" : "T","pageurl" : "myDeposits","enabled" : "Y"}, 
      {"id" : 150,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "MY_TERM_LOANS","menulogo" : null,"appid" : 5,"submenuname" : "MY_TERM_LOANS","seqdisplay" : 10,"rights" : "T","pageurl" : "myLoans","enabled" : "Y"}
    ],
  },
  {
    "Status": "Active",
    "subMenu": [ 
      {"id" : 139,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "INSTANT_PAY","menulogo" : null,"appid" : 5,"submenuname" : "INSTANT_PAY","seqdisplay" : 10,"rights" : "T","pageurl" : "instantPay","enabled" : "Y"}, 
      {"id" : 142,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "MANAGE_PAYEE","menulogo" : null,"appid" : 5,"submenuname" : "MANAGE_PAYEE","seqdisplay" : 10,"rights" : "T","pageurl" : "managePayee","enabled" : "Y"}, 
      {"id" : 150,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "SEND_MONEY","menulogo" : null,"appid" : 5,"submenuname" : "SEND_MONEY","seqdisplay" : 10,"rights" : "T","pageurl" : "sendMoney","enabled" : "Y"}, 
      {"id" : 151,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "STANDING_INSTRUCTION","menulogo" : null,"appid" : 5,"submenuname" : "STANDING_INSTRUCTION","seqdisplay" : 10,"rights" : "T","pageurl" : "standingInstructionList","enabled" : "Y"},
      {"id" : 153,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9003,"jsonkey" : "Scheduled Transaction","menulogo" : null,"appid" : 5,"submenuname" : "Scheduled Transaction","seqdisplay" : 10,"rights" : "T","pageurl" : "transactionStatus","enabled" : "Y"} 
    ],
    "imageName": "send_money.svg",
    "sequenceNo": "3",
    "rights": "T",
    "menuName": "FUND_TRANSFER",
    "JSON_KEY": "send_money.svg",
    "ID": "9003",
    "type": "HAMBURGER",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y"
  },
  {
    "Status": "Active",
    "subMenu": [ 
      {"id" : 130,"menuimage" : null,"createdby" : 1,"createdon" : 1640632437688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9004,"jsonkey" : "APPLY_FOR_NEW_CARD","menulogo" : null,"appid" : 5,"submenuname" : "APPLY_FOR_NEW_CARD","seqdisplay" : 10,"rights" : "T","pageurl" : "applyCards","enabled" : "Y"}, 
      {"id" : 136,"menuimage" : null,"createdby" : 1,"createdon" : 1640632437688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9004,"jsonkey" : "DEBIT_CARDS","menulogo" : null,"appid" : 5,"submenuname" : "DEBIT_CARDS","seqdisplay" : 10,"rights" : "T","pageurl" : "debitCards","enabled" : "Y"} 
    ],
    "imageName": "cards.svg",
    "sequenceNo": "3",
    "rights": "T",
    "menuName": "MY_CARDS",
    "JSON_KEY": "cards.svg",
    "ID": "9004",
    "type": "HAMBURGER",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y"
  },
  {
    "Status": "Active",
    "sequenceNo": "3",
    "imageName": "dashboard.svg",
    "menuName": "RECHARGE_BILLPAY",
    "rights": "T",
    "ID": "987",
    "JSON_KEY": "billpay.svg",
    "type": "menu",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y",
    "subMenu": [
      {
        "id": "20",
        "statusid": "08",
        "submenuname": "BILL_PAYMENT",
        "pageurl": "retailRechargeBillPay",
      },
      {
        "id": "Active",
        "statusid": "08",
        "submenuname": "REGISTERED_PAY",
        "pageurl": "registerBillerView",
      },
      {
        "id": "Active",
        "statusid": "08",
        "submenuname": "REMINDER_LIST",
        "pageurl": "billReminderList",
      },
      {
        "id": "Active",
        "statusid": "08",
        "submenuname": "COMPLAINT",
        "pageurl": "complaintList",
       
      },
      {
        "id": "Active",
        "statusid": "08",
        "submenuname": "PAYMENT_HISTORY",
        "pageurl": "retailPaymentHistory",
      },
    ]
  },
  {
    "Status": "Active",
    "subMenu": [ 
      {"id" : 137,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9007,"jsonkey" : "DELINK_ACCOUNT","menulogo" : null,"appid" : 5,"submenuname" : "DELINK_ACCOUNT","seqdisplay" : 2,"rights" : "T","pageurl" : "delinkAccount","enabled" : "Y"}, 
      {"id" : 138,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9007,"jsonkey" : "FREEZE_ACCOUNTS","menulogo" : null,"appid" : 5,"submenuname" : "FREEZE_ACCOUNTS","seqdisplay" : 4,"rights" : "T","pageurl" : "freezeAccount","enabled" : "Y"}, 
      {"id" : 141,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9007,"jsonkey" : "LINK_ACCOUNT","menulogo" : null,"appid" : 5,"submenuname" : "LINK_ACCOUNT","seqdisplay" : 1,"rights" : "T","pageurl" : "linkAccount","enabled" : "Y"}, 
      {"id" : 154,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9007,"jsonkey" : "TDS_CERTIFICATE","menulogo" : null,"appid" : 5,"submenuname" : "TDS_CERTIFICATE","seqdisplay" : 3,"rights" : "V","pageurl" : "tdsCertificate","enabled" : "Y"} 
    ],
    "imageName": "cheque.svg",
    "sequenceNo": "6",
    "rights": "T",
    "menuName": "SERVICES",
    "JSON_KEY": "cheque.svg",
    "ID": "9007",
    "type": "HAMBURGER",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y"
  },
  
  {
    "Status": "Active",
    "imageName": "send_money.svg",
    "sequenceNo": "8",
    "rights": "T",
    "menuName": "DONATIONS",
    "JSON_KEY": "send_money.svg",
    "ID": "9009",
    "type": "HAMBURGER",
    "URL": "donations",
    "textToDisplay": "null",
    "isEnable": "Y"
  },
  {
    "Status": "Active",
    "subMenu": [
      {"id" : 143,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "MY_CHEQUE_BOOK","menulogo" : null,"appid" : 5,"submenuname" : "MY_CHEQUE_BOOK","seqdisplay" : 1,"rights" : "V","pageurl" : "myChequeBook","enabled" : "Y"}, 
      {"id" : 134,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "CHEQUE_STATUS_ENQUIRY","menulogo" : null,"appid" : 5,"submenuname" : "CHEQUE_STATUS_ENQUIRY","seqdisplay" : 5,"rights" : "V","pageurl" : "chequeStatusEnquiry","enabled" : "Y"},
      {"id" : 147,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "POSITIVE_PAY","menulogo" : null,"appid" : 5,"submenuname" : "POSITIVE_PAY","seqdisplay" : 4,"rights" : "T","pageurl" : "positivePay","enabled" : "Y"}, 
      {"id" : 152,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "STOP_CHEQUE","menulogo" : null,"appid" : 5,"submenuname" : "STOP_CHEQUE","seqdisplay" : 3,"rights" : "T","pageurl" : "stopCheques","enabled" : "Y"}, 
      {"id" : 140,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "INWARD_CHEQUE_ENQUIRY","menulogo" : null,"appid" : 5,"submenuname" : "INWARD_CHEQUE_ENQUIRY","seqdisplay" : 6,"rights" : "V","pageurl" : "inwardChequeInquiry","enabled" : "Y"}, 
      {"id" : 144,"menuimage" : null,"createdby" : 1,"createdon" : 1634757237688,"statusid" : 3,"texttodisplay" : null,"menuid" : 9010,"jsonkey" : "NEW_CHEQUEBOOK_REQUEST","menulogo" : null,"appid" : 5,"submenuname" : "NEW_CHEQUEBOOK_REQUEST","seqdisplay" : 2,"rights" : "T","pageurl" : "chequeBookRequest","enabled" : "Y"}
    ],
    "imageName": "cheque.svg",
    "sequenceNo": "9",
    "rights": "T",
    "menuName": "Cheque Book",
    "JSON_KEY": "cheque.svg",
    "ID": "9010",
    "type": "HAMBURGER",
    "URL": "null",
    "textToDisplay": "null",
    "isEnable": "Y"
  }
];


// MODE OF OPERATION LIST 
export const MODEOFOPERATIONOBJ = [
  { 'ModeOfOperation': '001', 'modeOfOperationType': 'Self' },
  { 'ModeOfOperation': '002', 'modeOfOperationType': 'Either or Survivor' },
  { 'ModeOfOperation': '003', 'modeOfOperationType': 'Former or Survivor' },
  { 'ModeOfOperation': '004', 'modeOfOperationType': 'Any One or Survivor' },
  { 'ModeOfOperation': '005', 'modeOfOperationType': 'Jointly by all' },
  { 'ModeOfOperation': '006', 'modeOfOperationType': 'Proprietor' },
  { 'ModeOfOperation': '007', 'modeOfOperationType': 'Partner/Director' },
  { 'ModeOfOperation': '008', 'modeOfOperationType': 'Managing Partners/Director' },
  { 'ModeOfOperation': '009', 'modeOfOperationType': 'Any two Partners/Directors' },
  { 'ModeOfOperation': '010', 'modeOfOperationType': 'Power of Attorney' },
  { 'ModeOfOperation': '011', 'modeOfOperationType': 'Karta (HUF)' },
  { 'ModeOfOperation': '012', 'modeOfOperationType': 'Authorized Signatory' },
  { 'ModeOfOperation': '013', 'modeOfOperationType': 'Executor / Administrator' },
  { 'ModeOfOperation': '014', 'modeOfOperationType': 'Guardian' },
  { 'ModeOfOperation': '015', 'modeOfOperationType': 'Mandate Holder' },
  { 'ModeOfOperation': '016', 'modeOfOperationType': 'Official Liquidator' },
  { 'ModeOfOperation': '017', 'modeOfOperationType': 'Trusteed' },
  { 'ModeOfOperation': '019', 'modeOfOperationType': 'Chairman' },
  { 'ModeOfOperation': '020', 'modeOfOperationType': 'Secretary' },
  { 'ModeOfOperation': '021', 'modeOfOperationType': 'President' },
  { 'ModeOfOperation': '022', 'modeOfOperationType': 'Treasurer' },
  { 'ModeOfOperation': '023', 'modeOfOperationType': 'Jointly or Survivors' },
  { 'ModeOfOperation': '024', 'modeOfOperationType': 'Anyone ' },
  { 'ModeOfOperation': '025', 'modeOfOperationType': 'Constitutional Attorney' }
];

export const PAGINATIONOBJ = [
  {id:"basicPaginate1", itemsPerPage: 10, currentPage: 1},
  {id:"basicPaginate2", itemsPerPage: 10, currentPage: 1},
  {id:"basicPaginate3", itemsPerPage: 10, currentPage: 1},
  {id:"basicPaginate4", itemsPerPage: 10, currentPage: 1}
];

export const PERIODOBJ = [
  {
    'year': '2021',
    'displayYear': '2021-2022'
  },
  {
    'year': '2020',
    'displayYear': '2020-2021'
  },
  {
    'year': '2019',
    'displayYear': '2019-2020'
  },
  {
    'year': '2018',
    'displayYear': '2018-2019'
  },
  {
    'year': '2017',
    'displayYear': '2017-2018'
  },
  {
    'year': '2016',
    'displayYear': '2016-2017'
  },
];



export const BENEFICIARYLIST = {
  payeeAccNumber: '',
}


export const SHAREDETAILOBJ = {
    'name' : false,
    'accType' : false,
    'accStatus' : false,
    'accNo' : false,
    'interest' : false,
    'branchAdd' : false,
    'ifsc' : false,
    'custId' : false
}

export const SHAREDETAILFDOBJ = {
  'accStatue' : false,
  'accType' : false,
  'accScheme' : false,
  'accHolderName' : false,
  'openDate' : false,
  'maturityDate' : false,
  'tenure' : false,
  'interestRate' : false,
  'modeOfFDOpening' : false,
  'modeOfOpperation' : false,
  'payoutAmt' : false,
  'maturityInstruction' : false,
  'nonimeeDtl' : false,
}

export const OPEN_FD_RECEIPTOBJMODEL = {
  depositType: '',
  depositScheme: '',
  interestPayout: '',
  depositorType: '',
  depositAmount: '',
  tenure: '',
  interestRate: '',
  maturityAmount: '',
  maturityDate: '',
  modeOfOperation: '',
  maturityInstruction: '',
  maturityPayoutAccount: '',
  nomineeName: '',
  tenureMonth: '',
  tenureDays: '',
  schemeName: ''
}

export const OPEN_RD_RECEIPTOBJMODEL = {
  depositType: '',
  depositorType: '',
  installmentAmount: '',
  tenure: '',
  interestRate: '',
  monthlyDebitDate: '',
  maturityAmount: '',
  maturityDate: '',
  modeOfOperation: '',
  debitAccount: '',
  maturityInstructions: '',
  maturityPayoutAccount: '',
  nomineeName: '',
  tenureMonths: '',
  paymentFrequency: '',
  autoClosureFlag: false,
  rdSchemeType: '',
  schemeName: ''
}

export const CLOSE_FD_MODEL = {
  depositType: '',
  depositScheme: '',
  depositorType: '',
  FDAccNumber: '',
  rateOfInterest: '',
  depositAmount: '',
  currentMaturityAmount: '',
  creditToClose: '',
  maturityDate: '',
  maturityPayoutAccount: '',
  remarks: ''
}

export const CLOSE_RD_MODEL = {
  depositType: '',
  depositScheme: '',
  depositorType: '',
  RDAccNumber: '',
  rateOfInterest: '',
  depositAmount: '',
  currentMaturityAmount: '',
  creditToClose: '',
  maturityDate: '',
  maturityPayoutAccount: ''
}

export const NOMINEERECEIPTOBJ ={
  nomineeName: '',
  nomineeRelationship: '',
  address1: '',
  address2: '',
  dateOfBirth: '',
  minorFlag: '',
  guardianName: '',
  guardianAddress: '',
  state: '',
  city: '',
  msg: '',
  response: '',
  rrn: '',
  nomineeFlag: ''
}





