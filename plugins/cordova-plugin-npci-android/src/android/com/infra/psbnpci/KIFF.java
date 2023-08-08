package com.infra.psbnpci;

import org.apache.cordova.api.CallbackContext;

public class KIFF {
  public static void randomFunction1(String devId, String moNo, String id, String url, String locale, String entity, String tokenValue, String expiry, String alg, String padding) {
    (new NPCIHandler()).setNPCIVariables(devId, moNo, id, url, locale, entity, tokenValue, expiry, alg, padding);
  }
  
  public void randomFunction2(String type, CallbackContext callback) {
    (new NPCIHandler()).startCLService(type, callback);
  }
  
  public void randomFunction3(String type, CallbackContext callback) {
    new NPCIHandler();
    NPCIHandler.registerCLService(type, callback);
  }
  
  public void randomFunction4(String bank, String type, String credType, String credSubType, String credDType, String credDLength, String atmCredType, String atmCredSubType, String atmCredDType, String atmCredDLength, String xmlPayload, boolean considerOtp, String verifiedMerchantVal, String forgotUpiPINEnabledVal, String issuerOTPLimitVal, String aadharOTPLimitVal, String captureCardDetailsVal) {
    (new NPCIHandler()).setBankNameCredXML(bank, type, credType, credSubType, credDType, credDLength, atmCredType, atmCredSubType, atmCredDType, atmCredDLength, xmlPayload, considerOtp, verifiedMerchantVal, forgotUpiPINEnabledVal, issuerOTPLimitVal, aadharOTPLimitVal, captureCardDetailsVal);
  }
  
  public void randomFunction5(String paymentAdd, String txnId, String accountNo, CallbackContext callback) {
    (new NPCIHandler()).initiateSetUpiPin(paymentAdd, txnId, accountNo, callback);
  }
  
  public void randomFunction6(String txnId, String paymentAddress, String accountNo, CallbackContext callback) {
    (new NPCIHandler()).initiateBalanceEnquiry(txnId, paymentAddress, accountNo, callback);
  }
  
  public void randomFunction7(String txnId, String payerAddress, String payeeAddress, String amount, String payeeName, CallbackContext callback) {
    (new NPCIHandler()).initiateSendMoney(txnId, payerAddress, payeeAddress, amount, payeeName, callback);
  }
  
  public void randomFunction8(String txnId, String paymentAdd, String accountNo, CallbackContext callback) {
    (new NPCIHandler()).initiateChangeUpiPin(txnId, paymentAdd, accountNo, callback);
  }
  
  public void randomFunction9(String credType, String credSubType, String credDType, String credDLength) {
    (new NPCIHandler()).setOtpCredValues(credType, credSubType, credDType, credDLength);
  }
  
  public void randomFunction(String txnId, String responseCode, String rrnValue, String status, String refId) {
    (new NPCIHandler()).setIntentResponse(txnId, responseCode, rrnValue, status, refId);
  }
  
  public void randomFunction10(boolean enable, String activityName) {
    (new NPCIHandler()).enableSmartIntent(enable, activityName);
  }
  
  public void randomFunction11(String txnId, String payerAddress, String payeeAddress, String amount, String payeeName, CallbackContext callback) {
    (new NPCIHandler()).initiateMandate(txnId, payerAddress, payeeAddress, amount, payeeName, callback);
  }
  
  public void randomFunction12(String credType, String credSubType, String credDType, String credDLength) {
    (new NPCIHandler()).setAadharOtpCredValues(credType, credSubType, credDType, credDLength);
  }
  
  public void randomFunction13(String txnId, String txnAmount, String payerAddress, String payeeAddress, CallbackContext callback) {
    (new NPCIHandler()).initiateCollectRequestAccept(txnId, txnAmount, payerAddress, payeeAddress, callback);
  }
}
