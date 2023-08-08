import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var device: any;

@Injectable({
  providedIn: 'root'
})

export class AppConstants {
  /** public URL Api configuration */
 
  publicURL = {
    serviceURL: environment.serviceURL
  };

  /** value */
  
  val_bank_name = "Kiya.ai";
  val_bank_longForm = "kiya.ai Bank";
  val_bank_address = "Kiya.ai Unit No 86 & 87,1st Floor, SDF III, SEEP SEZ, Andheri (East), Mumbai - 400096, India.";
  key_WEBSITE_link = "https://www.kiya.ai/"
  val_COMPLAINTLINK ="https://www.kiya.ai/contact/"
  val_website_url ="https://www.kiya.ai/"
  val_android = "android";
  val_ios = "ios";
  val_cbsType = 'flexcube';
  val_cbsTypeTcs = 'OMNI';
  val_cbsTypeFinacle = 'Finacle';
  val_mobPlatform = 'web';
  //val_mobPlatform = 'iOS';
  val_channelValueIB = 'IB';
  val_channelValueMOB = 'MOB';
  val_default_lang = 'en';
  val_entityIDMob = 'RMOB';
  val_entityId_UMOB = "UMOB";
  val_entityIDDesk = 'RIB';
  val_bankToken = 'bankToken';
  val_REGISTRATION = 'REGISTRATION';
  val_PROFILE = "PROFILE";
  val_legacySystem = "legacySystem";
  key_credentialType = "credentialType";
  val_sessionKey = "sessionKey";
  val_accountNumberLength: number = 14;
  val_PRELOGIN = 'PRELOGIN';
  val_mobileAppVersion = '2.0';
  val_mobileAppVersion_android = '2.0';
  val_mobileAppVersion_ios = '2.0';
  val_clientAppVersion = '2.0';
  val_latitude = '';
  val_longitude = '';
  val_requestType = 'P';
  val_isCorporate = "N";
  val_loginType = 'credentials';
  val_loginTypeMPIN = 'mpin';
  val_bioMetric = "bioMetric";
  val_UPDATETRANSATIONLIMIT = 'UPDATETRANSATIONLIMIT';
  val_PROFILEDETAILS = 'PROFILEDETAILS';
  val_CHANGEPASSWORD = 'CHANGEPASSWORD';
  val_CHANGEMPIN = 'CHANGEMPIN';
  val_CHANGETPIN = 'CHANGETPIN';
  val_MPIN = "MPIN";
  val_TPIN = "TPIN";
  val_AUTHENTICATIONMODE = 'AUTHENTICATIONMODE';
  val_BILLPAYMENT = 'Bill Payment'
  val_VALIDATEMAILID = "VALIDATEMAILID";
  key_emailOtp = "emailOtp";
  key_txn_amount = "txn_amount";
  key_mobileOtp = "mobileOtp";
  val_Successful = "Successful"
  val_success = 'success';
  val_Failure = "Failure";
  val_Failed = "Failed";
  val_FUNDTRANSFER = 'FUNDTRANSFER';
  val_ATM = "ATM";
  val_BRANCH = "BRANCH"; 
  val_upi_BRANCH = "BRANCH";
  val_upi_ATM = "ATM";
  val_upi_ZONAL = "ZONAL";
  val_upi_HO = "HO";
  val_DeviceID = "1";
  val_upi_All = "All";
  val_upi_ALL = "ALL";
  val_NEARBY = "NEARBY";
  val_ADDPAYEE = 'ADDPAYEE';
  val_generateMMMID = 'generateMMID' ;
  val_assessmentYear = "TDS_ASSESMENT_YEAR" ;
  val_DELETEPAYEE = 'DELETEPAYEE';
  val_entityId_BBPS = "PSB"
  val_debitCard = "debitCard";
  val_FORGOTPASSWORD = 'FORGOTPASSWORD';
  val_POSITIVEPAY = 'POSITIVEPAY';
  val_CHEQUEBOOKREQUEST = 'CHEQUEBOOKREQUEST';
  val_DONATIONTRANSFER = 'DONATIONTRANSFER';
  val_StopCheque = "StopCheque";
  val_DELINK = 'DELINK';
  val_LINK = 'LINK';
  val_FORGOTMPIN = 'FORGOTMPIN';
  val_FORGOTMPINUSER = 'FORGOTMPINUSER';
  val_STOPCHEQUE = 'STOPCHEQUE';
  val_FREEZEACCOUNT = 'FREEZEACCOUNT';

  // Deposit
  val_OPENFD = 'OPENFD'
  val_OPENRD = 'OPENRD'
  val_CLOSEFD = 'Close FD'
  val_CLOSERD = 'Close RD'

  //NOMINEE
  val_ADDNOMINEEDATA = 'ADDNOMINEEDATA';
  val_MODIFYNOMINEEDATA = 'MODIFYNOMINEEDATA';
 
  /** key name for all BBPS Serives */

  key_service_name = 'serviceName';
  key_biller_category = 'category';
  key_biller_location = 'location';
  key_billerid = 'billerid';
  key_biller_customerid = 'customerid';
  key_biller_authenticators = 'authenticators';
  key_cust_firstName = 'firstName';
  key_cust_lastName = 'lastName';
  key_cust_mobile = 'mobile';
  key_cust_email = 'email';
  key_cust_device = 'device';
  Key_recharge_mobNumber = 'mobile';
  Key_circle_name = "circle_name"
  Key_participation_type = "participation_type";
  Key_searchCriteria = "search_criteria";
  key_OSVERSION = "OSVERSION";
  key_OS = "OS";

  /** keys */
  key_localStorage_biometricRegistered = "biometricRegistered";
  key_localStorage_biometricChanged = "biometricChanged";
  key_RequestID = "RequestID";
  val_BENQR = "Y";
  val_localStorage_Y = "Y";
  key_langCode = "langCode";
  
  val_localStorage_N = "N";
  key_debitCardNo = "debitCardNo";
  key_cardPin1 = 'cardPin';
  key_expirtDate = 'expirtDate';
  key_token = "token";
  key_branchCode = "branchCode";
  key_requestRRN = "requestRRN";
  key_ServiceTypeOffer = 'servicetype';
  key_TransactionType = "TransactionType";
  key_TransactionDate = "TransactionDate";
  key_limitName = "limitName";
  key_omni_mmidTransfer = "mmidTransfer";
  key_actionType = "actionType";
  Key_customerId = "customerId";
  key_customerID = "customerID";
  key_MobileNo_Org = "MobileNoOrg";
  key_debitBranchCode = "debitBranchCode";
  key_creditBranchCode = "creditBranchCode";
  key_toAccount = "toAccount";
  key_donationId = "donationId";
  key_linkDelinkData = "linkDelinkData";
  key_otpRequired = 'otpRequired';
  key_omni_accountNo = "accountNo";
  key_serviceLocation = "serviceLocation";
  key_entityId = 'entityId';
  key_cbsType = 'cbsType';
  key_channelType = 'channelType';
  key_mobileAppVersion = 'mobileAppVersion';
  key_deviceId = 'deviceId';
  key_dataType = "dataType";
  key_clientAppVersion = 'clientAppVer';
  key_latitude = 'latitude';
  key_longitude = 'longitute';
  key_prefered_Language = "prefered_Language";
  key_mobPlatform = 'mobPlatform';
  key_requestType = "requestType";
  key_serviceType = "service_Type";
  key_emailId = "emailId";
  key_customerEmail = "customerEmail"
  key_firstName = "firstName";
  key_idNumber = "idNumber";
  key_idType = "idType";
  key_lastName = "lastName";
  key_longitute = "longitute";
  key_mobileNumber = "MobileNo";
  key_sourceIp = "sourceIp";
  Key_username = "username";
  key_oldPassword = "oldPassword"
  key_newPassword = "newPassword";
  key_OLDPIN = "OLD_PIN";
  key_NEWPIN = "NEW_PIN";
  key_Expiry = "Expiry";
  key_typeofPin = "typeofPin";
  key_userId = "userId";
  key_password = 'password';
  key_TPIN = 'TPIN';
  key_cifNumber = "cifNumber";
  key_accountno = 'accountno';
  key_action = "action"
  key_MobileNo = 'MobileNo';
  key_RRN = "RRN";
  key_referenceNumber = 'referenceNumber';
  key_MobileNoOrg = "MobileNoOrg";
  key_omni_customerID = "customerID";
  key_omni_custAccountData = "custAccountData";
  key_omni_emailId = "emailId";
  key_customerType = 'customerType';
  key_appName = 'appName';
  key_userTypeScreen = 'userTypeScreen';
  key_OTP = 'otpCode';
  key_bankName = "bankName";
  key_branch_name = "branch_name";
  key_debitCardIssuedData = "debitCardIssuedData";
  key_configType = "configType";
  key_typeOfRequest = "typeOfRequest";
  key_frequency = "frequency"
  key_minValue = "minValue"
  key_maxValue = "maxValue"
  key_LIMITTYPE_G_C = "LIMITTYPE_G_C"
  key_SET_LIMIT = "SET_LIMIT"
  key_Email = "emailId"
  key_typeOfPin = "typeOfPin";
  key_IBLIMIT = "IBLIMIT";
  key_MOBILELIMIT = "MOBILELIMIT";
  key_WATCHLIMIT = "WATCHLIMIT"
  key_UPILIMIT = "UPILIMIT";
  key_BBPSLIMIT = "BBPSLIMIT";
  Key_type = "type";
  key_omni_methodName = "methodName";
  key_omni_pageName = "pageName";
  key_omni_value = "value";
  key_authFlag = 'authFlag';
  key_base64Image = "base64Image";
  key_subtype = "subtype";
  key_displayName = "displayName";
  key_city = 'city';
  key_CountryCode = "COUNTRYCODE";
  key_StateId = "stateId";
  key_branchID = "branchID";
  key_dateOfBirth = "dateOfBirth";
  key_benificiaryType = 'beneficiaryType';
  key_bankCode = 'bankCode';
  key_beneficiaryMobileNo = "beneficiaryMobileNo";
  key_currency = "currency";
  key_MMID = "MMID";
  key_maxAmount = "maxAmount";
  key_VPA = "VPA";
  key_otp = 'otpCode';
  key_loginip = 'loginip';
  key_UserID = 'UserID';
  Key_moduleName = "moduleName";
  key_menuId = "menuId";
  
  key_methodName = "methodName";
  key_omni_cif = "cif";
  key_isCorporate = 'isCorporate';
  key_omniDashData = "omniDashData";
  key_corporateId = "corporateId";
  key_loginType = 'loginType';
  key_service_Type = "service_Type";
  key_mpin = 'mpin';
  key_MPIN = 'MPIN';
  key_ifsc_code = "ifsc_code";
  key_sender_ifsc_code = "ifscCode"
  key_remarks = "remarks";
  key_swiftCode = "swiftCode";
  key_reqData = "reqData";
  key_accountNumber = "accountNumber";
  key_TransactionAmount = "TransactionAmount";
  key_amount = "amount";
  key_operator = "operator";
  key_sender = "sender";
  key_receiver = "recevier";
  key_crmReferenceNumber = "crmReferenceNumber";
  key_reqType = 'reqType';
  key_ServiceType = 'service_Type';
  key_otpType = "otpType";
  key_aadharNumber = "aadharNumber";
  key_npci_txnId = "txnId";
  key_panUpdateData = "panUpdateData"
  key_aadharUpdateData = "aadharUpdateData"
  Key_customerName = "customerName";
  key_address = "address";
  storage_isUpiRegistrationSuccess = "isUpiRegistrationSuccess";
  key_senderAccount = "senderAccount";
  key_beneficiaryAccount = "beneficiaryAccount";
  key_beneficiary_account_no = "beneficiary_account_no";
  key_txnAmt = "txn_amount";
  key_payerName = "payerName";
  key_payerMobile = "payerMobile";
  key_payerAccount = "payerAccount";
  key_payeeAccount = "payeeAccount";
  key_payeeIfsc = "payeeIfsc";
  key_payeeName = "payeeName";
  key_accountNo = "accountNo";
  key_Status = 'Status';
  key_payeeMobile = "payeeMobile";
  key_payerMMID = "payerMMID";
  key_payeeMMID = "payeeMMID";
  key_senderName = "senderName";
  key_receiverName = "receiverName";
  key_transType = "TransactionType";
  key_benefName = "benefName";
  key_benficiaryBankName = 'beneficiary_bank_name';
  key_benificiaryNickName = 'beneficiary_nick_name';
  key_standingInstructionType = "standingInstructionType";
  key_paymentStartDate = "paymentStartDate";
  key_paymentEndDate = "paymentEndDate ";
  key_paymentFrequency = "paymentFrequency";
  key_paymentFreqType = "paymentFreqType";
  key_numOfInstallment = "numOfInstallment";
  key_year = "year";
  key_month = "month";
  key_type = "type";
  key_date = "date";
  key_transactionLimit = "transactionLimit";
  Key_ID = "ID";
  key_beneficiary_id = "beneficiary_id";
  key_txn_Type = "txn_Type";
  key_themeName = "themeName"; //add key_theme name 
  key_themeSideBarColor = "themeSideColor"; // add key_theam side 
  key_themeSideBackground = "themeSideBackground"; // add key_theam side background 
  key_themeMenuOption = "themeMenuOption"; // add key_theam Menu option 
  key_statusID = "statusId"; // add key_statusId 
  key_EXPIRYDATE = 'EXPIRYDATE';
  key_ExpiryDate = 'ExpiryDate';
  key_cvv = "cvv";
  val_CHANGEMAILID = 'CHANGEMAILID';
  key_bulkChequeInquiryData = "bulkChequeInquiryData";
  key_cheque_Number = "cheque_Number";
  key_chequeInwardInqDetailsData = "chequeInwardInqDetailsData";
  key_customerAddress = "cust_address";
  key_numberOfPages = "numberOfPages";
  key_issunaceOfchqbookData = "issunaceOfchqbookData";
  key_positivePayData = "positivePayData";
  
  key_linkingMobileNumber = "linkingMobileNumber";
  key_existingMobileNumber = "existingMobileNumber";

  /*** Account Mini Statement Service Key ***/
  key_lienInquiryData = "lienInquiryData";
  key_inquiryNomineeData = "inquiryNomineeData"
  key_localStorage_MobileNo = "mobileNo";
  key_subCode = "subCode";
  key_loanMiniStatementData = "loanMiniStatementData";
  key_loanAccountNumber = "loanAccountNumber";
  key_provisionalIntrestcertData = "provisionalIntrestcertData"

  /*** Acount Detailed Statement Keys */
  key_fromAmount = "fromAmount" ;
  key_toAmount = "toAmount";
  key_fromdate = "fromdate";
  key_todate = "todate";
  key_period = "period";
  key_detailedStatementData = "detailedStatementData";
  key_dashboardHeaderData = "dashboardHeaderData";
  key_upi_entityID = "entityID";
  key_upi_mobileNo = "mobileNo";
  key_upi_subAction = "subAction";
  key_upi_inputParam = "inputParam";
  key_upi_appVersion = "appVersion";
  key_upi_deviceID = "deviceID";
  key_upiRequest = "upiRequest";
  key_otpCode = "otpCode";
  key_NotificationID = "NotificationID";
  key_chequeHistoryData = "chequeHistoryData";
  key_noOfLeaves = "noOfLeaves";
  key_reasonCode = "reasonCode";

  /***** FD RD Keys  *****/
  key_tdAccountOpeningData = "tdAccountOpeningData";
  key_noofdays = "noofdays";
  key_userType = "userType";
  key_productFetchDetailsData = "productFetchDetailsData";
  key_productType = "productType";
  key_modeOfOperation = "ModeOfOperation";
  key_schemeType = "SchemeType";
  key_upi_accountType = "accountType";
  key_CONSTITUTION = "CONSTITUTION";
  key_omni_refRecType = "ref_rec_type";
  key_standingInstructionData = "standingInstructionData";
  key_tdClosureValidationdata = "tdClosureValidationdata";
  key_rdClosureValidationData = "rdClosureValidationData";

  /*****NOMINEE KEYS ******/
  key_addNomineeData = "addNomineeData"




  /** storageEncryptKey is used for encryption purpose */
  storageEncryptKey = 'p$b@20#st0mni';

  /** mapEncryptKey is used for encryption purpose */

  sessionEncryptKey = '0mni@P$b#2020';
  mapEncryptKey = 'jrD@Mt6i';
  staticKey = "jrD@Mt6i#0mnip$b";
  languageKey = '@MrN$2Qi8R';
  InvalidSessionCode = "92";
  val_InvalidCredentials = "02"
  upiEncryptKey = "0d097c5eeef2466e";
  langStaticKey = "laN@Jv8k#Omnip$b";
  crmKey = "WsA&tg3q@oil2sD"

  /** Validation pattern start */

  ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9_.]*$/;
  ALPHA_NUMERIC_SPACE_REGEX = /^[a-zA-Z0-9 ]*$/;
  ALPHA_NUMERIC_SPACE_UPI_REGEX = /^[a-zA-Z0-9@. -]*$/;
  ALPHABET_REGEX = /^[a-zA-Z]*$/;
  ALPHABET_SPACE_REGEX = /^[a-zA-Z ]*$/;
  NUMERIC_REGEX = /^[0-9]*$/;
  NUMERIC_SPACE_REGEX = /^[0-9 ]*$/;
  ALPHA_NUMERIC_DOT_REGEX = /^[a-zA-Z0-9_.]*$/;
  email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  /** storage key */
  storage_language = "language";
  storage_languageJson = "languageJson";
  storage_languageVersion = "languageVersion";
  storage_activityVersion = "activityVersion";
  storage_activityJson = "activityJson";
  storage_languageList = "languageList";
  storage_deviceId = "deviceId";
  storage_username = "username";
  storage_mobileNo = "mobileNo";
  storage_omniRegisteredUser = "omniRegisteredUser";
  deviceID = "1";
  defaultLanguageCode = 'en';
  ipAddress = "";

  /**Below are the static messages */
  SERVICE_UNAVAILABLE_MSG = "Service unavailable. Please try after sometime.";
  SERVICE_TIMEOUT_MSG = "Unable to connect to server. Please try after sometime..";
  SERVICE_SERVER_ERROR_MSG = "Internal Server Error";
  SERVICE_UNAUTHORIZED_MSG = "Not Authorized";
  SERVICE_BAD_REQ_MSG = "Bad Request";
  SERVICE_NOT_FOUND_MSG = "Not Found";
  SERVICE_METHOD_NOT_ALLOWED_MSG = "Method not allowed";
  SERVICE_METHOD_UNKNOWN_ERR_MSG = "Unknown Error. Please try after sometime..";

  /** Below are the constants for http status success and error code */
  Status = {
    SUCCESS: 200,
    ERR_CODE_BAD_REQUEST: 401,
    ERR_CODE_UNAUTHORIZED: 401,
    ERR_CODE_FORBIDDEN: 403,
    ERR_CODE_NOT_FOUND: 404,
    ERR_CODE_METHOD_NOT_ALLOWED: 405,
    ERR_CODE_SERVER_ERROR: 500,
    ERR_CODE_SERVER_UNAVAILABLE: 503,
    ERR_CODE_TIMEOUT: 408,
    ERR_CODE_UNKNOWN: 0,
  }

  /** Services name all constants */
  serviceName_LANGUAGEJSONV1 = 'GENERICINFO/GETLANGUAGEDATAV1'
  serviceName_CHECKFORNEWVERSIONONSTORE = 'Version/CHECKFORNEWVERSIONONSTORE';
  serviceName_LANGUAGEJSON = 'GENERICINFO/GETLANGUAGEDATA';//DATA
  serviceName_LANGUAGEJSONLIST = 'Version/LANGUAGEJSON';
  serviceName_CIFACCOUNTMOBILECHECKRETAIL_reg = "REGISTRATION/CIFACCOUNTMOBILECHECKRETAIL"
  //serviceName_Login = 'LOGIN/OMNILOGIN';
  serviceName_Login = 'REGISTRATION/RETAILUSERLOGIN';          // Login service
  serviceName_CUSTOMIZEMENU = 'MENU/USERCUSTOMIZEMENU';
  serviceName_LOGOUT = "Auth/LOGOUT";                         // Logout service
  serviceName_OMNIDASHBOARD = "CONFIG/OMNIDASHBOARD";         // dashboard services
  serviceName_GETOFFERS = "CONFIG/GETOFFERS";
  serviceName_GETCARDSLIST = "CARDINFO/GETCARDSLIST"
  serviceName_FREQUENTTRANS = "TRANSACTION/FREQUENTTRANS";
  serviceNmae_GETFAVORITETRANSACTIONS = "TRANSACTION/GETFAVORITETRANSACTIONS"
  serviceName_INVESTMENTPRODUCT = "CONFIG/GETINVESTMENTPRODUCTS";
  serviceName_RECOMMENDEDCARDS = "CONFIG/RECOMMENDEDCARDS";
  serviceName_BALANCEENQUIRY = "Balance/BALANCEENQUIRY";
  serviceName_SETUPDATEPIN_reg = 'OMNIREGISTRATION/SETUPDATEPIN';
  serviceName_TRANSACTIONHISTORY = "ACCTINFO/TRANSACTIONHISTORY";
  serviceName_VALIDATEDEBITCARD = 'CARDINFO/VALIDATEDEBITCARD';
  serviceName_VERFYCREDNTIALS = "PRELOGIN/VERFYCREDNTIALS";
  serviceName_VALIDATEBANKTOKEN_reg = "OMNIREGISTRATION/VALIDATEBANKTOKEN";
  serviceName_VERFYCREDNTIALS_reg = "OMNIREGISTRATION/VERFYCREDNTIALS";
  serviceName_VALIDATETOKEN_reg = "OMNIREGISTRATION/VALIDATETOKEN";
  serviceName_UPDATELOGINDETAILS_reg = "OMNIREGISTRATION/UPDATELOGINDETAILS";
  serviceName_CHECKOMNIUSERNAME_reg = "OMNIREGISTRATION/CHECKUSERNAME";
  serviceName_AUTOLINKACCOUNTS_reg = 'OMNIREGISTRATION/AUTOLINKACCOUNTS';
  serviceName_UPDATEREGISTRATIONSTATUS_reg = "OMNIREGISTRATION/UPDATEREGISTRATIONSTATUS";
  serviceName_GETIMPSMASTERBYIFSC = 'IMPSService/GETIMPSMASTERBYIFSC';
  serviceName_ACCOUNTNAME = "ACCOUNTS/ACCOUNTNAME";
  serviceName_TRANSFERTRANSACTION = "TRANSACTION/TRANSFERTRANSACTION";
  serviceName_PAYERTOPAYEEUSINGIFSCACCOUNTNUMBER = "IMPSService/PAYERTOPAYEEUSINGIFSCACCOUNTNUMBER";
  serviceName_RESENDOTP = 'OTP/RESENDOTP';
  serviceName_RESENDOTPSESSION = "OTP/RESENDOTPSESSION";
  serviceName_VALIDATEOTP = "OTP/VALIDATEOTP";    //otp services
  serviceName_FreezeAccount = "CONFIG/FREEZACCOUNT";
  serviceName_CUSTPROFILEDETAILS = "LOGINENQUIRY/CUSTPROFILEDETAILS";    // profile details service
  serviceName_CUSTPROFILEIMGUPDATE = "LOGINENQUIRY/CUSTPROFILEIMGUPDATE";
  serviceName_UPDATETOKENFORCUSTOMER = "CONFIG/UPDATETOKENFORCUSTOMER";
  serviceName_ADDLIMITMASTERDETAILS = "LimitMaster/ADDLIMITMASTERDETAILS";
  serviceName_RESENDLEADSOTPSESSION = "OTP/RESENDLEADSOTPSESSION";
  serviceName_VALIDATELEADSOTPSESSION = "OTP/VALIDATELEADSOTPSESSION";
  serviceName_EMAILREGISTRATIONCUSTOMER = "REGISTRATION/EMAILREGISTRATIONCUSTOMER"
  serviceName_VALIDATEOTPSESSION = "OTP/VALIDATEOTPSESSION";
  serviceName_VERIFYPIN = "Auth/VERIFYPIN";
  serviceName_LINKDELINKFETCHACCOUNT = "ACCTINFO/LINKDELINKFETCHACCOUNT";
  serviceName_ADDLIMITS = "LimitMaster/ADDLIMITS";
  serviceName_GETCUSTREKYCSTATUS = "CUSTREKYCCHECK/GETCUSTREKYCSTATUS";
  serviceName_RECORDCUSTREKYCSTATUS = "CUSTREKYCCHECK/RECORDCUSTREKYCSTATUS";
  serviceName_CUSTPROFILEUPDATE = "LOGINENQUIRY/CUSTPROFILEUPDATE";
  serviceName_AADHARUPDATE = "REGISTRATION/AADHARUPDATE";
  serviceName_PANUPDATE = "REGISTRATION/PANUPDATE";
  serviceName_UIDAIOTPGENERATE = 'REGISTRATION/UIDAIOTPGENERATE';
  serviceName_UIDAIKYCDETAILS = "REGISTRATION/UIDAIKYCDETAILS";
  serviceName_INTERNETBANKPASSCHANGE = "CUSTREQINFO/INTERNETBANKPASSCHANGE";
  serviceName_CHANGEPINS = "LOGIN/CHANGEPINS";
  serviceName_VALIDATEBANKTOKEN = "PRELOGIN/VALIDATEBANKTOKEN";
  serviceName_VERIFYBANKTOKEN = "PRELOGIN/VERFYCYBANKTOKEN";
  serviceName_LOGINVALIDATETOKEN = "LOGINENQUIRY/VALIDATETOKEN";
  serviceName_FORGOTUSERNAME = "PRELOGIN/FORGOTUSERNAME";
  serviceName_UPDATECUSTOMERTHEME = "CUSTOTHERINFO/UPDATECUSTOMERTHEME";
  serviceName_THEMESLIST = "THEMES/THEMESLIST";

  
  serviceName_VALIDATEUSERNAMEPWD = "PRELOGIN/VALIDATEUSERNAMEPWD";
  serviceName_DONATIONLIST = "LOGINENQUIRY/DONATIONLIST";

  serviceName_BENIFICIARYLIST = "TRANSACTION/BENEFICIARYLIST";
  serviceName_SCHEDULARTRANSMASTER = "STANDINGINSTRUCTION/SCHEDULARTRANSMASTER";
  serviceName_ACCOUNTINQUIRY = "CONFIG/ACCOUNTINQUIRY";

  /** Services name for all CRM Serives */
  serviceName_CALLBACK = 'CallBackReq'
  serviceName_INSTACCLEAD = 'InstantAcctLead'
  serviceName_NRIACCTLEAD = 'NRIAcctLead'


  
  serviceName_GETCONTACTUSLIST = "PRELOGIN/GETCONTACTUSLIST";
  serviceName_CALLUSBACK = "CALLBACK/CALLUSBACK";


  serviceName_DEBITCARDISSUE = "CARDINFO/DEBITCARDISSUE";
  serviceName_DEBITCARDMODIFY = "CARDINFO/DEBITCARDMODIFY";
  serviceName_DEBITCARDREISSUE = "CARDINFO/DEBITCARDREISSUE";
  serviceName_GETOMNICHANNELREQ = "TRANSACTION/GETOMNICHANNELREQ";
  /**Insta pay service end Points */
  serviceName_BALANCEINQUIRY = "TRANSACTION/BALANCEINQUIRY";
  serviceName_NAMEINQUIRYACCOUNTIFSC = "IMPSService/NAMEINQUIRYACCOUNTIFSC";
  serviceName_NAMEINQUIRYMMID = "IMPSService/NAMEINQUIRYMMID";
  serviceName_MMID = "IMPSService/PAYERTOPAYEEUSINGMMIDANDMOBILE";
  serviceName_GETBRANCHLISTBYBRANCHBANK = 'IMPSService/GETBRANCHLISTBYBRANCHBANK';
  
  /*** MY ACCOUNT SERVICE ****/
  serviceName_INTERESTCERTFORDEPOSITANDSAVING = "CERTIFICATES/INTERESTCERTFORDEPOSITANDSAVING";
  serviceName_LIENACCOUNTENQUIRY = "Loan/LIENACCOUNTENQUIRY";
  serviceName_DEPOSITACCOUNTINQUIRY = "DEPOSITEINFO/DEPOSITACCOUNTINQUIRY";
  serviceName_GETACCOUNTSCHEMEDETAILS = "ACCTINFO/GETACCOUNTSCHEMEDETAILS";
  serviceName_LINKDELINKACCOUNTS = "ACCTINFO/LINKDELINKACCOUNTS" ;
  serviceName_MINISTATEMENT = "TRANSACTION/MINISTATEMENT";
  serviceName_CASHCREDITACCOUNTINQUIRY = "ACCTINFO/CASHCREDITACCOUNTINQUIRY";
  serviceName_LOANMINISTATEMENT = "Loan/LOANMINISTATEMENT";
  serviceName_GENERATEMMID = "IMPSService/GENERATEMMID";
  serviceName_CANCLEMMID = "IMPSService/CANCLEMMID";
  serviceName_ISSUEBALANCECERTIFICATE = "CERTIFICATES/ISSUEBALANCECERTIFICATE";
  serviceName_InquiryNomineeValidation = "CONFIG/INQUIRYNOMINEEVALIDATION";
  serviceName_GETRECOMMENDEDOFFERS = "Loan/GETRECOMMENDEDOFFERS";
  serviceName_GETREPAYMENTSTATUS = "Loan/GETREPAYMENTSTATUS";
  serviceName_PROVISIONALINTERESTCERT = "CERTIFICATES/PROVISIONALINTERESTCERT"
  serviceName_LAIRACCOUNTINQUIRY = "Loan/LAIRACCOUNTINQUIRY";
  serviceName_LOANINTERESTCERTIFICATE = "Loan/LOANINTERESTCERTIFICATE";
  serviceName_TDCLOSUREVALIDATION = "DEPOSITEINFO/TDCLOSUREVALIDATION";

  /***NOMINEE SERVICE ******/
  serviceName_ADDNOMINEEDATA = "CUSTREQINFO/ADDNOMINEEDATA";

/*** DETAILED STATEMENT*** */
serviceName_DASHBOARDHEADER = 'CONFIG/DASHBOARDHEADER';
serviceName_DETAILEDSTATEMENT = "CUSTREQINFO/DETAILEDSTATEMENT";

serviceName_LOANACCOUNTINQUIRY = "Loan/LOANACCOUNTINQUIRY";

/***** FD RD  ******/
serviceName_TDACCOUNTOPENING = "ACCOUNTS/TDACCOUNTOPENING";
serviceName_GETFDRDMATURITYRATES = "CBSDBDATAINOMNI/GETFDRDMATURITYRATES";
serviceName_GETFDRDDETAILS = "TDFDRD/GETFDRDDETAILS";
serviceName_RDCLOSUREVALIDATION = "DEPOSITEINFO/RDCLOSUREVALIDATION";
serviceName_GETREFCODE = "BRANCHDATAMASTER/GETREFCODE";
serviceName_GETSTATES = "PRELOGIN/GETSTATES";
serviceName_GETCITIES = "PRELOGIN/GETCITIES";
serviceName_ADDSTANDINGINSTRUCTION = "ACCTINFO/ADDSTANDINGINSTRUCTION";



  /* Send Money */
  serviceName_CERTIFICATECONFIGS = "CERTIFICATES/CERTIFICATECONFIGS";
  /* service get state for location add */
  serviceName_GETSTATEFORLOCATIONS = "PRELOGIN/GETSTATEFORLOCATIONS";
  serviceName_LOCATEUS = "PRELOGIN/LOCATEUS";

  //manage payee 
  serviceName_DELETEBENEFICIARY = "TRANSACTION/DELETEBENEFICIARY";
  serviceNmae_ADDFAVORITETRANSACTIONS = "TRANSACTION/ADDFAVORITETRANSACTIONS";
  serviceNmae_DELETEFAVORITETRANSACTIONS = "TRANSACTION/DELETEFAVORITETRANSACTIONS";

  /** Add Edit payee */

  serviceName_GETINFOBYSWIFT = "GENERICINFO/GETINFOBYSWIFT";
  serviceName_ADDBENEFICIARY = "TRANSACTION/ADDBENEFICIARY";
  serviceName_UPDATEBENEFICIARYTRANSACTIONLIMIT = "TRANSACTION/UPDATEBENEFICIARYTRANSACTIONLIMIT";

  /** More services */
  serviceName_EASE5_MORE_SUB_LIST = "EASE5/EASE5_MORE_SUB_LIST";
  serviceName_EASE5_MORE_LIST = "EASE5/EASE5_MORE_LIST";
  
  /** Forgot Password */
  serviceName_FORGOTPASSWORD = "OMNIREGISTRATION/FORGOTPASSWORD";
  serviceName_GETMASKFORMATTEDDETAILS = "PRELOGIN/GETMASKFORMATTEDDETAILS";
  serviceName_VALIDATECHANNELSPRELOGINOTP = "OTP/VALIDATECHANNELSPRELOGINOTP";
  serviceName_RESENDLEADSOTP = "OTP/RESENDLEADSOTP";
  /** Notification service by SK */
  serviceName_NOTIFICATIONSTATUSUPDATE = "Notification/NOTIFICATIONSTATUSUPDATE";
  serviceName_NOTIFICATIONS = "Notification/NOTIFICATIONS";
  serviceName_SETUPDATEPIN = "Auth/SETUPDATEPIN";

  /** cheque-book */
  serviceName_CHEQUESTATUSINQUIRY = "CUSTREQINFO/CHEQUESTATUSINQUIRY";
  serviceName_BULKCHEQUEINQUIRY = "CUSTREQINFO/BULKCHEQUEINQUIRY";
  serviceName_CHEQUEHISTORYDETAILS = "CUSTREQINFO/CHEQUEHISTORYDETAILS";
  serviceName_INWARDCHEQUEINQUIRY = "CUSTREQINFO/CHEQUEINWARTINQUIRY";
  serviceName_ISSUECHEQUEBOOK = "CUSTREQINFO/ISSUECHEQUEBOOK";
  serviceName_GETADDRESSOFCHQBOOK = "CUSTREQINFO/GETADDRESSOFCHQBOOK";
  serviceName_POSITIVEPAY = "TRANSACTION/POSITIVEPAY";
  serviceName_PRODUCTLIST = 'ServiceReq/PRODUCTLIST';
  serviceName_STOPCHEQUEPAYMENT = "CUSTREQINFO/STOPCHEQUEPAYMENT";
  serviceName_BULKCHEQUESTOPPAYMENT = "CUSTREQINFO/BULKCHEQUESTOPPAYMENT";
  serviceNmae_CHEQUESTOPPAYMENT = "CUSTREQINFO/CHEQUESTOPPAYMENT";

  /** link delink */
  serviceName_AUTOLINKACCOUNTS = 'ACCTINFO/AUTOLINKACCOUNTS';
  serviceName_RESENDCHANNELOTPSESSION = "OTP/RESENDCHANNELOTPSESSION";
  serviceName_VALIDATECHANNELOTPSESSION = "OTP/VALIDATECHANNELOTPSESSION";

  /**freeze account  */
  serviceName_FREEZACCOUNTCIF = "CONFIG/FREEZACCOUNTCIF";

  //////////////////////////////////BBPS SERVICES////////////////////////////////////
  serviceName_BBPSSERVICES = "BBPSDetails/GETBBPSDATA"
  serviceName_RetrieveBillService = "RetrieveBillsListService"
  serviceName_RetrieveOneViewService = "RetrieveOneViewService"
  serviceName_GetBillersByIdsService = "GetBillersByIdsService"
  serviceName_GetBillerListService = "GetBillerListService"
  serviceName_ValidatePaymentService = "ValidatePaymentService"
  serviceName_ValidatePaymentServiceJIOBSNL = "ValidatePaymentJioBsnlPreService"
  serviceName_GetBillerLocationService = "GetBillerLocationService"
  serviceName_RetrieveOperatorDetails = "RetrieveOperatorDetails"
  serviceName_RetrieveRechargePlans = "RetrieveRechargePlans"
  serviceName_CreateBillerAccountWithoutAutopayService = "CreateBillerAccountWithoutAutopayService"
  serviceName_GetComplaintType = "GetComplaintType"
  serviceName_GetParticipationType = "GetParticipationType"
  serviceName_GetCategories = "GetCategories"
  serviceName_GetComplaintReasons = "GetComplaintReasons"
  serviceName_RetrieveRecentTransactions = "RetrieveRecentTransactions"
  serviceName_GetComplaintDisposition = "GetComplaintDisposition"
  serviceName_SearchBillerListService = "SearchBillerListService"
  serviceName_GetRechargeCircleNameAndId = "GetRechargeCircleNameAndId"
  serviceName_DeleteBillerAccountService = "DeleteBillerAccountService";
  serviceName_ModifyBillerAccountShortNameService = "ModifyBillerAccountShortNameService";
  serviceName_RetrieveComplaintService = "RetrieveComplaintService"
  serviceName_RaiseComplaintService = "RaiseComplaintService"
  serviceName_MakePaymentService = "MakePaymentService"
  serviceName_RetrieveBillService2 = "RetrieveBillService"
  serviceName_BillerAlertsService = "BillerAlertsService"
  serviceName_GetBillerListByCategoriesService = "GetBillerListByCategoriesService"
  serviceName_BBPSADDREMINDER = "BBPSReminders/BBPSADDREMINDER"
  serviceName_GETBBPSREMINDERSLIST = "BBPSReminders/GETBBPSREMINDERSLIST"
  serviceName_BBPSUPDATEREMINDER = "BBPSReminders/BBPSUPDATEREMINDER"
  serviceName_BBPSDELETEREMINDER = "BBPSReminders/BBPSDELETEREMINDER"

  serviceName_GetpoolAcc = "CONFIG/getconfig"
  /** UPI service by SK  */
  upiserviceName_GETAPPNOTIFICATION = "GetAppNotification";



  bbpsPoolAcc = "03855039095001"




  /** storage key */
  storage_isMBUser = "isMBUser";
  storage_mmid = "mmid"

   //CRM TOKEN
   crm_TOKEN = "JSBP2346543"


  getEntityId(key?: any) {
    console.log("getEntityId key => ", key);
    //return this.val_entityIDMob;
    if (window.hasOwnProperty('cordova')) {
      if (device.platform.toLowerCase() == this.val_android || device.platform.toLowerCase() == this.val_ios) {
        return this.val_entityIDMob;
      } else {
        return "";
      }
    } else {
      return this.val_entityIDDesk;
    }
  }

  getPlatform() {
    if (window.hasOwnProperty('cordova')) {
      return device.platform.toLowerCase();
    } else {
      return "web";
    }
    // return "web";
  }
  
  
  //TODO : CHANGE ACCORDING TO PJSB PRODUCT
  psbNewLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3QAAAD7CAYAAAAintYrAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAADdKADAAQAAAABAAAA+wAAAACi8gilAABAAElEQVR4Aey9XbBV1ZnvPVFBZYOw0YDBD1CDB+iKQDUkHTtV4Em0qpNUuclb/Z6Ltxvw9iSpkLuOqbc0lUrineRNPLei9lV3VYNVx5yqaDpYlZC00CWYitAxKmhAQWWDsP0AIu/4zc2z9thjz48x55pr7bXW/j9Ve8+55hyf/zHmnM9/PM8YY1bygy9eSiRCQAgIASEgBISAEBACQkAICAEh0F8IXPHJuiv6q8QqrRAQAkJACAgBISAEhIAQEAJCQAgYAiJ0hoSOQkAICAEhIASEgBAQAkJACAiBPkPgqj4rr4orBISAEBACfYbA8qGPk42fOpOsXXAuWTs81ir96fNXJXveWZA8ffz65MjY1a3rOhECQkAICAEhIATiEZilOXTxYCmkEBACQkAIxCOwdfnJZPuKY8nahRMkLi/2wy/fmnz/D7fm3dZ1ISAEhIAQEAJCIAsBN4dOFrosYHRNCAgBISAEaiMwctN7yaNrXk+WD30UncbDq99wFryxZPPeVdFxFFAICAEhIASEgBBIEhE69QIhIASEgBBoBIGFcy6mRG7b8hNT0nv62PXJnncXJAdGh1r3CL/9M8eTjYvPpNcggo9veCV5YN+KVhidCAEhIASEgBAQAsUIiNAV46O7QkAICAEhEIEA5OxXG38/yb3yzIWrkh1/XJrs+NPShPlyWbLbEb1tzjXz8Q1/TG9DBp8+vijhukQICAEhIASEgBAoRyD7C1seTyGEgBAQAkJACKQIZJE5LHLb9q/IJXI+dDuPLE5/GqnDXVOEzkdI50JACAgBISAE8hHQtgX52OiOEBACQkAIRCCw6+5Dkyxz3zl4ezLi5sLlWeWykoTUQQIR5t5htZMIASEgBISAEBAC5QiI0JVjpBBCQAgIASGQg8COta8lm9yWBCYP7LszdbO031WO2x0RNHnILZIiEQJCQAgIASEgBMoREKErx0ghhIAQEAJCIAMBFjH59orjrTuQOXOfbF2scMJedAdPjy+agpUuZruDCskrqBAQAkJACAiBgURAhG4gm1WVEgJCQAh0FgHmzT2+/pVWJk84l8l2yJwltPPoEjtNNl1e/bJ1QSdCQAgIASEgBITAFAS0KMoUSHRBCAgBITAzEbDtA3ChPDJ2TWotO3DZYhYiApmD1CFY1bY561wTsufkglYyI59+r7b7ZisRnQgBISAEhIAQGHAEROgGvIFVPSEgBIRAEQK4NeI2ObL0vRZB88ND7L5z8LZJq05C+HC3NBnZu9pO2z5CIGf96xcnpQNxrLLAyqTIPfCD8q9xOEN8+7kePQBlqwi91Cd6qSwtgDp4snzo42SZc4lWf+4gyEpaCFREQISuImAKLgSEgBAYFAQe+qs3kodLFh9hLhurWLKfHKtXImz+bfL9P9zqrHlX28/GjpDGlGh6xHHPOwuS7xy4PcmzGjaWeUMJQZYfDRaNoezff/nWSQS5oewGPhkGEVgsx59bufPIknTAodtEmTJQFn9go9/6Z9UOo/5cFTGFFwLdQ2BW8oMvXupedspJCAgBISAEegEBVqf0FzShTGwbYGQJIgepWuZG400gdAuvuphABJGjjsgt//kGu93Y0d9oPCvRe/Z8NkF57mVB+WWjdaw3WQIReWDfiqxbupaBAIMIbDqfJZC5dc+t68jAQlZ+Zf1zs9uyY9D2UVR/zuoJuiYEegSBKz5ZJ0LXI22hYggBISAEuoUAVgWsbiZFm4Bvv/N4asVbMHucmKA8G0nphOIKifzVpt9b0dLjmQtXJZY/F3ADve3n6yeF6bUfL9774iRLUlb5IMhYPiXFCGBFtkEECxn2CRblaWoep+WRdYzpnzwjt/2f9QPlXvv6V/an+0NmYWLX2l3l1tLRUQgIgYoIOEKnVS4rYqbgQkAICIF+R+DRNa+3qvC8W4SkaBNwCMc2z5JkZI54nbBCnHbkzbYu4Dj89N8kC3f/TbLu2XWtMpv1sHWhx06wZvBnAmG+zVkyqcNPXhkncNTNXwDGwuo4FYEDZ4YSCBwCcWOOJX3CXIC5vrVLG9HTP+n7SNg/rYw8IxC/QRH6Ms+cCW1Af8ZSzjkCFmbdt3A6CgEh0D0ENIeue1grJyEgBITAtCOAoukrZw+7+VxlAnGDlCy8bKUjfEy8snSz7qMUrnXEB8sg+drcKK6jSNtKnGuHx3rW7dLHiTqyYfr4PMOrk+3pHMB5jWzxkIXfIF6jHyx3LrbbP+OsxV5/ZbDh0TWvtapM3+60Ky79cNPzn03754HRiUVuuM7vVv9cMNaRAY9WZbt4ktWfeS7p0+C9+/j1A1PXLsKqrIRAowiI0DUKpxITAkJACPQ2Av4iDqmVKHIuGla8bkqZKyJz+fpFwkVjmtivr1/q3lQ5IRA+mWsq3brplPXPuun2ejyskDbIYmXthKXe0tZRCAiBOATkchmHk0IJASEgBAYCgbXOcmDSaWuG5aOjEBACg4EAVkiJEBACvYeAFkXpvTZRiYSAEBACuQjgVsZ8obULz7XmaUHM+HvCrZwYWoNIaI9bbdFcwXITrnkj3DMuK5lLf//rrMvR19gaAQkXxvATIEyRBadJDJg7xEIdWZjiFopLXl6dDa+8+36dss6J32RdLA+bF5ZVJwtTdixrA/puuOBNWZp594vawOIUrYbaZFma6J91+4PVtVNH+gXvlrxnr93+TLmL2qlT9VK6QmCgEHCLosjlcqBaVJURAkJgkBHIW7od5ZQ/SAakxhTMQcZCdRMCQkAICAEhIATGERChU08QAkJACPQBAuwbF+7DxRw4ZI23oiKkbpbbXdS3VrFKoIlvgSF+OB/GwoXHuvFIx1/MhN95+bI6oF8Xsxod+eAaoqUrHdr2BeyBx/YFJhbGfodHH4PwXt7vvDqz0uGRD65ONl6OyLwic0UjH1sJlNv+PT8fq5t/zT/Py5swZXVhwZg8nPLulaVpZWNBHdubMKxbWRv4K0RaemXHPBxIizLn3SddwuRJnbLkYWf1Bo883C1MXnnK+kNWvLXD51x+f0lv+c/DZ+Z9mLz90Zzk3MUrs6JlXvNx9NsVjE9fnMDRv+cnVFZ+P/3w+S9qJz8PnQsBIZCPgFwu87HRHSEgBIRAzyAwev/vWkSBpcJZOdEnY6wK6a/4x7LiWe6XvmtXFVcnP565WVUBZ7fb9+5+t/8dQvmz9gwL3eDCfHxXwzL3viplywvr1znEyi8ryixuliZF9yxM2bEo77K4RTgV3StLl/v+nnBhvWPiVw1ThkPZ/ar5FYX39xbM6n/tYluUd9a9JvM74PZNtMGUsF2nuz9n1V3XhIAQ8BCQy6UHhk6FgBAQAj2KAAqVWX0Yic8iQ6y6x8qPNteF1SybWonP8m4HHiyGRuiYAxgS0nbSrhKXPbUox/K5H0/avqFKGgo7mAjQNxY4KzGSZXHy9xbsBgLL536UPs/k2+m8zdJHvWQx60brKg8h0CwCE3b0ZtNVakJACAgBIdAQAr47HIoXBMu3zlk2NsLO7yaX9R9ZesqyyFR0WzcLTtinC1crKyMktdvLnefNQSwodk/eov23LjvZIvlhIc0lMrzeS7+XD33sFvc5kc79pF+wP990ybdXHE+2uz9/f0bKstMtMvR9NxCBpZvy+uK7IfrXmzpn0aNfucWMFs4Zd6lsKt2sdKibX3f2lZMIASHQXwiI0PVXe6m0QkAIzEAEIG9YDJiHgjL/4pcPJDteWdqaS8VWBFkKaRZUlg73YixvhPn2imOtpHa/VV/ZY7U8I3SUuZuEDgIZzkFsVaqPTmgPFP1OWGxIG6Lo71UYQoNls13Z5iy0j2/4YysZ5nxOlxSRfPrLyNL3knucO22It82Z7FS5d6x5vW0yZ+3pW/gpL8/dE0cXtwaF/LbAA2D38UWdqpbSFQJCoEMIiNB1CFglKwSEgBBoEoFt++9MmOfCoguMprNISh3x3anud5a30YKFI1DetzsyZ8osCyK0sym2b1XE7fLSrMk1aIIsTE5x4hdKrQn12H1s0aRFVexe3rFsUYu8eOF1sNzl5hP6FhHCZM3JCuPyGzJk7ZF1v51rlMvHqZ208uKSvk8g8sJ14zrzAX2S7y/4YYt4QIqYO+cvwEPZGJzolOBqafmTByQLa2FRnlnzZXeuf6Xl5uyXlTbg/UF6oesx7tz+c+rHyzpvtz9npalrQkAIVEdgoAgdCwKsvu6D6igoxrQj8P/+YVnywqn5014OFUAI9CoCqdvXz9cnO9x7DjIUCsro6fNXtlYg9N00/bB73l3QUvJQZn2F1g+Xdb5t34pKyl5WGnYNQoNC3S3xiQr16KZ10K8jdQ7JnH+/7Hzk0+MLy1i4nzhLbaiA06ZV3S5RzH2MLP2mj1iSQ8Fq29T+dGHaRb9xtTTB7ZOFbQxL3BB33/1yy6Lst9nTzsLVSfHdO89cuDJZ++y6WvPaNjmLfpGE7f2AI3NFpDErrXb7c1aauiYEhEB1BAaK0H1+0dnkCzecrY6CYkw7Av/fn5ZOexlUACHQ6wigbDKC/vDLy1K3OJsnx3weLGe7v3CopcibYhrWaY9z3awqthBLVWWvaj6dDO8vcW+WyayFLzpZBtJe6CysTQlkLmvuGYp6VUIXlguCk0V6Sdu3HlWtiy2M48fDChaSC/9+J84hsORrElqmGECB4LGSpLkJW9idzl2xW3JgdN4UMgdWeKnyXBZZjlmIyF/5tqzMD7nBBua68hcrYb+JjadwQkAINIvAQBG6ZqFRakJACAiB3kQAZTNrBUtf8cyz0KGsoQiawp8qhd5+btQYa4Td5zcLseSlx/1Y8a0c5IsbmS/cz7I++mHqnh84Pa8VtaplEuLnb0vQSqjGie/ySvRwa4ayJP397/JIe1kaWffDckHm/L0MLQ4WmXYInaUz3ceQiIT1p3zgu+OVmya5iNJvs4huk/Xx3SeXuWcCobwQLvquv1AKrsNY1rLKzzuCsjIn0gZ/SItnGRdS3gXco015d/D84Q67zlkE60rV/lw3H8UTAkJgMgIidJPx0C8hIASEQN8i4FscipR9iJRtb3ApmZVJVrBg7HTKHYoe6eLqmbVdQhWwsIyZoFCGhAHLQ6cIHRZM5gP6pNfKUueItbKO8uq7vJIv7nW+Al9Wlj3vLGxhhLUrxLAsft59lHvcdm1jbJ9858Wpc539/BCIibV10SqXnXLFDAco6BuhtZN+D4nyxV/e37/e5DlWNxt0oX9AslicxSdylt/ITafc9UOJ4WrX7Zg3+GP3IXwMdrz+lX3pJXO9jbXGs0iST/Cr9mcrh45CQAi0h8AV7UVXbCEgBISAEOg3BHYeXZIq75QbxZ1NyUNBwffJginfYbjY36mVwHNxy7IoxKZVNxxWNjY1n06BWEKcTKq4xBHHX4EQ5btoRUrLI/boW31pb9JvWiAK/PmLjDD4YNfDY9P5W3rk6fcF5tOx4iXkhD/IMquJhsQWksfCNJ0W33pNfkbmIHosoIO7LfPrEAZC2ObAhOf59a/sj26/KgMKlocdQ2tlSIAtnI5CQAh0FoGJr0pn81HqfYLAiX1XJ2PHrkzOHRvvGqOHZifn3x/n/cMrLyTrHzzdJzVRMYWAEMhDwEbtzUoHqUDBDVewLLLy5aWdd91fgIIwEMZuC/XBysim5um2CX97qGWRojztuJrF1oUyQJwMewgZROI7B29rLchRlBbxUeYNz8fdSobmPlcUL+beDjeXGTJgVjoIzea9qyovlBGTVy+EoR9g4bL6FrnimsWMcrONR/isNF0ftiXZfucxV7aJfei+c+C21AXUz8v6AaTO3IrZUgEiGtt+IUGtMtjCuwSCaf0ZDJHY/uzXRedCQAjUR0CErj52AxHzzV9em7z53LXJ6OHZyeihOYV1ujSNewUVFkw3hYAQqIwA1jfIhLkg4ta10SmFkAXIDZYI3yrnW5WqZmZuXH686dy8GFKEJQgMzEJGGVm2n42kfbKJCxkbYKO0NiXkS362QAhKMC51YMIcOd96RZ6hgp22nQvPPEfaCcWda+wtBlH1XeCKFs0I6wMum5xLJMv0I2nam36f4pGWzbnJ+mmH5QrT6/Xf1JcVJHeud30/Z0VI+j2roiL0D4S267RrIdgy+GB5ki/kjW1GnnAu08yp43k18duZvo31kecXl1WsaCzkkrU6J2HsGSAt6uv3f0u/6Ejfg1AahtafIb0s2ATOvoTurv49nQsBIVAPgclPWb00FKvPEDh/dlZy+Mn5yaEn5icXLlvf+qwKKq4QEAIZCKCwGUnA0uK70GUEn7KKX5GFoiytrPTzrjFnqqrSmJdWO9epE3t+mZUDgmsujCjFkCNIDYuifL+djDLibtu/Itnprlt7kY9ZN/zgWQo2CvLI3tXJHqesY10iLvuKZe1NWBVnwmOV2+mshma5gsDwFwrzAftdsDDhigshoe1pcxPmh6WkxOENxr4Qtslnwk/bziFiD7ywInn8c6+klyCRtAt/vuB6Ga5ea/NdIWx+v6Z9jYhb//bTqlunkd+uSlfZNVIHXlmu3PTnkOD5+etcCAiBegiI0NXDrW9jHX5yXnLwZwtE5Pq2BVVwIZCPAG5aRhAYdd94w5lUOc+LgWKFMssqd0ZqssJCaBiFrysokVi4UCyzFkOBiGApHG5wSf/YsrIQBuSNRV/8lT1R8E2437SMk7JVqdIL/kaewnzyFGwwxZpmC9eE8fht1tase0XXIBJr3UIZZZarTrsdFpWx6Xu0cVE7016+2+XaBRNz1pouC9Y3rMLMm3vi9cXpgie0s98//Ty3v3h7i6T51yF1WFb9vp1FzC0OVr26z7n/LvHddi1tO4YLz9h1HYWAEGgPARG69vDrm9hY5Z7/xg3JiReu6Zsyq6BCQAhUQwCFlCXMIUgQhNsuL3lelAqKGEoWy7Oz0p+N2nOdkXwUwiYUdxTFLGURCwKrX9riE1jvyLubAoHhD8IJkfOtNLiHsYhMFQE32+OuzL0Mwga+zGPa5Ai4LaeP6yULYxSRDEgdLoOpBca5YC6f+3FazKK4fnl8N72wfkWWK8rEfLt22om8YzCyMJTPLEthWbv1m2fB+kYny8Lzy3OBbP/MseS2n29Ilru/bctOJGwWbu1MW9J/itrR79u49ULozM2a9M1aXtTXqvRnnnH6Rp3+THkkQkAI1ENgVvKDLw7MzKi99xzUxuIZ/YD5cb/Ysrhtq9ziDR8l9z31TkYO7V/62q9XJ8+8taj9hJSCEBACfYMASh9z93yBJKAQYl1qhzD4ac6Uc9zdfAKUV2/c4SAFEEITFH3/t13POlYJmxVf14oROOK2EPCtcWxJUETsi1PTXSEgBAYegSs+WdfdYdCBR7T3KtgUmeu9mqlEQkAI9DsCzF8LBbKBCyLWBKyNsSQjTGcm/t7jFkeBBGO5YaVDFqTwBRLH8vYQMoifv1k6bnkQQogDbrFY+XxhY+q1w2OpBTOM64fTefsIYAk0F2jcPEXm2sdUKQiBQUdg8tt+0Gs7w+onMjfDGlzVFQJ9hoDv/kfRWdSFeYAQB0gdqzfe4+b4idTFNyyEGLdRfw5gfOzxPc0Sb/5glbgK2wwCuECPbz3wcfo8NJOqUhECQmCQERChG9DWZc5cE26WAwqPqiUEhEAPIMD8HlZU3LbsZErabF4WFgnmle10e6xB6m77P+vlfhnRXrjmGZmD2PlzpYiOZQ3L2553Fk7aoJx77MnG/Cybx2erFXIPIS5zqVjZknaTdBaBqvM2O1sapS4EhECvIyBC1+stVLN8zzYwZ65m1oomBISAEIhGwBZtCCPgOjgC2XPz7CB2nEuKEYAI13XPww3zRTenLm9VTcsZogdp3Dm22C7pKASEgBAQAtOMgAjdNDdAJ7Lf+91FpZuEdyJfpSkEhIAQaBoBLHV1SUrTZRnk9FhB0axyuLiGqziy+iakD8Fa18TKp4OMp+omBISAEOgmAiJ03US7C3m9+ctrk9d2Taxc1oUslYUQEAJCoKMIsIS+pHsIGHHLyzEke3nhdF0ICAEhIAS6g4AIXXdw7kouY8euTLDOSYSAEBACQkAIVEGAFS9xpWRBGlYftf3WLA0WsGG/sz3OOqdFagwVHYWAEBACvYGACF1vtEMjpTj0xPy295prpCBKRAgIASEgBPoOgXbm4PVdZVVgISAEhMAAISBCNyCNiXXu8JPzG6vNzV/6MFm08nwyvPpCMmf+J8n5s1ck59+f1Vj6SkgICAEhIASEgBAQAkJACAiB9hEQoWsfw55IYf+PF7ZdjtmOuK3acjZZue2sI3GX2k5PCQgBISAEhIAQEAJCQAgIASHQWQRE6DqLb1dSZyGUN5+b21ZeWOTufuQ9Ebm2UFRkISAEhIAQEAJCQAgIASHQXQRE6LqLd+O5sYF4uwuh3D4y5sjcqcbLpgSFgBAQAkJACAgBISAEhIAQ6CwCV3Q2eaXeaQR+61a1vPB+/WYUmet0Cyl9ISAEhIAQEAJCQAgIASHQOQTqM4HOlUkpRyJw6Ml5bblajrtZyjIXCbeCCQEhIASEgBAQAkJACAiBnkNAhK7nmiSuQK/umpv854+G4wJnhGIBFObMSYSAEBACQkAICAEhIASEgBDoXwRE6Pqw7SBzv/3u9W2VfP2Do1oApS0EFVkICAEhIASEgBAQAkJACEw/AiJ0098GlUrQBJkbWnoxuWPzB5XyVWAhIASEgBAQAkJACAgBISAEeg8BrXLZe22SW6KXHrsueemnC3Lvx96461tnYoMqnBAQAkJACAgBISAEhIAQEAI9jIAIXQ83jhVt7NiV6dYEJ164xi7VPg6vPC/rXG30FFEICAEhIASEgBAQAkJACPQWAiJ0vdUek0rDHnOHn5yfHHpifltbE/iJrn/wtP9T50JACAgBISAEhIAQEAJCQAj0MQIidD3YeFjkDjki9+quocaIHNVkm4Iln/u4B2usIgkBISAEhIAQEAJCQAgIASFQBwERujqoNRhn9PDs5PzZK5LRQ7OTc8eucvvKXZuMuWPTwjYFG9zKlhIhIASEgBAQAkJACAgBISAEBgeB5pnD4GDTlZrs++HC5OS+9ufGlRWWhVCGbvpLWTDdFwJCQAgIASEgBISAEBACQqCPENC2BX3UWHWLiqvlqi3n6kZXPCEgBISAEBACQkAICAEhIAR6FAERuh5tmKaKxaqWdz/yXlPJKR0hIASEgBAQAkJACAgBISAEeggBEboeaoymiwKZu/epk8mc+ZeaTlrpCQEhIASEgBAQAkJACAgBIdADCIjQ9UAjdKIIuFmKzHUCWaUpBISAEBACQkAICAEhIAR6BwEtitI7bdFISYaWXkzWf+90cosjdBIhIASEgBAQAkJACAgBISAEBhsBEbppaF/2mXvzl9emG4Y3uUXB7SNjjsyNysVyGtpUWQoBISAEhIAQEAJCQAgIgelAQISui6hD5A7+bEHymtswvBPy2m6X7qwkWfNNbVHQCXyVphAQAkJACAgBISAEhIAQ6DUEROi60CLnz85K9v9ouGNEzq8CZJG/2zc7a53bSFwLovjo6FwICAEhIASEgBAQAkJACAwWAloUpcPtefjJecmuLy3tCpnzqwKpI19cOyVCQAgIASEgBISAEBACQkAIDCYCInQdalescs9/8/rUMnfh/emBmXyf/8YNyd7vLkooj0QICAEhIASEgBAQAkJACAiBwUJgepjGYGE4pTajh2cnz25ZnLz53Nwp96bjAtY6yiNSNx3oK08hIASEgBAQAkJACAgBIdA5BDSHrmFsIXO/cORpuqxyedUZPTQndcG878mTyfDKC3nBdF0ICIEIBBbOuZisWTjWCnnw9FBy+rxepy1AZsDJ8qGPk42fOpMsH/poSm2PjF2T0CcOuL+ZIBsXn0nWLhhLeC5CAYOjDo8YLL694niaxhNHliRHxq4Okyr8vdY9jwsu53/GPYsx+RUmqJtCQAgIgT5CQBpIg43Vq2TOqgjJhGyK1Bki8cdty08myzIUt/gUikOifJy+MPE4iiAU4zVdd1HiH9/wx2STU+RD2fHHpcn3D93aN8Subp+uo2yHWPXrb0gDpGNk6XuZ5CWsFyR/9/Hrk5+8snSgCAbEbeuyk8m25ScSMIkRsNjzzoIUj6ePL5rynNAfd6x9LU3q+ZMLogndyE3vJY+ueX0KsSa/HX9yz+Qfbo0p3sCGeeiv3qhdt05jx/t0q+tDnZLwu8rAQtWBgk6VbaalW6cfzuRvTZ3+MaFB1omtOC0E2JKgFy1zrQJePoHU7XHz6r66+22tgBmCU/B727ITCaPQ3RY+SAdOz0sVoeedMqSPUbdbYCI/lNhfbfz9FMXRQmy/83iydngsuWfPZ+1STx/r9ukqynZPA1ChcJCWRx3ZCIn8GTcIc2B03ApH2y+YPdlCRZ+B9PAHmXlg3519/QxTn4dWvZHQ10M56ixqvKt8yxjWSzBb5hR34kK++EMIt9NZ4g6cGUoWOtweXTNO5sJ0i35DAhlgyRLye3j1G8msS0ny8Mszl9SBQV3pOKGb+1HaRnXLVzeeDS7wTPJd9fts3TQVrxiBOv1wJn5rilEsvjsr+cEX3etuMGTvPQeTL9xwtuuVYW4ac9Rwa+wXGV51Pvnqrs6NjFXF4Wu/Xp0889aiqtG6Gh4FAbciRhXrKsMU2FcCrQJZyqDd84+4cqGcZI1w++F03jwCO53iuNUpkGWC0r7zyOKyYD1xnz6Nws3H1nchLSochBVFaKYIRCOLwHzn4O0JVllfzMoUEjsLgyL5wP4Vye5j19ulvjnSTx7f8MqUAQ28CXgnFdXJ3pngmIeND0RsHxu9/3elllIwX/fcur4m0j42dc7Bf+3Cc+67dTK5/zKhjkln1r9+MSZY22HoW5QRy3eV8vkZ0w/pgwwQkNbCq9z32g3EbHIDsWV9DkK345Wbkif65L3t17ufzmlnrPD61nSg1a74ZJ0IXQO4sookC4/0m6zcctbtVXe6J4rdD4QuBKpodDgMa7+fdh+ckb2r7OekoynWMZZAlBQUyn4hDpMq2qc/Lv39r6NKjnKw7tl1UWF7JRB971ebfh9VnFhlOyqxHg8EgcG6FgqWizyrD8rkgXtfLFQi6R/9ZBXIe9ehAG9zAxixwgDCDkeQywZGYvpYlT6bRb5jyzxo4XbffSiaNHWL0PkYQ8JedM9PFSn6rsb2OfLjmWRArp+ezSo49ULYKu0b8x7ohTr1RBkcodMql222BPu89SOZo9qHn5yfnHih2sTzNuEaqOiQKUYFq8h2R8LyBKvHpuc/GzVKyEcKVyPm80g6jwDKY6zwweo3mUkWt9i2YSQ5i8wRf+fRJbnJ4BY98pvsQRuLtMsp1f0ieWQOd6gqZI76MhBFHJRmPBW6JVhrJOMI7HDzOXtZIFNVLWU7j+Z7RFifi0nTyAZ9XtIZBESWO4MrqYrQtYEtrpZY55qU2fM/SW7+0ofJXd84k/594cfvtc65zv0mRXvUtYdmVUU4Zg4cCk8sURxXOvXxaa8Vy2NXaefYtivPVSGmCwEIfNFgSdlzTH8pUiCZW2ZzyaarjjH5ouDmzVErGpwqS5vBsDLSW5ZGlftHPrimSvCBDlvlXTZdQLCQUBWBtJUJ/ZV5njFCn+/HgbmYuvVCGAaDJM0jIELXBqaHd85vbHuC20fG0oVK/se+Y8mmx95N7vrW++nfHZs/aJ1znfv3uq0HCN+EjB27KqEeknoIxHxI6qS8/UC+JS9Mjzk++viEqDT/u0hB93NjLkY/ij6yE62WZ5mzELhVlsnDLy8rDMJ83F6XPDJHudsdaYdYYKmrK8SPsfIRph9ITF0cBjFeJ76rpMkiPLHST1b02Dop3GAjIEJXs31Z1fLQU+0TIaxum395PLn7kVPR+8Mt+dzHaXjiLd4wdQ+kqlWiHtp0vCpqnQ2PAhI7moj75fYVxzpbIKWeMMJbZn2D9GleY/93lrI5XjHWNax4Zf2ll5FikChvoKgp8s+zwpYOdWXbvhWlURkcK7OoliaiAAOBQBVijxVdrpcD0ewzphIidDWb+tV/G2rbOoc7JVa3oZv+UqsUxLvvqXeSv35wtFZ8i8RWBrLSGRq9c6zy8UEBjbEa9E7t+q8kjPAyxzFLAcUKwMILVecU9R8Kg1/imOfo25+Jm7tatPJjr7sBFlkpY1epi+ktLC4TO3gVpge+LDCTRTBJc7NbgEoDLCFqM/d3lW8qKG36VG8sGjdzW0w1r4JAueNxldRmUNh2rHPMg7vvqZPRFrkyWFdtOZcsWnkh3V/uwtl6HJ364OYp6R0E2KKgimA1CJdRrxJfYcsRgNQx4o8Sissc1lGuVVUUynNSiOlCYLnbG6tMbPS+LllgAGC321y7l2VjwUJA9HuIbxOWL54f3FOL3DuLcML1k4EWymNtd9rh265LaFGeujczEFg+t9y1emYgoVr2AwL1tP9+qFkHy/jqrrltWeewyg07AtakmBtm3TSx0rFip6R/EdBKbt1rOyNxWAhE5rqHezdyirWcMXcVYlMkEL8sYeCFPtTLkuduaWWusxG4xQ2PEOO6VjpLC3LJs8ifyJyhoqMQEAIzBQERuhot/eZzc2vEGo+CeyTkqxNyy+XVMeumjRuppHcQYIPUKlKmgFVJS2GFwExFAGIQQy4gc4+ueT0XJixGWXPxmGeZt4ddbmI9eAOPgCZJ3Y4/9ediQj3YNCpSQwhg6ZUIgX5BQISuRkv9uaYliwVMcI/spOA2ObzyfK0sTuyLW9K3VuKKVBmBmLk8fqJHPlD7+XjoXAjURSB22XTmmWUtnMCzu+vul6dkz/zLQZpnuf3O466eh0otlVOAyLhQ1301IyldEgKNILDnXS2v3wiQSqQrCGj4oSLM7WzEvaZLc9TWP3g6eXZL/kabeVXG7ZL6dcqCmJevrmcjUNWFstdduLJr2f7VjYvPuMnr439+arhePe1cIvvN/QrLD/OX0lUGL8/T8+vFOfMrIfDUkZUUp7PtKe/9S0+5OYXnkrXDE0vxWxn7sQ3YeqJoHzq/PbBS0cesnxHv4dVvTCI5zJljRcaiRVL8NPvpHEsdfRWrY+zWHln1ow+zwMnC2ReTqt4JWelNx7W8d9GB0aFk91vXZy7e0m457fnDvZf3oAnPX/oOdHM1p/P9YOXphWPVQdImBhnIk/d52D4+HvQPXL3p99P9Prdy8Uzf755tv09xj7JCdHmvS3oLARG6iu1x4j/qWUGwznWLKJEP+Z3cV21RDaCgft0qZ0XoZ1xwPtRVxOb+8AL+1abfV4mahp31r1+cEmfPxt8nKClV5ft/uDXXraxOmqxix8IHJmCD4rxtGat7Zs9TAgcUa5QaysOxitQpJ+mHZY3NE/e8kaXvxW047SlupE/dIAtPHF3cNeWNNnho1RsJVppMuVxG2gDlcoezTmWtEJoZd5ov4naJwoJCUybg8Cv3nOz4k7O+Bf0RIsd8Oe71m1KNYhm7miXP4E63GTPbp0CG6xI7I8V5mNOXHvqrN/Ju517PercRuKn0KFPY9n5heBfxnPAcfOfgbY0Qe4jCQw6P3NVIXZ7co9/R/3j2+q0P+hg2cb52YbyHVDt48U7Y6t4F4B8zFSIkTbzL8RKo8hw11Zf5DpFW0Xe16b5ctW3rfpvJp0g3qVqOXgsvQlexRU4dnlMxxnjwO74+MXJdK4GKkcivDqGrW7+KxVPwCASqbDzsr5oHsUMZ5eO1zH3025GdR5ekliA+OO2mZeVoN03K8viGV3I/OJaPHQm/yRFcVqesQigoJyOmtEMdUmv5lx3H5yK9Pqk+zOFiE1yfhKLAsYz2yE2nkgXOiuFLWkdXTz7EKG98tDopuBnGLApiZUA52LH2NafwH3ebSa+YVC8L02tHCGgMoaPcKHBgbwIZov+gmDWxEqSl280j5X904WuVskR5hdiBxU43uPCE68NN1p/nYaFrF/p7LNksqgDpLXdzGkmvzvuN+uJymqf8hnkTjvBYM9t5RiGQfn8L8/F/W9+EcDZFJv30++kcDGIEIsX3oo7QNtvdtibgbsIgHxZarFsmeDNsuuFM5juGbwJ/tHFsm7X7bExXXzY8qhx5N1FfnltwDL+HYVroR2DPnEjiDaqI0FVs2bHjV1aMMR78li9/WCte3Ujk99vvVo99/v1Z1SMpRuMI8DGoQiJ2H5twq0GBGnH7LyG7nfIQq5RmVQKXE3M74eNSZ3Q8TNdPs2r5IBJ1lzeHUAw7IhS7IMV4vcddl/nY7XGksOzDEda16Ddt/Pj6V6ZY5HItfO8kaVssf/lj164vZyq0przxoWMPrk6MyNMHSB+xDyXnKKtlSjFhsB4/sO/OVr8ibi8KH34Uu6yFTfLKC97rnlsXTWLoz8scJlXlqLP02HNZNW5seNLnma/T52ln4vIHqYXcNeGiRZuYQgZxrNI2WfVuJz3eCVhmfcU9K4+sa+DCkvgMblQVBrNyrXJeYua6Z88lR8gkA0UzUWivmG8h/XS721O0qtAPwNfejRafQcQsckjfw3pP+N1/eyjzObM2Ixz7nBaJ35exoFVZsGi6+nJRfYruhe8+vu1ZLvI8A3zveQfNBBGhq9jKo4eqW+hYpGTO/EsVc2ovOPkNLb2YjB2v1sR1rHrtlVSxsxAYcXOSYgWlmn2csgRFKuYjlhU3vMaLkVHDJkbGLW3SjC0feftkDuLDPLKFs/+SkomYckFG/A+flaPsiCsYH5Gsj0ZZ3Lz7WWSOsGWEE8KOglDkVouSQPqQuqbFFBYsDKErIYrBDjenrGwwgnZEAUJR6WXhucqyiOaVmTrhdpilwGXF2bbsRClWWfHo+6FSkxWunWupq55rn3YHcczagLsh76N2XNn8+qB0t0vo/PRo69j0QgW4zrsIUva0m99WRdnkmbfnzy+7f44Sy8I7vvsq1v2d6/+Y9rUYMuinNwjn1N//dmTVCa8IcOP7UFV47iH39ItQyt4F5EeYovJB0I5+6NzWI9+XvBtiCV1TfRn8yr5dITZN/c4auBxk18o83Kpp+3mp6HohAmwkniejh2cn5ytuBr5kQ5wb3dBN1QldXjl1vXsI8HFgbkSssNhCnlsTSlSTgvIRQ5xi8/SVjqI4CxwmEBQEqwnKV1jnWOsdI9y3/Xx9UXaZ9/jwNkXoKCuKbpagVJYpFdxHcStqC9Inn04o/nkWNtqTuY4x1hMUjj2OmMT2gSysOn3t9IUrkxep02WLZEx+9BHaJ0ZRh5SwCAhuQ9s/c6zQwonlgMUIzHUopizthoGw04+K+llsHma1wx2tiTldKHEokWVW4djy8T5hcCzGImkDEu2+i9j2IqafUAesEGX9MM+6T914LmPfkbGY9Xo4iNxWR5xDF0i/3LxHmffZznuSQawsMkc+Me9g8i4idKTD+5K+En73uBcKz0a3+zIDP7hCxpQvLG87v8Hd/y5T75HfrCr9hraTZ6/GFaGb5pbZ98OFlee6/cPhN6NKPe+mv7i0o4IqUA8hwEce5adMeHExslekEPSysmz1i1HKeGlTXyxOefXloxhj8QBbPvRVPzxZo4BWh6rHIsLOCPrzjhCUKRiQhjJFm0VWytKpWnYsLGVpMtKN8lmmbOOiVIdcVy1z1fAMqqAkFCmCRWky+HDg9LzSPmbPJ23J6HseEc4j0EVlaOIefR4icODLL5a2ZWx+YIvLIdgyol9lXmuYBwNWZX0sjFP0G7JcZl0mPu+jojbh+WC+a5nFj3cRaVk/yCsbpNpXWvPCbdt/Z96t9DrlAv9Y601hYj10k/cgg35gieDOyhxy++0Xle8N/YY5bU0MKIFnUTuDNe1b1saQ8bK+Rz+ItdI12Zf5jsR40lQpn98mdc/Bnm8IRwRyPrJ3del7t25+vR7vil4voMpXH4F5zkIn6R8EeGG+eO+LUfMjePmvdUt8lynWTde+E8uJx1gRIXOb9nw2l8xZPVGMY6RspDsmjXbClBF2lAD7SOXlE0MwYz7CeennXc8j1GH4mI2iwYER7F4RMGek+fW/25+SDmuDqvO/iJe1D11ZPbPmN+E61O3n3C8n/WytmxeIstSkgBFWJ955WYp3k3k1nRbbK5S1yZ53FkZli7JcJkUb2FtcrIUxg1SxhMDS7Ycj/Yj52DZvk0GxvD7FAMAlt1TAsms/Sklgu/UrW7yMfv6oK18TMvLp8r5SNR/m5pX25cj9+DpRvrz6gCturvYtpf+jE8U8A3lp9vt1Wej6vQULyq8VKwvAmaZbNgKXulldHk2EXPBR4AVVJhA53JVileqy9KrejyERVdOMCc9oY9kIJ+lA6B6KSHD53HILaEQyHQtCX6BPxBLUooKQ1nS0G6PfMYK1skyhiEmn3TBYQFAI/efQH/HlXpX5ZCiUKJplc2iKys3zPl3zUvxy0X9SV1pneWx6kACcIHXg1I61zi9vp89j3kVNKZYMeJjSWlSvrMGAovCDdG+czE5MLwAv+lWeBwPfXP6Ym0bfti0CmnjfZuHa1AAiVsimhW9rmcSEKUujyfu0rb8gEe2PV8hMFxG6Ae4BWrGy9xqX/VOqCJYpXqa4h0DimlISqpRBYZtHgHYtm6tj+wq2m3tTxLBqOVB6Y+qJ8oWrznQNUqAcMIIeKl2hkgCxImwVQgNJREmMrRuuwCZgV+ZCZ2G7cUTxZfVc2mqnm4da1n+rlgnyC751Vn6smlc/hS9yz/br0Sky4ufRq+fhFi9WTgZnWGCMhYryyB1hsOjxB4YMKsQ+r+QT857mWW5CeD5muoCBT+awMA6i1blOOzfTy+rkrDgdR2D0v6qvyMnKmJLOIcCIe5awP4qN+p6+OE7i+FCIwGWh1f/XsEgVzYnBxW8Q2p7BCLNKF7UaZKqKElWUVpV7eYtEhGTO0ty2f0VyoOL+jsynw63Ynm9LK+vIAg4mEMhe7AO003Kn+DIHDgtHk8QOpRoZBFLHO71dQXmNsc417Q7bbrl7JT6DELxr+YsZiOA9ZO8iiELM80cYvutF7zkRjmZ6BG3jz5kTmZuMa/tvnMnp6VePIMDqmRferz5FkpUxJZ1DALcliRDAvQxlI1SIGclF+egFN7smWilWqd3oPtTdlrz9vGiDvH2oxq1Uq1MXwdjyYgFgBbt73LNP/DxB4URhQVLX6sglyvPS6+R16kEfxf27aWIHqTt4xq082MP1j8E2hsCXpbNpcdxzUdSvyvKYKfcZiNjkBlZi9hO1Z5FnNqYdR367Kt2uJVwchXcJ/XhQ3ufT2VeyBt82uo3Z+/090SSm1TX+JnNXWh1D4NV/K/eLzsp80aoLWZd1TQgIgYYR4CO/cPffJMNP/01yj1vwhYUW+G1kryg7RoOLRoSL4nbzXowyRHm67UoEkTZrUIjH7mOLCokXdWKFwypC/YoWtoD02X2UwF5ytSyqpxG75W4bEEbLWUGwCXlo1eS5jE2k2Y9pbHIKq6Q5BHh2Y+e08kzm7S0XlojngDlcs/71i27V3g3p+5wj7/MyMkc+uHE3uVprWL5+/403S9a2DhBvXLUl4wjkDxcKob5F4PzZWcmru+sRuuFV5/u23iq4EOhHBFAGyua/QAiwYplLEEqApB4CKAFFy7bHrLqKFTVmWXq/hBBICE+WgseCK+Zaxx5KMa5eftrTfU4fZqScP/DdtuxkpbmGYfnp37atQXhvJv1m8awY6cTqwzH59mOY1ANi9dEoAkU/rLq1Cs9u2fPLYJy9y80q349YdqPMeZ4Uljdkjy1iaNeZLiJ0A9gDDu+cX8vdEihu/NzEpPwBhEZVEgJ9gwCjtkzoZ1nzkMBBDHBnzJvo3zeV9ApKHSEGnRTyMEtYu/nglgnRrtIGrJLJ3Fhf+YAA2XxKtigoI/ftlrvT8XFt4w+s23HHxH0ti/x2uvy9lH6s1abTz00vYdJEWVjV0p65svQYaMHdz39my+KE91nsiAE53uU876EwBxLyHtveYfxB/c1iVTHeG7F7/Q0qTlYvuVwaEgNyHDt2ZXLoqfm1asOCKENuM3KJEBAC04MAo7WMSF76+1+n+yph1TEyhyseCj+umcudOw9K8yBJN5RSCIZZwvKwi1EgiEt52cSWdqkiKB+WB0cWTUF6ZYsCykK5sCL4q25yvYqAj7kV46JaFSfayXCqku8ghS3rq4NU127WpeqgybfdKpl1hEGJX236ffL6V/a5lWH/OInMMSjHc4Fr5vj+aRPbLtTJaxDjxD7/fCP9lS8HEYuYOlX7EsWkqDDTisCeb95Q2zp3y5c/nNayK3MhMFMRSK0RntudjwOKsCbW+4jUPw8XLchKqYrFDdeqbftWpG5ZWWllXTPlY53brJt5IfymjVlYoVdkhyOdELq81T6rlhPrxu7ji1KLXZW9/GJdDquWR+FnNgJVB49iiQWo8jxj/WPwiPNQIHJY9wdtQC6sZxO/0/eic0GHDJdZL1vvVTfgOVNFFroBavm9312UjB6qvlWBQbBq61k71VEICIEuIID7zetf2Z9+sLJG4/mgbXILpsx017MmmgKlLAvjMO2qliEUMyynVQTl48Uvv5haoKyNqyqZVfKrG3bjp96vG3VKPLPYsQAQdZaUI6DtCMox6laIGGs1rpmv/93+hDmxWWSO9lzrBnJE5uJajcEyrKmxnhC84/FwmakiQjcALc8iKJC513bVWwgFCBZv+EjulgPQF1SF/kGAyfb85ZEMU/RjV4rsn5pPLWne/oxTQ9a/kodzVopsRFxFINzsHVhFTOFjEZRebeOq5Dam/qmC5uosKUcgluRXsSCV56oQWQicvnBl1uXWNYiEWdxbF70TyBzbFsW2qRd1xp4aVlVWJ2WaAqsYz0QRoevzVme/uWe3LG6LzAHBqm3n+hwJFV8I9A8CfPyzJsf7NWB57V5V9P1yFp3Hkqiqc1qK8sy7t3bBWN6tKddxzYwZkfcjsul4HYtKFRdEP79unVcltzHlor1jCDALyMxkOfJB3DYQck3tfC8xcpGVE+/zvG1QLDxWpqI0LJyO2Qjgtv2TV5Zm3wyuMk95Jq4eKkIXdIR++YlV7qXHrkueGbmxLTdL6ot17pYvaf5cv7S9ytnfCBTtgWY1wzrXzqpqls50H5fPjVs1l1Xnek2KtjbIKivKGiPwVd0JbSGcrDR74VodchtT7p1Hi5cZB8ey5d9j8unnMAfOzOvn4g9M2Ys8CHCvLCNzDF7M9L7cRGdgkLOoLfw88H6ZaZZrETq/B/TJOe6V/7Lh5uSlny5opMRrvtXcPIlGCqREhMAAI8CmyWVyYLS++3RZ2t28vyBjUYAwfxYJ6IYlsqoVEAtqVdedlNTVmCPW625CVclt2MZZv8usFWzwPtNlz8m4b3yVhXxmOqbUv6r1ZufRJZmw4TYds/1BN95vmQUcwIssHsU3o0xomyIX2LL4/XhfhK4PW62duXJhdW92lrkl2nsuhEW/hUBHEGDSvM2d6kgGPZZozAjpwy8v60qp67jvQWRosypSZb6Hny55xbhfEq7MXddPt4lz8quqBLebby9abdutU9X49KUYN17eKTPpvVIVxzB8zHvJ4kAe8rwl2CdUuBtS3TkyEFRpkZTL28J0p3TTm4sI3fTiP625z57/SXL3I1M3uZzWQinzaUNAH6bOQ7987kdRmcRYtnq9vWIIQJGyFAVUhUC4PMW66/jJMspbldShALLkf1XBfWt8oZyprqq0N3taYTWsOr+vajmywjNPqMk+V1QHSEy/rwTYFFY7XrkpqzmmXINcxEgR7jHx+z0M7XJ/xubeefWCPORJ7Ps8pi/EvPPzyjHTrjPQwQqYMcJg1A63QflMEBG6mdDKOXXc9Ni7yZz5l3Lu6vKgIBCz+AB1LVPA+Sg9GvlijPmAGb5l+8sQLiaMpTcIR0aQixQvCEaMq890YrF2uHwRkiJlqRNl3/GnuEn1Yd6QOixjMf2adoOUxex5F+bDbxQQNiJ+8d4XU4sdVjvSYzl0nlFIMPsSdltY4KbJzXtHluYPJm5zGy73u1RZhKeorgwOxLiYbXWr+8UI/XgmC4MmscLG3024S95fQrYZLKliNYwt/yCHY8AndpEUvpXd9mqYDuxF6KYD9R7I865vnJGrZQPtUEaCwiym46W95924eRhFBIF6olDGlr+KMhOzEmJMGLCOUbgJF5seYZuUKm5/Wf7/1I+PP/emS2KIGmXbuqxYwWxKWaqCA0pA7ABHmC6WsRe/fCAl0ln9jGeEtoGMmfLAwh518+NZQ/nkj/Qsz26TYB8HygS5tLL496qcg1WelaRKv4gd6Ikt73TMRYv5hsQQXNIpm/NJ/7S+GdNeVcLGpBcbJvYdY+nFhqc+Rd85S4/ndvNet6F1iZU99n3O9yZrQIjBHwZuyhZVsXJxjO3LGxef8aN15Tz2eWzqOWORlJjBDir/uHO9jNVfugJWBzIRoesAqL2e5O0jY8ldWgil7Wbi5VD1pdmJJcDLKsJHKWblPRQClDUULT401I2PHx8cXL34kMTM56A8xMWyUPbxqfKCjQkboxxRvtjVFwnbpOw+viiqLciTuoze/7sUe/DnD1JtH/+YNiUd2hDsOKLQtSvf/kz5Hj8olkXtxUbcZcpSu+XMi193ewHSQzHDfYd2YUN4axdrJ2sbwjJ6vPzn6xPyi1U6iFckVchOUTrt3KNfQmyL2rcofd4JeZZ+6hfbL3hHxQ7MxLwXSK/sfWX1iiE6MXmSXoxyy4I+MZvXQxqyCAt1493u90+rS9ERJTi2HkXpVLlHG8S8Y/w0Y8JjMac+ZcI3bpNb2CjG5bfKQku8E+09Ye8NBn/sOYp9nz+65vU0Dt/XPGtjbD8Gi5iwsYQ55nkkv5g8KVtM34udg02eWYOk5DMoIkI3KC0ZWQ/I3N2PxPnaRyY5I4PxccD9qKqkHxWnVNtLvGr8OuGZRMxIVoygqOzGvct9aPa4+qG8WlmZExSbDnnxseEDNj4COXVhCV6weYpdVlkJW/QhoJxbl03NJystCKfVK+t+p67RFmxCXUX4qNmf1R/Fd+2z66KSoU1pA9py3cJzhRiGCUJEyMtXNvhoFy3egTtonlsX6TDyXRWDsFzt/KYN2F4gdnAiLy9wCNuFsMzTW+fahmeFvMbzu6vt/Hj+YslOXpmbuk7d6VMMEEAWYgW8eG+Gzx79ogqZI7+8PpZVlofcu8ienaz7TadH/bKIVVbelKvMskY8npmYeZk85ww20DY8p+lAkGc1jnVTI0/KRvxLf//r9Mi1TgqDiRDPGGLgl4Pw1BnMebfbH+mBAX11p/NqKOoD9q7jvRrrZsm83Jg28ctq7wyOiPX92DlhkHLqw/c1D6fYvkf+Zc8GmJV5W5COSVlfrjIfGX2pqM3Is8p2EDyXWe8fK3u/H2clP/jiwEyi2nvPweQLN5ztaJv888pbKqfPPm/3PfVOZrxf/OOnkpP7urN5ai+Tua/9enXyzFu9u0w1H0lGUtnANVRGMhs24iKK3oEz48vTP3FkSceVNT4ARYp4XpH54PCxYcQyVcjcBz5W+EgeGbsmYdlnU0YNS9wyy17WYT6GGcq4kUsUDsQ+kGGcot98uE+7+t3jRmTLJLbuKPQQhiJBueBjVVVIe/vBiQ3Hq6STjjy7coFhlkDgUYRMsAgw54zwtBP9x1cUGJ3e4axQB0/PS5+LZU6p2u4Uqrx2QPFhNLXKB9jK0oljVp3ayaesfuS3w1lQ6rT7d1ybd3PeXNgXynDhOWKJ/d1vXZ8Gpa/Rb3hXstgDfYI5c1nvTlxStzkrZl6/9PNGGWSuGBb2PGXWD++fkz7vW//dYen107uoifc4BK2KWHuWvdeqpElY+oMN6uW9N6qmWSU83ydWU+XbVsXa5ufBc83zEmNp9eNxHr4zDjiiFpsOcX1XXOvLTT0bTX9XSa+u/kTb+M8t2LWjRxCfNGO++4TtC7nik3XZX/a+P9iOGgAAQABJREFUKL0KWQWBv35wNFm15VyVKAobIDDLDX2ccUpBnZXygqRaP2e1zjp/wggvCg1KZYyvOx+7nY5omlKfV0L72POCPH3RKU1uDzXmFhQp7mBJvDoSYkZaSN12CdMbT63+fwhimfAhZtNglLMFbpCgTFB62Yg5dAMiHT7gPhEL04KQ0/axhCAkjaSHMgyBZsW9h1cfdfNwTqVKepkSRh+iX/QSkTN8rE70cVyh6xAte0YYsCjq74Yh7UV+EPGYZ5BnJO0rNZ8Vq2s7R4i9WVRTYuasHhx9xRPFnL+y0Xm/HCik9KdYa4jF5XkHd/6qStaz3m/vItqC/sZ7PG8eoo8Lzz+DacTLI82EGX9vjw/A8Z0gLM9up6Xd93eV8vn1KvtGxaYLThDdcMCrKH5e3+dZ3333y4XvBvo94bLapslno912CZ810qurP4VpGbak2ZQeYWn281EWuoqt128WuqGlF1MXy17fa67XLXQVu0nPB0f52uSsMQuvGh89twLzkeBDlx4zFCbiMdJOGBSxqsqY5dOPR5RYG7UsKr+vABeFs3u4RGIhAFtGMBFTPDjSFnmKmKXB6CztQptCEFHQ2JjZRp8tXNGREU/aNZb4gQd/iB1NySjqQ0VlmM57jLSz9PumT51uWYB80uUrvZBxyHUZiSuqD+2N+xRt7xNyCDXt3o7VoCjfmHtmoUNZynPtxdVyvA+M4+XXISsP0qJ/HHAWXeaSlvXprDR0bTIC1mdZPp9z+hKSvjMuD67ZM+nHZECBPgyJs3eNf1/n9RDw28PeiaRkGNMWWe3h50Ya6fv80++13guQON7lDAbNpG+uj4vOSxBwFjoRuhKMwtv9ROhWbjnrFj850xdbE4jQhT1Nv3sNAT7QnSB0vVZPlUcI2OAC1uYqCqTF8xE0Zda/pnMhIASEgBBoEAG5XDYIZg8lxZy9Dd87nQyvvNBDpVJRhEBvIsCIKPsEMScHq8HTbiS0HcsLbqcSIdDPCFQhcX4968bz09C5EBACQkAIVEdAmkd1zHo2Boue3PH1Me0v17MtpIL1GgK4O7KUNaTOBNfDqivuWVyOLA4hEQJCQAgIASEgBIRAtxAQoesW0h3MZ3jV+WTV1rPJ0E1/SXMZO3Zl67yD2SppIdDXCOAeFpI5qxD71WClK5vvYOH9o6wUPho6FwJCQAgIASEgBDqNgAhdpxHuQvqjh+Yke/9pfLloP7sln/soWfL5j5M7nOXOyJ5/X+dCYCYjwKpkvmUuxII5c1UJHauXSYSAEBACQkAICAEh0E0EROi6iXaX8zrxwjUJfy/9dIFzw/woWbn1XHLLlz7scimUnRDoTQSq7mMVUwtWIZMIASEgBISAEBACQqCbCIjQdRPtaczLyB3Ebv2DWjBlGptCWfcIAmXLprPXky9rh8eXBPev+ee2LLt/TedCQAgIASEgBISAEOg0Ald0OgOl31sIQOyeGbkxeemx63qrYCqNEOgyAiFh87PHdTJc6ZK9noqEzV4lQkAICAEhIASEgBDoNgIidN1GvEfyww1z73cX9UhpVAwh0H0EdjrSxibOWbL94O2TLtvWBpMuej9YFVOLoXiA6FQICAEhIASEgBDoGgJyuewa1L2X0Wu7htJC3f3jU71XOJVICHQBgZHfrkr2bPx9ssateOkLq1/uPLo4YWPltQvGku0rjqf71PlhOD/j7o/8xqXxTjYxDMPrtxAQAkJACAgBISAEmkZAhK5pRPssPZG6PmswFbdRBJhHt/bZdcm25SeTh1cfTZYNfZymz/50/OXJUbelwcMvL0t2H1+UbkaeF07XhYAQEAJCQAgIASHQaQRE6DqNcB+kD6lL97Lbcq4PSqsiCoHmEcD9kj/2ptu0+Iyzyp1Lls8dJ3fkduDMUErcOB44PW/K/LrmS6QUhYAQEAJCQAgIASEQh4AIXRxOAx/qpZ8tSG51Wxpov7qBb2pVsAAB5sFpLlwBQLolBISAEBACQkAI9BwCWhSl55pkegp04f0rtEjK9ECvXIWAEBACQkAICAEhIASEQG0EROhqQzd4Ecf3qrt68CqmGgkBISAEhIAQEAJCQAgIgQFFQIRuQBu2brUOPTG/blTFEwJCQAgIASEgBISAEBACQqDLCGgOXZcB70R2Q0svurlvF9OkL5y9Ihk9PKd2Nn/+5bXJ+bOzkjnzL9VOQxGFgBAQAkJACAgBISAEhIAQ6A4CInTdwbkjuQyvPJ+sf/B0suRzE6vxkdHYsSuTfT8aTiBndeTN565N7tj8QZ2oiiMEhIAQEAJCQAgIASEgBIRAFxGQy2UXwW4yK8jcvU+dnELmyIOVKjc99m5y+8jkzZJj8z/xH9fEBlU4ISAEhIAQEAJCQAgIASEgBKYRARG6aQS/btaz53+Skrkyt8i7HzmVLN7wUeVsRv9rduU4iiAEhIAQEAJCQAgIASEgBIRA9xEQoes+5m3nuGrL2eg5bmu+9X7l/EYP1Z+DVzkzRRACQkAICAEhIASEgBAQAkKgNgIidLWhm76ISz4/ec5cUUmYX4dFTyIEhIAQEAJCQAgIASEgBITA4CEgQteHbRouglJWBebbSYSAEBACQkAICAEhIASEgBAYPARE6PqwTVnFsoqMHddiplXwUlghIASEgBAQAkJACAgBIdAvCIjQ9UtLeeV8+4WrvV/Fp5C/sWMidMUo6a4QEAJCQAgIASEgBISAEOhPBEToprnd5rktBqrKa7uGoqO8+m/xYS1RzbkzJHQUAkJACAgBISAEhIAQEAK9jYAI3TS3z/Dq6vPbTrxwTXLoyXmlJR89PDt56bEFpeHCAJpzFyKi30JACAgBISAEhIAQEAJCoDcREKGb5na50a1CWUf+80fDjqxdlxv1hHPL/MWWxbn3i27ULVNRmronBISAEBACQkAICAEhIASEQPMIaHJV85hWSnF45YV0W4ELZ6tz65d+uiDBpfKOr48ltvIlc+a4hhWvrtxy74d1oyqeEBh4BLbfeTy5f+l7yZnzVyUje1cV1nfb8pPJsqGPWmGeP7kg2fNOdat5K4Gck7ULx5L7b3ov2fSpM5NCnHZlJL+nj1+fHBmLn3s7KRH9SBFYPvRx8u3PHEvWDo+lvw3bJ44uTjjPE+JtXX6idbtTfaCVQcYJ/WLj4om+8f0/3Dop1EN/9Ubrd7fKF5bpiSNLCvuoX8ajY9ckO4/UG7BsVbTGif88T1cZahQ7Oko79WsnbnQBawZ8ePUbaf8/4vrNA/tW1ExF0YRAbyOQ/xXq7XIPVOnu2DyWHH5yfq06seAJxK4pGVp6MYFkSoSAEJiKAMr5Q6veSBbOuZiESnEYmrCPb/jjpMtHll2T3Pbz9ZOutfODcuy6+9AUIuenOeKI3o61ryW7j12fPLB/RSH58ON1+5y6fHvF8aRbhKJK/cAQnEPh+k9eWRpenvR7+dyPEhRKk+9furUjpN7SzzpCnh7yyxAQuukoX1gm2r1o0MEvI2GnhdAtO9EixtNVBmvfrW6waJb70SQO29qoXztxrU6dOjKolQ4IuOfg4JmhZMcfi5/ZTpVD6QqBTiJQ3SzUydLM0LRXbT3bMzW/61sTo7g9UygVRAj0CAIQNIgHsvPoksJSoeyHstxZ61BkmxCscq//3f7o9CjPrzb+vlX+JsrQVBoop9TFV9qbSruJdB5d83pmMgdPV190KjMhXRQCkQjwHL/+lf3JTvcuYrBAUo4AhO7oZQ8FG5Arj6UQQqC/EBCh64H2GnIrXd4+Mu7GM53FwTp3x+YPprMIylsI9CwCEDEjY2XWBCrx7c8cz6zLNs/9LjNAxEWzzBm5tChPOysclkP7MyXG7kMCe400gSnKaVgXK3MvHCHiJmcuXJWse3ZdMvz03yTb9t1pl3UUAh1HgGcFS7HfHzue6YBksONPN6U14T2zPefdPCBVVTVmKAJyueyRhl/jLGNv/vLapM5cuqaqsP57p5tKSukIgYFDYLtzBzQps86heOUpXVijth+8vS3XRxQSP31IxshvVk1x5Xv45VtTskSeJrg17njlpkL3NgurYzKFaB4YHUoOXLbMHSiYO9dP2M361y/2U3FV1h5EYNPzn+3BUk0UCZfzR9e8ll5I34F/WtrWO3giZZ0Jgd5AQISuN9ohwUqHuyOrV06H3PylD5Nb3J9ECAiBqQgwH45FR0x2H19kp5nH0AqH5cyPzwICdedxMMKMQuJLFpmz+1iRls/9uDX3h+u4ahXNV7JFViwNCAx1yBJ/sQ0WijGyE4YFQ3+BGNwV1ziL4ZoFk70TuHbJTQ4qSitMu8pvymuWVuLl1Q2cKcvaoHwL3HWrM3UoWhAlplyWFmFZaMPahf5COyB5ZUxvev/8dqNcsYvh5JXBSzolthvdQIWViXvk8bxzZ8trcz9+J8+z+hZlS59bt4ARbRmLB2HvX3qqNWASi71fP78duF6WBuHpV4j1AUuDcrPwTtazssw9U7Rd3rPi96E0cfcP90M8DOqI30+Ib2Xl3K9DWJ6wfSx/rtuCQVZPjkUStg9pUSfEL59fNu7xXNk7hzQYFGPASyIEBgWB4idnUGrZJ/VYteVccuI/rkn+7Cx13RRcLe9+ZEJZ7WbeyksI9AMC/nw43BiLlA5TOKxehMci5xM63DHrEjrIIHmYPOFW+zOFxq6FRxSXtW+NJXuc8lOkfJM2i2f41j9LizrvcKPa4WIw33eLxPiKFK6IWfjsuvvlFhnAorjcLQ6zx83pC4UFXBAUtSZH/VkUASXOx87yZvW77xy8LV04xq5B5JhzGAqKq5X7nj2fLcU+jB/+trS4Dra73YqkzNUkH18o42a3qmpW+1GnrMVxwDJVWi/5KU09D8sQKroMIOCqm4UdqVGmB9zAQVbZpubW/BUW5PBXwaRd6JOhezF48Nx9xz2PWcJz/vj6V6bU07DPiuNfy2sHwmT1MYu7w1mO7BmiDzCg4Zd9syOldt/icGTgiL/wWTHXzLz24vm8x1nUqrTX4xteSfOy/CFH/vPp1yEsT9g+vCOYy8aKwb5Yfw3fMRaG9xNWtkn1Wj1OUnk2yvox70mIMcL7OOznlo+OQqAfEdAcuh5rNYhVNzf2nj3/k2TT/3o3mTO/5IvfYzipOEKgmwhsdQqjSRl5GnGj+77CsfPycuwoOSYQJt9KZNdjjiOfnjz4AgEoE8qMIlukwKGwQSSyyBzpUyeUTML5ErqfUv9QGIn3CcruY4sySV8Yr6nfv9r0+0JCQp0hRGHdmso/Nh2UTUikj5XFpYx5i9pwPa8/0WahRdfSjDkSH0Xb79NhPMpLGWjnXpBHIbKu3FkCiaA+oRSRIMMei1iegE9RO1gfg5QUSUo0grKXvXP89NK2cP29qL2srLHtRZl9rwMjc1kDN35Z8s5ZZCgkcxaWdsu6Rxn8RaksPEdrO/9a1rmPY9YzlhVH14RAvyAgC12PtRTE6t6nTibP/uPiZPTwnI6WDjJ3n8tL2xR0FGYl3ucIhGRkzzsLC2v07RXHJt03wsPRH2VHQfIVjEmRCn74aRCsThph8qHCxn0sf1gVUP64v2D2uFWQcp+5cGWy/cC4lYNl01GQ7T71D5dS3x5gwhw+BJJL+jZqzjVzYzzglhdvQlAQQ7JjdUPJ9ucXptYOR34p/2lnRcwqH9ZF5tEhhGlSzBKMe6uRb8pkRAKsUoX3Mvbkze9QOWUrBZRtazuOdYR4PhnE2swAhQnltbYjbJkrr8Xr9BE8aKe0HR0O/J5kIc+YRxqSefoh864Q+g/PXRGOWPb8dqDv2LMJQbHnAwsT1821NsTC0gBrnj/y5d1BGcjf8CaehfGfFcisiY8B13wcSAvLWZmVyoiUnyZu3HXJHOmMv0Ocxf/y9gF+P+I+g1Z2j9+U1ea/8RsJn5HwGR8PNfn/gdPzJl0gjrXRpBv6IQT6EIFmv0Z9CEAvFtlI3f4fDiev7W5GqQnriRXw7kdOicyFwOi3EAgQWLvw3KQrRQpASP5Q6kxxY97dDqdkmmLXxOIoFCxLsTIFdFLBvR/ML/FJV6gsha6EELAD977YKjtKvr+wCmmZ4o/SCA5Wb7JlTpIJirKRFVy2KCsWNBOIYhHGFi7miCLou+Kh4G5y7niWP2lQjz0uf2sXsKCtCJNVPsic72oWU44qYSCb/uqZYOHjE87p8wkp+bACp18/SIkfv0pZFs7+S0qwIb6QypG9qyelDZHw9+dLLT7vVMmhM2Gz2nm3s8D6pM4nn5AW6mjCcxu2cRjfwnKk3kbG+W0WLM4RCNmejS+lGNInGeCwAZHxEJP/Q1ZGnAshQnie8ay+CLkOCRnz18gf4gcp8u+T1qgj4SZ+ne2af+RZxipmkoWr3atyhIiufW5d692FK/eBL7/YGrgIB61oH8puEj4j1BF3yzCehbej/07i2tph5z7tni+JEBgEBORy2aOtCKmDcP31g6MJlrQmZeWWs6kVUJa5JlFVWoOKQKhAh0qBX+/QEmXWOcKglOFq6AuKShXxlZqieJAkLDd5f4zMm6CI+umiLIVKDnX2FUPi+gqsWdwsTR8HwvmKYxjW4nTiGOKb5XYK+fHJLViA33QJ8y19CdvCvweR8LH1rRYWjvgo+HWEdodILP/5hnSbBp8okh4WJF96ZV80nrOwrEWuyeGgDQQjlLD/+/f9Z4HrYVhw9PNncZki8ftA1oBNUVyI4FpH6lm5NKsePi4slpQnEHhcSH3Ztm/FFFz9+7HnEFG/XpwX9fPQzfzhl5dNySqrrlMCBRcWXjVBEoNb+ikE+g4BWeh6vMlYKOWOzWNJE9a6xRs+Sja4rQlE5Hq80VW8vkVg67IJgsZodrgaJoqMb1GpujiKrwQZSBCQrOt2v+wYElZf8fTj+st+c33TDWdablEorFg1bIQci5xZIEbcgg4mWZjYvU4c1y6Is65SN7MwUg4wMXe7TpSrKM2stjSLSxgvJFC+su6HpS6+q55/L/accmGxsZUuIUH87kUJiSZlpI/myZRnwOEVSh62hAv7Gf0/xHuZR56KcPOt+mEZqv7GwmordjJIUWWgwh8osHxDl0W7XvWYRd6y2szSDbHMasvpel6tjDoKgelGQIRuulsgIn+z1q3/3mjy6q6h5LV/G4qeX8cKlrd8+cNk1daz6dYIEdkpiBAQAh4CWYqNd7t1Glq6Lrl1hnx3tFZA74S0UbKyFBwv2KTTULlHGQ3jH/ngmpRg+RGNbPnXss6zCAXhQiVq4eU5dZYGI+SWB/UCD8rlE9huL4YSWiBCnKzs4TG2zcN47f5Gmc+SvDZJXRyzIjR4jQEDyO42N1gxXbj4FuQGq1Y5KQYkzDXXjxz2M+aIlQmkrogklsXPuw9WDCyxb2bT7YX7Je7Y3Ra//fOekW6XSfkJgV5DQISuYotg5aoqi1ZdqBolMzzEDosdf+fPzkpOvHBNMvry7DTs2y+Mjz6S1xznojl088Xkxs99LBKXiaQuCoF4BIpGjv1UUHh9QQmJGRFH+YslGqRPWH/EOis+LoS+GyHxLv39rzl0TBghZ26MLeBB3bEQ+NJNd0s/XzunTfLIkYXhGNvmfpzpOD/tFqfppIAXbne+RYkBBfDBkgshedHNrey0hBa0phejiS1/FpnLigtGMf0sK26718L2soVTdr91fbptib+9QExevuWdZ5qBmum0hvnvPr/8Punzr+tcCMwUBEToKrb0fU/1wIxvV2bIHRuB22bgd1Wsh4ILASHQHAJYSvwFF6qkXHVxFNw2ffdAXKpiiUpWuU5fnPwZyFsoICSnRz6Y6sJG2WwRElzzfOULJbcTFomsOtk1yK9ZDblGHbKU0dDSFWJi6fXaMSQNeRaZvOtl9WEOok/m2L/NX30w7BNl6fn3/ZUZuZ41MGHhQ2W96X4UEsQs61lYBisbR+ri97MmF/bx8yk7pz389goXDyG+X86y9NhbkIGhI1/Z1xqoYTVPnquw75Wl1c593yuBduB5DT0G2umL7ZRNcYVAryCgRVF6pSVUDiEgBHoSgdB65itMVuBwUQRGtdkcN+8PBcWXcPEO/154jjLrux2h4DAqH5ISi8f9cBVLu8eRzcZ9ud+b8+ZfR+H2JWuunb8IDDj5Slasda5IcfbzjzkPSYM/x9GPvzWoW4iJH7aXzsP6bfzU+5MWuKGs4AnpryPMk/TFJ3Nch/zXldAKShmzni3S9wcw+N004Q4Joj/vk/yQomc0nFvm9/vx2Em6xyHPIQM/TfZxSz/ryACLL3n4+mHsnHeMWfn9RVooO4stdVPC9nkoyJ8yhX0kpny4pkuEwKAgMHlodlBqpXoIASEgBBpCIPzoY+0IFQwWN/EFBSgM498nTX858KqLo2zbf+ekbQRQ1F53o+hYn3wln7k9KKdFCiTlDN2qWOZ+h9vLjO0NFjhlCXdSfy4chDTL0sWoOSsthtbKKouhoAyjIDNHzzBEgTTLHziygl+MUEbfDRTizbxG5vuxvDt1I21fAc9aKTImr+kIg5UEK4y1DX0TC8oD+1ekFhRI/q67Xy5s/6Jyh1ZYcLIBjlSJDvp9UVrhvbDfkR4DE5AIn7CRp98+pJPV98L0q/xmIMLvX5zzjBqhgSw8tCqfxIRbkhCf59DKSfltQIQ96Xjewm0RqpTXwoIZf1jC/UEeu++3F9fqkB7iUQ//HUE6XLO+QJhOSriYFFjS1y3/uvM7LX4ny660hUC3EBChawDpsWNXJif2XZ3OV1uyIX8Z4AayajQJ5uGxeTlz7rTyZaPQKrEBQgCS4pOCcAVElCbfpS3GtRBF8eHVR1tuTMQPla8iCCkT+6n5+6cRHsISWgvDdCgfhNCXkCBSFv6yhPhFyujOo4unELpUSXfkI0ZQFk3xjCVuRemyp5u/D1sRRuPYrChKrufusYT7yE2nWot1WP0gTFUsMlkVCy1PkGGzzGYNFPjPQVZ64TUGPvw5eJATCE+RYPUO3e2KwsfcIz3S9UkdAy5YghhYoFxI3qIoEGueR78uYMV1iF34LIXbGsSUMStM+KyEg0/UB7JH/egjYfvYfNestMNrYVuxgTl7HnZDIF4/cQNM9l4gz/AdxbPru3hnlctvB9qy6X6UlaeuCYFuISCXyzaRHj08O9n1paXJ3n+6Pnn2Hxcne787eZ+pNpPvWHQr957/eUPyzMiNfVPujgGihIVAAQKmxBLEVwr4bSPvnCO+2+H4lez/oTtUmE52rImrKOzLf74+tdBMXM0/Q4FBaWWPqlCRSRW+36xKiWt+ChMbJhfNn2HkHgLsS5G7JcoaylinhPQ3712VKuNFeWCZg6gW1a0o/nTdo+0gE7SvL0bmuM7ctzoCEffbBmJDP+WPc6yDvmWoTKEOy0AfhhSE/SUMZ7+pR1NkyNK0I+lSH18gQEbmuBe6nPphqQtzznwhbvi+IExdyxDxfLz9vDinL0B8fIHgQ5KpC23p3+danqu2nwbn1M/Hh/5VRr7DNNr5zbxEv+x+WmBSNMhkYX0X4X5xq7ay6ygEyhCY/AUoC637UxA4tHN+wtYAX3367fQe+8W99NPrkru+9f6UsL10gXLPmfdJct9TJ5PZ132SEtJXd811e9590EvFVFmEQE8ggCJlo8Oh0nrgzLzkyB8m5mKYm1VZwetshBumCfnAAoWVhs28UR7D8qHssMId5QqJnJ8edVz73DqnrJ90LpYnJqWDwg0BpcwxhIfRfFuZEPe5onwpw8je1Wn5ydtWEoRgmaQKsCOjdYW6L3f12+5cBCEjvmUCJRfCae51YR5YPSDCJqEVxK7nHcP4aV28wDFpM0hg8bLyN3LPCoZmrYPIsU0EbcFqo0WbKPtlsHysiCjK4Ibybm1Dn6IvgCt9btM7E9ZcSExMH7H0KTv9bsTNoaMPh/2XeqB8Q7gImyVpmb02CutAnLAdsnDkWWLwBhytj9A/yNvqmlzOJys+fYgyUg9rB/Lm+UnTdf0s61koa1/SMBn57arUTTh8Vgx3iA+WVd8DwJ5f6gGB89tnfPuR8QGYsnLQl8K5j1auorhh+2RhF4axdP0jdeNZhaRafwbXvH7hx+Xc3y9wz7uT5w6HYfVbCPQbArOSH3zR7ZY0GLL3noPJF24429XKQN7YMsBf/fKZkSXJV3dPXkCgq4WKyGzvPy1K5t10sUU8cb/EWufXIyKZxoJ87derk2fe6g/rZmOVVkJ9hcDpkd+1FNrbfr4hUzHrqwqpsEJACAiBPkAAErrMWRORPAslFkPf5ZVBCgisL6P3/65lcdU73EdG532PwBWfrJPLZZutuHLb2eTC2SvcXLTx/eBIbonb/+3E5X3h2ky+Y9Hv+PpYOu/PMmAbhHk3Td4zyu7pKASEgHOl9Nyx1i48J0iEgBAQAkKgCwgsn+sWQHEL5vDHfpqvf2X/lFzDlUlDKy0WTXOfxfqfZSmdkqguCIE+QkAulxGNhfVq139fmhK3vODMQ/Pl8JPz05/3PnkyJXh2LyYtCxt7HHKWts2/fGtScBZqYW5fnhDnvCOi/7zylklBXts9lLpgbv7l8XSvu0k39UMIzGAEcPUxt8tH17yeumDNYDhUdSEgBIRAVxAIXTSZ+8dCR0bacO/GDdMEF1O7Z9d8wscKvhIhMGgIiNBFtCjWq7sfOZWMvjw7eemxBemcuTs2T+y/8+quoWTs+FXJXd8Yn0eQFcayKUrr3LGrEgjV4g0fJTc6K58vuHUi/nXL946RsQQCN+RZ2Dj/wo/fS8b+nN3EYV7h7zFXljkrL/hF0LkQmNEIMKLLogAsEY9CwdyhUGmY0QCp8kJACAiBDiDAu5cFcfz9NNO5mzkr8TLXzxdcNm0rFVw29d720dH5oCCQre0PSu0arMctX/ow4S8la97cM7KAbKWE7vJCKFlh/KLkpYWbJoQO0hYuqnKHI2z7fjQ86XqYr58H5/4CJ2yrgNgWBWFe4e80sP4JASEwCQEUBVvsYLtbXl+KwSR49EMICAEh0BEEWGH0wKhboMZtJbFx8cQiPJaZLQLE4k3he5lFahDChFu2WHwdhUC/IyBC1yctyEqURsqqFJm5fXu+cYOz4E009ZLPfZSs3Ko5QFVwVFghAALjq0quaK3gKFSEgBAQAkKgOwhA1Fh1lblwuFnanDjeyyGJ80vEqp8sksKegJo75yOj80FCYELLH6RaDUhdmG/HXDysam8+d20y/N/OV66ZkTm2VmABl1VbziX7f7RQ+85VRlIRhMA4Aixfzp9ECAgBISAEuo9AGYELS+QvaBXe028hMCgIiNBVbMnhlZNJFaTrwrnOLBbKHLmXfjqxV8rwqvPJm7+8NpmDtc65Z57cN7H3VVY1CINl7mbnKrrhwdHkF27j81vd+foHT6dEMSuOrgkBISAEhIAQEAJCQAgIASHQPwiI0FVsKxZHgRjt//HCNCaWM9+dsWJyreCQr9ClEvIFoWNbhNvdwiernIVt3w8XpkQOi9tsZ7njXp5AAJFFjoSySAoWOsp91zd7e9PzvProuhAQAkJACAgBISAEhIAQEAKTEchnA5PD6ddlBIbdyo+b//24I0gXk1Nu1cuVW88modUuFqyUkF227mF1e/t3V6ckbXj1+OqSkLD1zrJGXuu/N+ryuZBu/P0Ph990ZXirNF9W1Fy55WxKFLEk4m556tCc5BdbFscWUeGEgBAQAkJACAgBISAEhIAQ6GEEROhqNA5ECXJ031PvpEeIWZFApl567LopQe576mSSXErcfnGfTs6/f0Wa3v/YdyxdTdMCs1Llkg0fJ7/97iK7VHh8bffcSffv+tYZt83CX5J/2XBzuucc1kTm4v21I4oSISAEhIAQEAJCQAgIASEgBPobARG6LrQfbpP8sRiJL1jcvrr7hHOBdPtZuZUocYeE/IWCm+fseZdKFzJJFzv5p+sn5WP73v3f+/6csMk51j2I6CLtMRfCrN9CQAgIASEgBISAEBACQqDvEBCh60KT3fH1sfHNyN0xS7DC4cY5Z94nyTMjN6YLnoThIHVY8fYWWOrIB2shx1Agdku8zcpx8ZQIASEgBISAEBACQkAICAEh0N8IzEp+8EXn9DcYsveeg8kXbjjb9cpgVWNxFNvIe8xtAn7q8JxJrpOEgVSVCXHZQHzezRdTy50fJ3XddJY+Vqk0eXXX3Fa+XIvNh7Dkdc65YBrRC38TplvytV+vTp55K86ttFtlUj5CQAgIASEgBISAEBACQqCnEbjik3UidD3aQs+MLEkXQcEyNxNEhG4mtLLqKASEgBAQAkJACAgBIdAoAo7QyeWyUUSbS4z5dcOrJ+9511zqSkkICAEhIASEgBAQAkJACAiBQUBA+9D1aCvOFMtcj8KvYgkBISAEhIAQEAJCQAgIgb5AQBa6vmgmFVIICAEhIASEgBAQAkJACAgBITAVARG6qZjoihAQAkJACAgBISAEhIAQEAJCoC8QEKHri2ZSIYWAEBACQkAICAEhIASEgBAQAlMREKGbiomuCAEhIASEgBAQAkJACAgBISAE+gKBgVoU5f954b8lc6/Shtl90fOCQh49d3VwRT+FgBAQAkJACAgBISAEhIAQKENgoAjd62PXlNVX94WAEBACQkAICAEhIASEgBAQAgODgFwuB6YpVREhIASEgBAQAkJACAgBISAEZhoCInQzrcVVXyEgBISAEBACQkAICAEhIAQGBgERuoFpSlVECAgBISAEhIAQEAJCQAgIgZmGgAjdTGtx1VcICAEhIASEgBAQAkJACAiBgUFAhG5gmlIVEQJCQAgIASEgBISAEBACQmCmISBCN9NaXPUVAkJACAgBISAEhIAQEAJCYGAQEKEbmKZURYSAEBACQkAICAEhIASEgBCYaQiI0M20Fld9hYAQEAJCQAgIASEgBISAEBgYBEToBqYpVREhIASEgBAQAkJACAgBISAEZhoCs46/OOfSTKu06isEhIAQEAJCQAgIASEgBISAEOh3BHa+sfj/uurT157v93qo/EJACAgBISAEhIAQEAJCQAgIgRmHwNVXXJgtl8sZ1+yqsBAQAkJACAgBISAEhIAQEAKDgoAI3aC0pOohBISAEBACQkAICAEhIASEwIxDQIRuxjW5KiwEhIAQEAJCQAgIASEgBITAoCAgQjcoLal6CAEhIASEgBAQAkJACAgBITDjEBChm3FNrgoLASEgBISAEBACQkAICAEhMCgIiNANSkuqHkJACAgBISAEhIAQEAJCQAjMOARE6GZck6vCQkAICAEhIASEgBAQAkJACAwKAiJ0g9KSqocQEAJCQAgIASEgBISAEBACMw6Bq2ZcjVVhIdADCIwduzI5dzzu8Vuy4eO0xCf2XR1V8nlLLyZDN/1lUti8uHPmf5IMr7yQhrUynXjh6uTcn69K+H3ihWuSjY+9m9zypQ8npacfQqAMgTd/eW1y+Il5ybljVyW3fPnD5K5vnknmzL9UFq1v7g96/fqmIVTQFgK8s1/dPZSc+A/3DnfPHTLvpovJHV8fS24f+aAVrugk7ztw75MnkyWfG/8WWfzzZ2cl+3807L4TV6f53PXN96eEsbB5R/LjWXrzuWuT82evSMu9aOX5ZMnnP07u+sb7edF0XQgIgQCBOI0yiKSfQkAItIcAH9tX/20oec19fLNktiNad2weSxVhu3/q0Ozk8M75yVgOERxyRI44875+0aKkRz66J353dfLqrqFJcRdv+ChZte1cGuaZkRsnxbEflENkztDQMRYBFLznv3FDK/jhJ+Yn589ckdz9yKnWtX4+GfT69XPbzMSyG7F6zb3jkdtHxtKBOL4XLz22IB2Yu+TGUu7YnE/qRg/PToq+AyGZIx+ecQb9kDH3TXt2yzXJ5l8enzKgmAYI/lHml362wA36zE/v3OwGDe/+8bvJqcNzJtL9JEnu+pZIXQCdfgqBTATkcpkJiy4Kgc4iwMcR5ZaPWJbc9a0zyfoHT08a7Vy15Vzy1affzgqeQLzue+pk+vELrXNYRfgo+so0H/z7nnonJWtY6P7h8JvJyi1np6Sd9RGfEkgXhECAABaCUPIGL8Jw/fB70OvXD22gMo4jYETMJ3O863nvY60zefO5uXaaebTvAN+GUPIG9YzM+eEZqCwTyNyzWxZPInObnCcI366XfnZdK/rbbmBIIgSEQBwCInRxOCmUEOgIAriWZAmWtizJc1kbdumERC6Mf865tiB8sH1yZ+Fwvwzlli/nj+iGYfVbCBgCsxdM7UtYkAdFBr1+g9JOg14P3BV/4YgR1jGE74D/bj///oSKt+TzH0XBgYtmKLfcmz3wyEBiKEM3T43vhzEyN3poTnqZ98Ldj7zXCjJ73kSai1aNTwdo3dSJEBACuQjI5TIXGt0QAp1HwOY5hDnlEbcwnP2+MZjbYNftmLrk/Hg4/eCv/96oXZ50xNUlFOY+SYRAVQQYkHjNjdSPen1q/fdOV02mZ8MPev16FngVrIUA7/Q937whueCRNrw6fPna7rdT135IVpG7pR/nzX+/1v+Zni/5XDYZXP/gaPLb717fCg+hLMsHN00jc0TEG8X/3v2tsy5i5WPQBK8UiRAQAnEIiNDF4aRQQqAjCJjVzE+cj2KeMCJbR3773UVJ4uZQmCtOVhrhwimUw//QZsXRNSGQhQD95qu7T6SLHdDHb3WuxWUW5Kx0evXaoNevV3FXuSYQeOmnCyYRI97XoYs8z1yVOWiQRJ9skRvTAvK+A5A3BhPfcIuazHN55blmWqlf+ul1rTl3XBuf9z3ZC6RqmS1tHYXATEdAhG6m9wDVv+cQyHJjsULmWfSK3FwOPTnPrSA2N50kbytaWnp2ZJEHf6SX67e7ldEkQqAdBMoUvHbS7oW4g16/XsBYZZiKAPPmDj85vpiI3V25deocaLsXe2SlyVDK3O4hYDGWNAYjDz01ucx5UwvCMui3EBAC5QhMOFiXh1UIISAEGkbgwrlqj6A/YdwvCqOjWcKH/z/dstIseFKkfGZ9yMvcOLPy0zUhIASEgBDoLAJ78bgIpAn3+KyFU5r6DlDmcNAwb25eUDX9FAJCIAIBWegiQFIQIdApBEL3FvLJmwi+/0cLJ7mrlJUpnWPh5ivgihPOrQjjsg+QL7jCZFnzCAdJZG+80L3Hj190nrr1uLlVWAUR8mGORp5bD2HIkz8slJBTC8uor7mKxu6zRHrEY84gaSLUxfb7Sy/U/EfdWPnN0mWBAepnWIKfXYvNwupo1tmYsoLJqNvmAmuvP6eFclEGyL2VKSxHiqdzz81qX+rHanpzrvukdF8r0qHslPsOtxBPrMtliCHlqOv+aziwvxWL/lDv2HKEuIS/Y+sH5vR1yoBQH9srkrpiaWlyvy0fP9o4HMjhPnMbrQxhvar8trxY3KkIV/oc+Gf1qdd2z01YvON2N+/SnuuiMlie4MqzFD73MfWj7cgzxMbypbz03Sb7i6XNMX0u3PYz9g4El5j3D/EOuqX+w+9G3efDLxPnf3b19oV0i9rVr0eW+yRpWZnDFTHzvjF+/lnntDt/vFesT+W9y7Li65oQGFQEROgGtWVVr75FIGu1SRQMFD8+gln70KFgh8K8OZSW+9yGsEXCx9FWSbNw4Wgv+YcjrHd940yl+RkobofcnkNsWo4i5i+YMduV/2u73m4pDyg6KF0sD+8rAtTflF/C+IsClO2zhKIHGaEM4BKWYXjV+YTNc2OUSsPJP+7/8cLWMtwoQiiDb//ummTfD4eTC5eVecKTR5lQVto7XQL88l7cfrvjBrXxZ+MrwxEWRezt/xgnkr6yx4qmRuj88jH/xvaLSnEGbw9r5s2Eyjf57PrS0tYoO2W798l30qrQh9jnEBIJUQ5H4iF0ZUJ7YoGmvdkjEcsACyPs/+HC5JxTftd/d7RVl6K0TIGkz0JaUPwMfzZB/mu3kEOMi5ifR536EccfhBkfiBivj9/3qetd3/Bzq3/+0mPXpf0b/OmDbz57revzcx12p9O281P+wo/fi8LTj0MfoH3S59O1l/U16pY3aAQOvDtW/ePZKX3q2S2faj3fEBX6ZNHzd9i5jxPO6kfZ8C74wo9PJf+y4Wa/qO7aRP3oE/Rzwr7tyk/88J1jkSmrbQFAXpt+9u6UclvYqkf/HWjuhuY6SXnudvXIIpmUn2cvT+hP/7zylvT2Rrf8f1YaeXHtOs9LKKHbPfjT9jxT1vYWx3/XcI2+EraJheXI+8zK7LeVH8bOqf8h3ocMJl1eBdN/HzIYAHYSITCTERChm8mtr7pPKwJ88GKEjxlKBh9MSAgbxYYSjlAy+dzmzRWNsJJO1l4/PqHzFRw/X/Y4iplwj6KAYgtphCgYafrFP34qOblvfFNaFCyI1iSl0HFUn8yRt5EMlESfzHGP+hp54bcvviLoK5+7/vunWwQZBQWFLy8NP73w3McI0nmv2xPQFFPabw8ruzmlC4E4FomvlBv5CJUj6nrihXMtPIaW/sUR5SunKFnm0vSqU+ptA1/LG+L1m3+al7aLrxxxPxyp5xrKFO1kQtvQDvQ9GymHFPphCBszyg9+1tZWZ8vnJMTBlZXV9CB5ef0ZjCBsKOO2LyNlo//5m5zjglyV0FWtH23OcvKGhV8nnhnaw1YHnHPdZcZuFa5xpO7s62VKdtjHebZC8Z/x8F7Wb3A8tHNe65n1w5xyRD5PaFtwCFfRpe9YmxOXMPSxrLahfv4m1rwLbXl+nmE20A7FXAXBmgGMsI+n+blBCf8dRj5G5qxMB927lD072xEjtbSP3zdJk/nP9EnKQx2zyA2LjsQIadchc6QN+Q/FMLTrPE/nz1yRvmvtmh3tXWO/s9z47V54zOuLtIdtPk7dWFWT9zN4+pug02Zrvnkm990Q5qffQmAQERChG8RWVZ36AgFTvsLCDq+e2HuHDxrEBUsD2w2gmJRJaulwpA8LWszH3VdgSJsPpxEnn6iE+YZWvfA+v/34KPZsHpsnWM1MUhckp7yH5NWUBlMSLTxHyG4oWYqgTxpDJW/MWQ+rCsqFj+GQK4eROdKCgFDv/z1yY2op8u/5eaXEz7W19Qvaz5TbrDjmwsc98FrjiMKzW8YJsqWLKyvpGnmw6xwhKSiqYPTM/TdOUXjpR9YPCL/IKXOhWJtRx6GbPkxGX8YdavL2F0V9EOx84hMqs7SzP68HxdYw8csC2fD7xH2OUIeDHH74qudF9QutGKS977KCbvmE2KGU0tfo33l7UVrcsiPt55M5LH5+Hx92e3n5G0yTHmGy+lRRXrQjfyFBJo4NzITxGcix/nz+/ckDWFmeCBccWQglq35G5ggLGQgX2/AHEcCaPxaHgjj5wmDWXd4FMOH9ZxZd71btU5+8kwhl9/tm2Dd4VqmT3z6sEks4nnl/cIL0KK+9V7M8NQgTI+F2BVkukXnvZdIPn3PIoHkj0D9DsXuU2a+rhePdwECYfWeMzHHf3jsWliNWw7zBHj+czoXAoCIw9e05qDVVvYRAnyDgKzpYHHBRtO0GikbCqR7KDwQwdeNyCn6ZEN4ULgtrH+Z0iWlnceHDax9fC8MRpSlPSPeZzUtaRAelA6uVL6P/NVnxH149OT2ISCgQFBQzyozC4Uto+UrL4EiUWQEor68IZqVvhNFPt+w8HNlGuUUZ8QVFAxcr2iVLCP+/N9/Yaouw/SBXoYREINwCw5R2iA4S4mUEGGVq5bapK+RhbfMFZQ4Lqy+hAhlaYQibh2lI5iCwKN4m3PeJMtdD5ZdrKMwouVg4EKxhvsIc1iPEIY0U+S+rfqEVg6RCCycW4lDMMuQP4IRhyn7Tx30yR3j28fKFfmLY2PW8NrH7RUfeD1nPPmXxBeJn7oRcDwdPeCZoK1+yNmwvqx/vy7B+WSSbgYCw7bOI6PhgwMS7KG/BKb/ceechmeOZtPdrXhyuh9YtsPIHV/y4RrI4+v3eD1N2zrMWYphnNSNsKOF7gftW5vAdwT1wsHJnlZm+42+YjsXZfzeE7zp/EJL0JUJgJiIgQjcTW1117gkEzMKSVxiUARRaRiazPnoWj4+jSTp66zy4Nv2vfEuYheUYKg5cW/L5j9JReD6qX3367fTDm1XWPAWDNJi/5xPFcPNY6uYrEHyQbU4J8ZFQeTYlEhccLDmb//2tFkHinv/BN0XXRndJz7da8Dt0QwPHIpyJEyuQqFDBXfL5j91iIlPd6yCWvpWKPEKlPJ1L52WOAoXC5MsJN4fOF4gGbXjKkd+vug2GUVTBGUFB8uNnkZIQf+Ld/cj4vD3OUY5DvJin5EtWGO6HdSZcSCpR1K28xKGNwz4XKsyk41vwaIPQOkVfrCux9QvTx8rIQEQo9Dl/ACe8X/abAR//ObvduSL67Ur8LJdqLD7tiN8ulo5fDtrXBhLsvv8s2jXayn9/hf3Qt/ARJ6t+WGZCCdOx+1gry4Q+7Q8+1SW/PHuhZRwreiinMghSnqdAODhBWmXbCoT5Zf0O3y/j6Wb3kaz+VFSGcMCLtPPah3sQRt/aTl8Ln1l/oIA4q9z7TCIEZjoCU9+EMx0R1V8IdAkB3NOyZHyxDregwo+HUwXGJypZ4e2abdqKNS3LhcXC+Uffnc2us8rmnv95Q0rmLJ2sj/IdOfvU2fw9S48PcqhkQ8p8wWXI8rLrYZ6MbDNXhtXgDBOIK6Q0HE0OCSVKo08GUDh9pYAyhiTKylF2zNoDEOUWy4LfFlgXQ6saafvKC79DpRXr3GtuvqIJpMUnVnY9JBsoorgs+S5eX3PEDoXM8LO4ITHj+tjxqRZS2ggssWyEBJxy+iSdNMJ24RoS1jkk/ISBmNAvUDax3ob50YY8I75MUfxcf/HLBLZh3f34Reco6H5ahM2rH+QzdD3F3Q/y5ue/4Xunp5DiojL499J+4QZ8fFmTQVZDyxhlC0mfn0bMOQp5lnXL4obzW+06BDt8zi0t+pXfD6mf/4ySxqoMS/Lof01+j+YNIhCf5y+0npKP/24gHGXEdTpx4y8xFjXi+EI9Q0JLucJ8iJNH3vz07Jw+GEoROQrD5v0O0+V9mFVW4ofvZa4VlSGLADK4lSXgxjvLf84ga36fYRDHHzygP5u1OytNXRMCMwUBWehmSkurnn2DAKudoQwwb853EaQCeUoUH2Tm4+DClPchzgIgVG5QqsjbXDwtTji/gg++r3xZOJTscN5bOHqKVcFG60kHa1tWmUOCgmsaK535ZIYPPQqy/8FHQQuJ6qpt56yILbdUu0AZsF7VVXLJH2UtFCN1KCnIuJI42aqGcmIuoRbfV1pDxZB8ILF+fYnHqLZhym/qhHsu4X2FlDr6hIKwJsTxxVea7DrloQ+SbmhRy7b2TlXcaJ+wznnEiH5BX2RAIKxzSAopk183sPX7IlZN5qHWlSzrSJ5imqdgYrGhXCZZz5DdKzuyaqkvWVZbnke/XxA+61nz02n3HKvabLcSIeQ5lKw+ZZbg0HoV7rmJ4h7iRf3CNPP6UliWot+G23pHuOsIc519UkIa4fNi6Wa50We54VqZLB5H+nzd95alk5Wu/86wcBzt+fevlQ0QhN8s3jN5fTBdvCawuPq48Z7zB3HI27em+uXSuRCYaQiI0M20Fld9ewaBLDdGCod1iXlzNtG9rMDM8UC5RaHzLWFl8cJRWcIzr+2W/z55yXoU8FA5yfvgH8xYtMUseSgOz3/z+ta8KMgjRMpXwq3MoZKBEsDIcDhaa+H9I1j4QlwrLwqBPycHzDb/+/EpiqIfP+YckhUSIuKhbEJg8yS0VPpKK7izkpsp5CjIuMCGSi1ph6Pg1Je0sQDFCnmXCRZSBEU3JFhhf/Jx99MNFXXaIEzLD591XkYKmbNm7m6Ug/l5WVbgrLTzrsXWj/jgn0VouEe5KH87QvypRGZi/qGlHboVc92eRwvT5BGMWKmS58HmaBalz3POoBJ9wFfys9p35dapbnVZqz/mkeyicoT3eI/xfrL3Rni/6DekJ7QsEj60MFsaIeHhepYlP3zGCedjxu86koVhnptp1qBNEUbhM0P58spMXwhx4xmydwNpmWu6PdNf3X2idb9O3RVHCAwSAnK5HKTWVF36CoGskVkqgHWJvYRiR15xx2Ok1rdcxQCR5TrDHj+hdSHzI+7c+UJBkfFdA7mP2xJzmNifzKxmKfF0ylneh514ofIC2eCDDvkqEhRBI0AWbpHbJoCtAKgHSjDKAIoCim1RGSx+zBGSxVxHIxF+HOZBYm0NccVSE5Z1nlvC3C9raglzLkerHF5F/SGcP/f/t3f2PJYdRRgeW95FgtUCQsbiM8UQWEKyHSMZOQEJkQCJ+QP8AfsHABkBHzmySCDATjaxIxInKxIHXkuWHAESGLwsMpLxSF76OeMa132n+nzcuWf2zp23pZnz1ae76u3uc6u6qqsJGgBNlfKXaZs6RwGOMjgnmiDr71SI45nyUmGL0KbWuUp4naKrWvNz1AyhWK1oZ2ihzxAcA0E6hMKpcnvP5/KX38eyyHvqekkeXBKn9lzLZel5paipZYrxqOsH6U/Rnlrmea/pc1hPwrpfBTjBypn7Be3FeNRvV9W+yh/06lYclKV9c4ov1rBlmviG8K3BPXmbhEKrqTdpUSk89NtqrOsYpw7WO583aeChodzmHl6lioae8sf7tVW7Lrtqcx3T9F/2tJz6Hla0+54ROHQErNAdegubv0uHQCUwwwSCRi9Vbni9vHFfXRq5jzCmSYWOntBUKX5DwIfmyff55jr3eHOby4KT1pOvVXBgFhsry5RgXtFwrbllHjUawBVr5lwaMj1zzsPSWCl1gyLU1v9k+kPBzWVfu/ExraxlnCt8a1tiaWVD5CWJ+tRaEOHBUQ6wfH72ax+cCS5DHaqAc68KlFDlq9Yg8v5Y0okD8saGwwS/QUmshOKxMseeVXRX/GkZuIO9+lzbH062csDijXuZBurR96tr2qJylc59i/ewpqplfa2+T30ocwjboVBVEUnJF4kJDcZAXmcaz9TFGyVH+SPIjE4iRN1Rjh4H691vNu/mrRKin7MWc9v+U02U9RSvKm9liYRixYR7lZLL/bkJftXS21M+KVNpmJog0O8SZfTW22nZ5OX3g3HNOMHiO/d7yLtORuCqIWCF7qq1uPndGwSO3zvr8Yybz1IhjzVoS3/oKosDdavAp66PgKd5AlBVwriPgKWWqcg/dqwEgbyWovduZfVkNrdHc6+cbe+j1OFKq/tdIVgjOGU6Kh4JarFUkKQtVXBH8cp1zeGnF20RoQ83VQJEMHFQpWqWvxI2qwAQS8PCw68m+u42/UzL6V3P5U/fRwnpKXVV++v71bUK4ORBGc+Jcat7s/F8zJqS39/mfNgrswneYynWyzFJxMRHtX6WiSvtzzom6JPqrky9PcVpjKb8DCWbcbDEdT2/z7kGoeFepcTAg05MoLjGxBDvRSrHeKHkRv65x2oCrDdRQZtpu1RjPOqmD2pfHVMANS/lLP0tjLp9NAJXEYGzEuVVRME8G4EHgID+gGH56gnMPfIG18G0d1cvn96v3Fty4JDIX66v+PbJWh0Ekpx0byCebWN9qZTNvJYi16nnamHS571r5aWXL9/HQlCFokcYhF5Nio8KR+RXwVXLqK4r69Gu1kmhnKLMEeQCxUStJNBTCW7ZopKxDYE+81GFbc/P9Tyshnp/6jrTMZU3P1/C30vPfOHMdhVgxvo9xndOOv7zs7Hzyo1NlXFcGVGwNE1ZsDT/3Ovh29V4zEn3heQZm4szvrH2osxVykvVH9Qtl3XGTFpoGlMwNK9eo0gO6/+ED803da1WQ/JXE25YUDVVHhLkqcb40gkbrYvrykugUj7JW/W7sfWKS2ge8z6h7l7adkz3yvN9I3CZEbBCd5lbz7QfFAJTQRtU0EFo3jZqn1oHum6ULRCJJoQmfkhvfY+AHWdD2+f8lUUmP0fwJCpeTpUgMNeyoEIz5faCz5w8e2gI1KLrujI9vcUQ6ckAAAnjSURBVHN4qyw35KddlJY5lqgxwWbAvG3Wrnkqt61KUO7xMXb/xM3yuAWveadU5ni3aq/Y2BnhnS0wIqlgzv1/jLgS85wAJ5XizLNIukl93I8jmNFftxEAl/CHMF9ZPVDUWWOZE1bFXaXcxxlT9++3yZbN+ZbTTeHB4LXnNwMHLaVD935DEdHJiFL5/9sjQ2CLJ1+4Wypz0JFdIIOuXB994X/3zoou4Emd2/DHO6xrpI2Uj6Bh2yPfaU3UpxbUMU+L0vuhfYfPm9R1F1qD/1d//OigfEcdY673fMP1eUVzz4JabT5OveDUS3xbcGee+g3qve/7RuDQEDj7VTw0Ds2PEdhDBPSHivVhUzOuWdBBWYjgA0vZqywOvbrV4hVCKFYbXWdSzewitCiv0DsI2E05+aAJZupWUwkCcy0LlfCkURUDLwQQokiyZmRu+fEuR9w7sbKogsUzBMtcJq5GinFFK8pLld5++ZNHLz3zxWEdoJajbQQ/26Rqtp01UT2rQdRRzfKzfop2RyHMkTYriy3v51D+US79lKio775xfcMFroqeiLWzUvqgAQWHva22WWcKLWP83f7pZ075Q8AkaaS+4Wb7p9ajarxE3rFjFWyE4Cf0HfBCwcd1Vy2AoUxj3Zo7QdKjI1ubsUbnvp7fod/nhMI7psyRtwrZz/qq4A/LFntGar8PPIkqy76FcxPK4oBJi+67i4mQ+EZG/Tqxw314yBZ61veO1a2KF2XqdyDqm3usvltRJuOW/T7DskjfVstjfL8Yu2CofUAnDaFLx0DQGvXEdRxxga0SgaOYKKomEqr8vmcErgICXkN3FVrZPO4dAlnYQgBfuv6HmeTej+AUs2NulPnd6gcfIQoliB9vFUBw88v7flEWQguKCOvYImHBgH+EGFXmyKOCwBIFBbdRFfSoC1e4cEPEZQ8aEFCYFVc+gs6pY6yVQWGoAjtkq4lueE3ZWLH+/LPrG9WgPNz6fhOOPpp9D1o50uZKa9VGvVnwjYpmXMzFBjc6Tbiu3W240Ma5n0L/sNdUs9TkxHoqFKHgO/oIyoIqlFgQEJq1nVm3SFsTKZTE1h8o7QRVYHuMTEeue+p8Ln9hRYIGhFxtqyzAIwzPWRNa0RaKS35G2SgyCPrwGrTkPChFKH4I6ip853xLzuFjzEuAKLcxTqANL4RQGnr1hOKZny/lr7cGrnIDjSjBbAmyi6TfIF0rjXIU30kwqcZ1pqMa47tov8qFEtqYFMDC+8TP/3NKRuXmTLvy7aMc3QuuUgD5jldW26iEsa5rCvkmUFZMNsWYZj3vecZ01OmjETgkBDZ/VQ+JM/NiBC4BAsxga8juHtkhpE3N5vbej/ulBaxw30HwQuA4buuocsJqUymgCNrQphYKhLE800qZbMtQCSX8eGfBl3qXKCiUieCgM9oob5kGBNFvtbDk2wr50BUz1gjwWCyffOHfp8IqAn3Q0FOMEDrf/mNTfCQCIuXxFwnl5dkXz7q08bwSyr7a+D9Pon2WCEvXbzbpShKuqD2+sZS90lyltF9lvhkXvT5CVVj9qjLUBZb+iDI9JkgK6Wcu5/J3942Pg7WgoCLwUv+pG2CzepDoe9ta10/ePy4V2txu8a0YKvzoH/hWCnLOs+Sc+ubyQXvS7nPGW09hz/xVSs4c/qp+QLnbWm8rvPgGZeUEukLB5/uG9YtEnjlBkKoxfl4LK/VXllBcz0/6yL/Icpoql0i+f6HMKa6Vm3Iv2EpUwsQA7RoTAHEfmrJLPN93fjO1zsjvoxG4qgg8dP9N5jqcjIARuEgEsBz8qbmBfWeBUvHKc48OQjCbqZ4nvf6rmxuv4wan1oTIgNsbm+ziYoVlACtXrLGIPHpEeCHoCopKCO0IsbzH+5UiF2Ug8OiasDl1xvtxDBqyFQfFiHVslDdlJYhyekcED9aNoNiCzd3mFgjt7zUhHoUUARZr09R+SbgEvtncr+gPWbELWr/etjoYE4LhU9cpVsp2j498n7LY1wsrylQb5/cG18rnPzcosAjHYPvUxFok3kHBBsfge24fibqjb2YhkPopB4EXxXYJH1GuHqEV9y760hh/uHViXcKagKCLUDvw1gyY9AkEUYTa3ljTeseulSbGlCoH0MOkQtC8y2ivfIsYR1O88K2hb/cC6vR41D5V8cc6QCw6S/n73eNf2ai2N/GwkWmLC/i+89sbG5ZkxjURSae+C7m6W801HaUwEvz+8PZf4/JcR9rnTrOC8Z1m3LBlQq9N+T6EdZ28eBj0LKHR9zJxP7j9l0kljHbX7yH8Ut9S3HLdPjcCh47AL9567EdW6A69lc2fETACRsAIGAEjMCCQFTosqJXb975AhYLzh6e+vEHOvtMMsb9/+ksbnha7tAxvgOELI2AEBgRQ6DZ9qQyMETACRsAIGAEjYAQOEAEUpEhYTPdZmYPOKmJqXo8cvOzTEYu5us3jaeBkBIzAughYoVsXX5duBIyAETACRsAIXCACuOPypylcF3Hhm7t2Wcu4yGtd74x1bhduxGvyoEooivOY2/iatLhsI3CVEHBQlKvU2ubVCBgBI2AEjMABI8C6sIgi+djT7w/BdSKABtFXUeaWrum7CLiI7stm8FlhIzJpJNaSVdFy4/mDOJY0t7WDkaCZ9bRORsAIrI+AFbr1MXYNRsAIGAEjYASMwMoIYJULZY6qiI5IBFrcFAnURPj9fVPmCKZEEJGImssWKAQWIghJuC6iGBF5NhTTlWGcLB7XVbavCZojIu0QoKhFv4zkfeICCR+NwPoI2OVyfYxdgxEwAkbACBgBI7AyAnnvx6gKN8vXWhTWfVTmoJGovqEYcf1uU/BQmF7/9cmm2qHM7ZPbIpEoM81s2QHN7EtHgmaih45FNB4y+p8RMAI7Q8AK3c6gdEFGwAgYASNgBIzAg0IApYetAXJCuXjiJ/faFjF/3xsLV6ZP94P7xM0PB6siChPRIb+7YGubXO6a52xZAa6R4AFLKMozNGNN7G1/EO/4aASMwG4R8LYFu8XTpRkBI2AEjIARMAIPEIE7L944Or738NG1T3/YFIv/7qUil+HBVRSX0EjsDcq+n3k9XTzbl+NlpHlfsDMdRmDXCHgful0j6vKMgBEwAkbACBgBI2AEjIARMAIXhID3obsgoF2NETACRsAIGAEjYASMgBEwAkZgDQS8hm4NVF2mETACRsAIGAEjYASMgBEwAkbgAhCwQncBILsKI2AEjIARMAJGwAgYASNgBIzAGghYoVsDVZdpBIyAETACRsAIGAEjYASMgBFYGYFvfOr9fzrK5cogu3gjYASMgBEwAkbACBgBI2AEjMAqCDx89M1HWsG/XKVwF2oEjIARMAJGwAgYASNgBIyAETAC6yFw/+id/wOkzt9GjEkrSQAAAABJRU5ErkJggg=="
  tinPDFBanner = "data:image/jpeg;base64,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"


}