package com.infra.psbnpci;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.ResultReceiver;
import android.text.TextUtils;
import android.util.Base64;
import android.widget.Toast;

import java.util.HashMap;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.npci.upi.security.pinactivitycomponent.CLConstants;
import org.npci.upi.security.services.CLRemoteResultReceiver;
import org.npci.upi.security.services.CLServices;
import org.apache.cordova.PluginResult;
import java.security.SecureRandom;
import android.content.ComponentName;
import android.content.pm.PackageManager;
import java.security.NoSuchAlgorithmException;

import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.security.*;

public class NHCP {
  public static CLServices clServices;

  public static boolean isCLInitialized = false;

  public static boolean isCLRegistered = false;
  
  public static NHCP mInstance;
  
  private static String verifiedMerchant = "false";
  
  private static String forgotUpiPINEnabled = "true";
  
  private static String issuerOTPLimit = "2";
  
  private static String aadharOTPLimit = "2";
  
  private static String captureCardDetails = "false";
  
  private static String credTypeValue = "";
  
  private static String randomValue;
  
  public static String keyCode = "NPCI";

    public static Activity serviceActivity;

    static String deviceId;

    static String mobileNo;

    static String appId;

    public static String alg = "";

    public static String padding = "";

    public static String transactionID = "";

    public static String tranPrefix = "";

    public static String localeValue = "";

    public static String refUrl = "";

    public static String entityId = "";

    private static String bankName = "";

    public static String xmlPayloadString = "";

    public static String credAllowedString = "";

    public static String token = "";

    public static String tokenExpiry = "";

    public static String hexToken = "";

    public static String challenge = "";


    public static CallbackContext credCallBack;

    static PluginResult result = null;
    // public static CallbackContext callbackContext = null;

    public NHCP getmInstance() {
        if (mInstance == null)
            mInstance = new NHCP();
        return mInstance;
    }

    public void setNPCIVariables(String devId, String moNo, String id, String url, String locale, String entity,
                                 String tokenValue, String expiry, String algo, String paddingvalue, Activity servicesActivity, CallbackContext CallbackContext) throws Exception, JSONException {
        Utilities.showLogE("NPCI_MOBILE",
                "Before setNPCIVariables----------" + " devId : " + devId + " moNo : " + moNo + " id : " + id + " url : " + url
                        + " locale : " + locale + " entity : " + entity + " tokenValue : " + tokenValue + " expiry : " + expiry
                        + " algo : " + algo + " paddingvalue : " + paddingvalue + " serviceActivity : " + servicesActivity);


        // Before setNPCIVariables---------- devId : initial moNo : 2b540385fbd53805 id : 919867799620 url : com.infra.uboiios locale : http://unionbankofindia.co.in entity : en_IN tokenValue : unionbank expiry : SGNwcmFJc21ibGpRdHl0aE9yV1gzejk2REhteWtOT24= algo : AES paddingvalue : AES/CBC/PKCS5Padding serviceActivityy : io.cordova.hellocordova.MainActivity@ee9cb5e
        credCallBack = CallbackContext;
        serviceActivity = servicesActivity;
        deviceId = devId;
        mobileNo = moNo;
        appId = id;
        localeValue = locale;
        refUrl = url;
        entityId = entity;
        token = tokenValue; //"abdjhcjdshdjakckjfhkjdajbasdjha";
        tokenExpiry = expiry; //"24/03/2022"; 
        alg = algo;
        padding = paddingvalue;
        Utilities.showLogE("NPCI_MOBILE", "After setNPCIVariables----------" + deviceId);

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("msg", "setNPCIVariables : SUCESS");
            result = new PluginResult(PluginResult.Status.OK, jsonObject);
            result.setKeepCallback(false);
            if (credCallBack != null) {
                credCallBack.sendPluginResult(result);
                //no more result , hence the context is cleared.
                credCallBack = null;
            } else {
                credCallBack.error("setNPCIVariables : Error");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void startCLService(String type, CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "Inside Start Service CL");
        Utilities.showLogE("NPCI_MOBILE", "IS CL STARTED : " + isCLInitialized);
        if (!isCLInitialized) {
            try {
                Utilities.showLogE("NPCI_MOBILE", "CONNECTING CL....");
                CLServices.initService((Context) serviceActivity, new TCA(type, callbackContext));
            } catch (Exception e) {
                e.printStackTrace();
                if (e.getMessage().equalsIgnoreCase("Service already initiated"))
                    showErrorOnCLInit(callbackContext);
            }
        } else {
            Utilities.showLogE("NPCI_MOBILE", "ALREADY CONNECTED");
            try {
                if (clServices != null) {
                    generateChallangeAndToken(type, callbackContext);
                } else {
                    showErrorOnCLInit(callbackContext);
                }
            } catch (Exception e) {
                showErrorOnCLInit(callbackContext);
                e.printStackTrace();
            }
        }
    }

    public static void showErrorOnCLInit(CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "ShowErrorOnClInit");
        Toast.makeText((Context) serviceActivity, "Some Error. Please restart the application...", 0).show();
        try {
            callbackContext.success(getJsonResponse("01", "", ""));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void callOnceServiceStarted(CLServices services, String type, CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "Service Connected");
        isCLInitialized = true;
        clServices = services;
        Utilities.showLogE("NPCI_MOBILE", "INIT : " + isCLInitialized + "  CL : " + clServices + "  TYPE : " + type);
        try {
            generateChallangeAndToken(type, callbackContext);
        } catch (Exception e) {
            e.printStackTrace();
            showErrorOnCLInit(callbackContext);
        }
    }

    public static void generateChallangeAndToken(String type, CallbackContext callbackContext) throws Exception {
        Utilities.showLogE("NPCI_MOBILE", "GenerateChallengeAndToken");
        try {
            if (token == null || token.equalsIgnoreCase("")) {
                challenge = CommonUtils.getChallenge(type, deviceId);
                Utilities.showLogE("NPCI_MOBILE", "Challange : " + challenge);
                Utilities.showLogE("NPCI_MOBILE", "Challange Type : " + type);
                // challenge = "2.2|BulqD7SP2MjdU6p9ud1W2zMvIuFH5l5zNM48nDNfWuCvglB+qHxVLL38X4KSABPEV3wm7\/3XuftMUIkDdaa4btFL+nvfqOJdpO7Nz5Hca9LFCF\/4DuwDkPs2WHg+kInf2XW0Izaxpe7jKoArKLC3jC73tUhkQeGZsk6GE5Zel2\/sL8qhqCARhLs3eJo7jgZuW27f6qcYmCwu2+EARWR5\/XYp5b96uZLCScu7eunr7ptfRXb2M79ATCVmC72bSpbjAxqtPsAgs+GB4PCJfV8\/zYYZTf4ncA1G8lQWz1krkYhYj7JYH2rIYIDWTJ3pu3Zv0wk7L645qh3jaueSPs6X9g==";
                // Utilities.showLogE("NPCI_MOBILE", "Wrong Challange : " + challenge);
                if (challenge == null) {
                    showErrorOnCLInit(callbackContext);
                } else {
                    result = new PluginResult(PluginResult.Status.OK, getJsonResponse("00", challenge, type));
                    result.setKeepCallback(false);
                    Utilities.showLogE("NPCI_MOBILE", "Result : " + result);
                    if (callbackContext != null) {
                        callbackContext.sendPluginResult(result);
                        //no more result , hence the context is cleared.
                        callbackContext = null;
                    } else {
                        callbackContext.error("Error generating challenge and token");
                    }
                    // callback.success(getJsonResponse("00", challenge, type));
                }
            } else if (Utilities.isDateExpired(tokenExpiry)) {
                token = "";
                Utilities.showLogE("NPCI_MOBILE", "Expired date" +tokenExpiry);
                generateChallangeAndToken("rotate", callbackContext);
            } else {
                registerCLService(type, callbackContext);
                Utilities.showLogE("NPCI_MOBILE", "Existing Token " + token);
            }
        } catch (Exception e) {
            e.printStackTrace();
            showErrorOnCLInit(callbackContext);
        }
    }

    public static String getSalt() throws NoSuchAlgorithmException {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.encodeToString(salt, Base64.NO_WRAP);
    }

    public static void registerCLService(String type, CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "RegisterCLService");
        try {
            Utilities.showLogE("NPCI_MOBILE", "Token : " + token);
            // token = "/JmUsVPgjgJ6eP6S5pCWMR/PX/2CXOYgp9SffrBqUpM=";
            // Utilities.showLogE("NPCI_MOBILE", "Wrong Token : " + token);
            hexToken = CommonUtils.byteArrayToHex(Base64.decode(token, 2));
            Utilities.showLogE("NPCI_MOBILE", "HexToken : " + hexToken);
            // hexToken = "ZbWP0t82Z575PEM5q+3tYetYfJCwZ5DJjAGGmzls0ktWdbWoyPZjBXnfQgKqPvrj";
            // Utilities.showLogE("NPCI_MOBILE", "Wrong HexToken : " + hexToken);
            if (!token.isEmpty()) {
                String randomValue = getSalt();
                String hmac = CommonUtils.populateHMAC(alg, padding, appId, mobileNo, hexToken, deviceId, randomValue);
                Utilities.showLogE("NPCI_MOBILE", "hmac : " + hmac);
                isCLRegistered = clServices.registerApp(appId, mobileNo, deviceId, hmac, randomValue);
                callbackContext.success(getJsonResponse("00", challenge, ""));
            }
        } catch (Exception e) {
            e.printStackTrace();
            showErrorOnCLInit(callbackContext);
        }
    }

    private static String otpType = "OTP";

    private static String otpSubType = "SMS";

    private static String otpDType = "NUM";

    private static String otpDLength = "6";

    public void setOtpCredValues(String credType, String credSubType, String credDType, String credDLength, CallbackContext callbackContext) {
        otpType = credType;
        otpSubType = credSubType;
        otpDType = credDType;
        otpDLength = credDLength;
        callbackContext.success(getJsonResponse("00", "", ""));
    }

    private static String aadharOtpType = "OTP";
  
    private static String aadharOtpSubType = "AADHAAR";
    
    private static String aadharOtpDType = "NUM";
    
    private static String aadharOtpDLength = "6";

    public void setAadharOtpCredValues(String credType, String credSubType, String credDType, String credDLength, CallbackContext callbackContext) {
        aadharOtpType = credType;
        aadharOtpSubType = credSubType;
        aadharOtpDType = credDType;
        aadharOtpDLength = credDLength;
        callbackContext.success(getJsonResponse("00", "", ""));
    }

    public void setBankNameCredXML(String bank, String type, String credType, String credSubType, String credDType, String credDLength, String atmCredType, String atmCredSubType, String atmCredDType, String atmCredDLength, String xmlPayload, boolean considerOtp, String verifiedMerchantVal, String forgotUpiPINEnabledVal, String issuerOTPLimitVal, String aadharOTPLimitVal, String captureCardDetailsVal, CallbackContext callbackContext) {
        bankName = bank;
        verifiedMerchant = verifiedMerchantVal;
        forgotUpiPINEnabled = forgotUpiPINEnabledVal;
        issuerOTPLimit = issuerOTPLimitVal;
        aadharOTPLimit = aadharOTPLimitVal;
        captureCardDetails = captureCardDetailsVal;
        credAllowedString = CommonUtils.getCredAllowed(type, credType, credSubType, credDType, credDLength, atmCredType, atmCredSubType, atmCredDType, atmCredDLength, otpType, otpSubType, otpDType, otpDLength);
        Utilities.showLogE("NPCI_MOBILE", "credAllowedString =>"+ credAllowedString);
        xmlPayloadString = xmlPayload;
    //    result = new PluginResult(PluginResult.Status.OK, "setBankCredXML Success");
    //    result.setKeepCallback(false);
    //    if (callbackContext != null) {
    //      callbackContext.sendPluginResult(result);
    //      //no more result , hence the context is cleared.
    //      callbackContext = null;
    //    } else {
    //      callbackContext.error("setBankNameCredXML : Error");
    //    }
        callbackContext.success(getJsonResponse("00", "", ""));
    }

    public void initiateSendMoney(String txnId, String payerAddress, String payeeAddress, String amount, String payeeName, CallbackContext callbackContext) {
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_PAY;
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData(amount, transactionID, payerAddress, payeeAddress);
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson(payeeName, amount, "Send Money", transactionID, payerAddress);
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(false, false), salt, payInfoArray.toString(), trustStr, getLocaleValue(), remoteResultReceiver);
    }

    public void initiateMandate(String txnId, String payerAddress, String payeeAddress, String amount, String payeeName, CallbackContext callbackContext) {
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_MANDATE;
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData(amount, transactionID, payerAddress, payeeAddress);
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson(payeeName, amount, "Initiate Mandate", transactionID, payerAddress);
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(false, false), salt, payInfoArray.toString(), trustStr, getLocaleValue(), remoteResultReceiver);
    }

    public void initiateCollectRequestAccept(String txnId, String transAmount, String payerAddress, String payeeAddress, CallbackContext callbackContext) {
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_COLLECT;
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData(transAmount, transactionID, payerAddress, payeeAddress);
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson(payeeAddress, transAmount, "Accept Collect Request", transactionID, payerAddress);
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(false, false), salt, payInfoArray.toString(), trustStr, getLocaleValue(), remoteResultReceiver);
    }

    public void initiateBalanceEnquiry(String txnId, String paymentAddress, String accountNo, CallbackContext callbackContext) {
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_REQBAL;
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        Utilities.showLogE("NPCI_MOBILE", "credTypeValue CRED_TYPE_REQBAL: " + credTypeValue);
        String salt = getSaltData("0", transactionID, paymentAddress, "null");
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson("", "", "Check Balance", transactionID, Utilities.maskAccountNumber(accountNo));
        printAll(salt, trustStr, payInfoArray);
        // trustStr = "{"reqBalEnq":"e+uXyXFwqPBpSStVc46fwQlD8LjL1KnmhjfDl5PuW5V+OuE1L66nrUIrXKd2Ooqu"}";
        // Utilities.showLogE("NPCI_MOBILE", "Invalid Trust String : " + trustStr);
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(false, false), salt, payInfoArray.toString(), trustStr, localeValue, getRemoteReceiver());
//    callbackContext.success(getJsonResponse("01", "", ""));
    }

    public void initiateSetUpiPin(String paymentAdd, String txnId, String accountNo, CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "Inside initiateSetUpiPin");
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_SETMPIN;
        Utilities.showLogE("NPCI_MOBILE", "credTypeValue CRED_TYPE_SETMPIN: " + credTypeValue);
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData("0", transactionID, paymentAdd, "null");
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson("", "", "Set UPI Pin", transactionID, Utilities.maskAccountNumber(accountNo));
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(true, true), salt, payInfoArray.toString(), trustStr, getLocaleValue(), remoteResultReceiver);
    }

    public void initiateAadhaarSetUpiPin(String paymentAdd, String txnId, String accountNo, CallbackContext callbackContext) {
        Utilities.showLogE("NPCI_MOBILE", "Inside initiateAadhaarSetUpiPin");
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_SETMPIN;
        Utilities.showLogE("NPCI_MOBILE", "credTypeValue CRED_TYPE_SETMPIN: " + credTypeValue);
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData("0", transactionID, paymentAdd, "null");
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson("", "", "Set UPI Pin", transactionID, Utilities.maskAccountNumber(accountNo));
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(true, false), salt, payInfoArray.toString(), trustStr, getLocaleValue(), remoteResultReceiver);
    }

    public void initiateChangeUpiPin(String txnId, String paymentAdd, String accountNo, CallbackContext callbackContext) {
        credCallBack = callbackContext;
        transactionID = txnId;
        credTypeValue = CLConstants.CRED_TYPE_CHANGEMPIN;
        Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
        String salt = getSaltData("0", transactionID, paymentAdd, "null");
        String trustStr = getTrustDataSalt(salt);
        JSONArray payInfoArray = getPayInfoJson("", "", "Change UPI Pin", "", Utilities.maskAccountNumber(accountNo));
        printAll(salt, trustStr, payInfoArray);
        CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
        clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
                getConfigurationJson(true, true), salt, payInfoArray.toString(), trustStr, localeValue, remoteResultReceiver);
    }

    // public void initiateAadhaarChangeUpiPin(String txnId, String paymentAdd, String accountNo, CallbackContext callbackContext) {
    //     credCallBack = callbackContext;
    //     transactionID = txnId;
    //     credTypeValue = CLConstants.CRED_TYPE_CHANGEMPIN;
    //     Utilities.showLogE("NPCI_MOBILE", "Transaction ID : " + transactionID);
    //     String salt = getSaltData("0", transactionID, paymentAdd, "null");
    //     String trustStr = getTrustDataSalt(salt);
    //     JSONArray payInfoArray = getPayInfoJson("", "", "Change UPI Pin", "", Utilities.maskAccountNumber(accountNo));
    //     printAll(salt, trustStr, payInfoArray);
    //     CLRemoteResultReceiver remoteResultReceiver = getRemoteReceiver();
    //     clServices.getCredential(keyCode, xmlPayloadString, credAllowedString,
    //             getConfigurationJson(true, false), salt, payInfoArray.toString(), trustStr, localeValue, remoteResultReceiver);
    // }

    private static void parseResult(Bundle data, String clType) {
        Utilities.showLogE("NPCI_MOBILE", "Response : "+data);

        String errorMsgStr = data.getString("error");
        Utilities.showLogE("NPCI_MOBILE", "errorMsgStr : "+errorMsgStr);
        // String det = data.getString("det");
        String credDataForJson, credkey, credId, credType, credSubType;
        if (errorMsgStr != null && !errorMsgStr.isEmpty()) {
            Utilities.showLogE("NPCI_MOBILE", errorMsgStr);
            try {
                JSONObject error = new JSONObject(errorMsgStr);
                String errorCode = error.optString("errorCode");
                String errorText = error.optString("errorText");
                Toast.makeText(serviceActivity.getApplicationContext(), errorCode + ":" + errorText, Toast.LENGTH_LONG).show();
            } catch (JSONException e) {
                //e.printStackTrace();
            }
            try {
                credCallBack.success(getJsonResponse("01", "", ""));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }
        
        Utilities.showLogE("NPCI_MOBILE", "HashMap : ");
        HashMap<String, String> credListHashMap = (HashMap<String, String>) data.getSerializable("credBlocks");
        Utilities.showLogE("NPCI_MOBILE", "credListHashMap : " + credListHashMap);
        Utilities.showLogE("NPCI_MOBILE", "credListHashMap.size() : " + credListHashMap.size());
        JSONArray responseArray;
        JSONObject responseJSON;
        try {
            responseJSON = new JSONObject();
            responseArray = new JSONArray();
            responseJSON.put("status", "00");
            responseJSON.put("transactionId", transactionID);
            for (String cred : credListHashMap.keySet()) {
                Utilities.showLogE("NPCI_MOBILE", "Inside cred for loop  : " +cred);
                Utilities.showLogE("NPCI_MOBILE", "clType  : " +clType);
                try {
                    JSONObject credBlock = new JSONObject(credListHashMap.get(cred));
                    JSONObject credBlockByCredType = new JSONObject(credBlock.getString(clType));
                    // JSONObject credBlockByCredType = credBlock.getJSONObject(clType);
    //                JSONObject credBlock = new JSONObject(credListHashMap.get(cred));
                    Utilities.showLogE("NPCI_MOBILE", "credBlock.toString : " + credBlock.toString());

                    credDataForJson = credBlockByCredType.getJSONObject("data").getString("encryptedBase64String");
                    Utilities.showLogE("NPCI_MOBILE", "credDataForJson : " + credDataForJson);

                    credkey = credBlockByCredType.getJSONObject("data").getString("ki");
                    Utilities.showLogE("NPCI_MOBILE", "credkey : " + credkey);

                    credId = credBlockByCredType.getJSONObject("data").getString("code");
                    Utilities.showLogE("NPCI_MOBILE", "credId : " + credId);

                    credType = credBlockByCredType.getString("type");
                    Utilities.showLogE("NPCI_MOBILE", "credType : " + credType);

                    credSubType = credBlockByCredType.getString("subType");
                    Utilities.showLogE("NPCI_MOBILE", "credSubType : " + credSubType);

                    JSONObject response = new JSONObject();
                    response.accumulate("transactionId", transactionID);
                    response.put("status", "00");
                    response.accumulate("credDataForJson", credDataForJson);
                    response.accumulate("credkey", credkey);
                    response.accumulate("credId", credId);
                    response.accumulate("credType", credType);
                    response.accumulate("credSubType", credSubType);
                    // response.accumulate("detValue", det);
                    response.accumulate("txnType", credTypeValue);
                    
                    Utilities.showLogE("NPCI_MOBILE", "JSONObject response : " + response);
                    // credCallBack.success(response);
                    responseArray.put(response);

    //                credCaller.CredDataGenerated(transactionID, credDataForJson, credkey, credId, credType, credSubType);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            responseJSON.put("responseArray", responseArray);
            credCallBack.success(responseJSON);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public CLRemoteResultReceiver getRemoteReceiver() {
        Utilities.showLogE("NPCI_MOBILE", "inside getRemoteReceiver ");
        return new CLRemoteResultReceiver(new ResultReceiver(new Handler()) {
            @Override
            protected void onReceiveResult(int resultCode, Bundle resultData) {
                super.onReceiveResult(resultCode, resultData);
                Utilities.showLogE("NPCI_MOBILE", "resultCode : " + resultCode);
                Utilities.showLogE("NPCI_MOBILE", "resultData : " + resultData.toString());
//                parseResult(resultData);
                if (resultCode == 1) {
                    if (resultData != null) {
                        Utilities.showLogE("NPCI_MOBILE", "Passing Data to Class : " + resultData.toString());
                        NHCP.this.parseResult(resultData, credTypeValue);
                    }
                } else if (resultCode == 2) {
                    try {
                        JSONObject response = new JSONObject();
                        response.put("status", "02");
                        NHCP.credCallBack.success(response);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else if (resultCode == 3) {
                    try {
                        JSONObject response = new JSONObject();
                        response.put("status", "03");
                        NHCP.credCallBack.success(response);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else if (resultCode == 4) {
                    try {
                        JSONObject response = new JSONObject();
                        response.put("status", "04");
                        NHCP.credCallBack.success(response);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public static String getConfigurationJson(boolean resendFeature, boolean clDebitCard) {
        JSONObject configuration = new JSONObject();
        try {
            configuration.put("payerBankName", bankName);
            configuration.put("backgroundColor", "#FF9933");
            configuration.put("color", "#FF9933");
            configuration.put("verifiedMerchant", true);
            configuration.put("forgotUpiPINEnabled", true);
            if(clDebitCard) {
                configuration.put("captureCardDetails", true);
            }
            if (resendFeature) {
                configuration.put("resendIssuerOTPFeature", true);
                configuration.put("resendAadhaarOTPFeature", true);
                configuration.put("issuerResendOTPLimit", 2);
                configuration.put("aadharResendOTPLimit", 2);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Utilities.showLogE("NPCI_MOBILE", "getConfigurationJson : " + configuration);
        return configuration.toString();
    }

/*    public String getTrustData(String amount, String tranId, String payerAddress, String payeeAddress) {
        String trustStr = "";
        try {
            StringBuilder trustParamBuilder = new StringBuilder(100);
            trustParamBuilder.append(amount).append(CLConstants.SALT_DELIMETER)
                    .append(tranId).append(CLConstants.SALT_DELIMETER)
                    .append(payerAddress).append(CLConstants.SALT_DELIMETER)
                    .append(payeeAddress).append(CLConstants.SALT_DELIMETER)
                    .append(appId).append(CLConstants.SALT_DELIMETER)
                    .append(mobileNo).append(CLConstants.SALT_DELIMETER)
                    .append(deviceId);
            trustStr = genTrust(alg, padding, trustParamBuilder.toString(), hexToken);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return trustStr;
    }*/

    public String getTrustDataSalt(String salt) {
        String truststring = "";
        JSONObject trustJSON = new JSONObject();
        try {
            JSONObject jsonObject = new JSONObject(salt);
            JSONArray txnIdArray = jsonObject.getJSONArray(CLConstants.SALT_FIELD_TXN_ID);
            Utilities.showLogE("NPCI_MOBILE", "TranID : " + txnIdArray);
            String txnId = txnIdArray.optString(0);
            JSONArray credTypearray = jsonObject.getJSONArray("credType");
            String credType = credTypearray.optString(0);
            String txnAmount = jsonObject.optString(CLConstants.SALT_FIELD_TXN_AMOUNT);
            String appId = jsonObject.optString(CLConstants.SALT_FIELD_APP_ID);
            String deviceId = jsonObject.optString(CLConstants.SALT_FIELD_DEVICE_ID);
            String mobileNumber = jsonObject.optString(CLConstants.SALT_FIELD_MOBILE_NUMBER);
            String payerAddr = jsonObject.optString(CLConstants.SALT_FIELD_PAYER_ADDR);
            String payeeAddr = jsonObject.optString(CLConstants.SALT_FIELD_PAYEE_ADDR);
            String random = jsonObject.optString(CLConstants.SALT_FIELD_RANDOM);

            try {
                StringBuilder trustParamBuilder = new StringBuilder(150);
                if (credType != null && !credType.isEmpty())
                    trustParamBuilder.append(credType).append(CLConstants.SALT_DELIMETER);
                if (txnId != null && !txnId.isEmpty())
                    trustParamBuilder.append(txnId).append(CLConstants.SALT_DELIMETER);
                if (appId != null && !appId.isEmpty())
                    trustParamBuilder.append(appId).append(CLConstants.SALT_DELIMETER);
                if (mobileNumber != null && !mobileNumber.isEmpty())
                    trustParamBuilder.append(mobileNumber).append(CLConstants.SALT_DELIMETER);
                if (deviceId != null && !deviceId.isEmpty())
                    trustParamBuilder.append(deviceId).append(CLConstants.SALT_DELIMETER);
                if (payerAddr != null && !payerAddr.isEmpty())
                    trustParamBuilder.append(payerAddr).append(CLConstants.SALT_DELIMETER);
                if (payeeAddr != null && !payeeAddr.isEmpty())
                    trustParamBuilder.append(payeeAddr).append(CLConstants.SALT_DELIMETER);
                if (txnAmount != null && !txnAmount.isEmpty())
                    trustParamBuilder.append(txnAmount).append(CLConstants.SALT_DELIMETER);
                // trim '|' if trust ends with '|'
                int i = trustParamBuilder.lastIndexOf(CLConstants.SALT_DELIMETER);
                if (i != -1 && i == trustParamBuilder.length() - 1) {
                    trustParamBuilder.deleteCharAt(i);
                }

                String reconMsg = TrustCreator.genTrust(alg, padding, trustParamBuilder.toString(), hexToken, getRandom());
                Utilities.showLogE("NPCI_MOBILE", "Trust : " + reconMsg);
                // reconMsg = "CM8sDTrza11YzVG40h1d9llY4lfmvb+gFe3X2N9NyPXqEVlDbtGsQyAI9cAb0/eM";
                // Utilities.showLogE("NPCI_MOBILE", "Invalid Trust: " + reconMsg);
                trustJSON.put(credType, (reconMsg.trim()));
                reconMsg = trustJSON.toString().replaceAll("\\\\|\\n", "");
                reconMsg = reconMsg.replaceAll("\n", "");
                // Utilities.showLogE("NPCI_MOBILE", "getTrustDataSalt : " + reconMsg);

                return reconMsg;
            } catch (Exception e) {
            }
        } catch (Exception e) {
            Utilities.showLogE("NPCI_MOBILE", "getTrustDataSalt Exception Error : " + e);
            
        }
        return truststring;
    }

    public String getSaltData(String amount, String tranId, String payerAddress, String payeeAddress) {
        String saltString = "{\"appId\":\"" + appId + "\",\"credType\":[\"" + credTypeValue + "\"],\"deviceId\":\"" + deviceId + "\",\"mobileNumber\":\"" + mobileNo + "\",\"payeeAddr\":\"" + payeeAddress + "\",\"payerAddr\":\"" + payerAddress + "\",\"txnAmount\":\"" + amount + "\",\"txnId\":[\"" + tranId + "\"],\"random\":\"" + getRandom() + "\"}\"";
        return saltString;
    }

    public JSONArray getPayInfoJson(String payeeName, String amount, String note, String transID, String account) {
        JSONArray payInfoArray = new JSONArray();
        try {
            if (!payeeName.equalsIgnoreCase("")) {
                JSONObject jsonPayeeName = new JSONObject();
                jsonPayeeName.put("name", "payeeName");
                jsonPayeeName.put("value", payeeName);
                payInfoArray.put(jsonPayeeName);
            }
            if (!amount.equalsIgnoreCase("")) {
                JSONObject txnAmount = new JSONObject();
                txnAmount.put("name", "txnAmount");
                txnAmount.put("value", amount);
                payInfoArray.put(txnAmount);
            }
            if (!note.equalsIgnoreCase("")) {
                JSONObject jsonNote = new JSONObject();
                jsonNote.put("name", "note");
                jsonNote.put("value", note);
                payInfoArray.put(jsonNote);
            }
            if (!transID.equalsIgnoreCase("")) {
                JSONObject jsonRefId = new JSONObject();
                jsonRefId.put("name", "refId");
                jsonRefId.put("value", transID);
                payInfoArray.put(jsonRefId);
            }
            JSONObject jsonRefUrl = new JSONObject();
            jsonRefUrl.put("name", "refUrl");
            jsonRefUrl.put("value", refUrl);
            payInfoArray.put(jsonRefUrl);
            if (!account.equalsIgnoreCase("")) {
                JSONObject jsonAccount = new JSONObject();
                jsonAccount.put("name", "account");
                jsonAccount.put("value", account);
                payInfoArray.put(jsonAccount);
            }
            Utilities.showLogE("payInfo", payInfoArray.toString());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return payInfoArray;
    }

    private String getLocaleValue() {
        return localeValue;
    }

    public static CLServices getClServices() {
        return clServices;
    }

    private static String getJsonResponse(String status, String challenge, String challangeType) {
        String responseString = "";
        try {
            JSONObject response = new JSONObject();
            response.put("status", status);
            response.put("challenge", challenge);
            response.put("registered", isCLRegistered);
            response.put("initialised", isCLInitialized);
            response.put("challangeType", challangeType);
            responseString = response.toString();
            Utilities.showLogE("NPCI_MOBILE", "getJsonResponse responseString : " + responseString);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return responseString;
    }

    public void setIntentResponse(String txnId, String responseCode, String rrnValue, String status, String refId) {
        String responseIntent = "txnId=" + txnId + "&responseCode=" + responseCode + "&approvalRefNo=" + rrnValue + "&status=" + status + "&txnRef=" + refId;
        Intent intent = new Intent();
        intent.putExtra("response", responseIntent);
        Utilities.showLogE("INTENT", "Response Intent : " + responseIntent);
    }

    public void enableSmartIntent(boolean enable, String activityName) {
        PackageManager pm = serviceActivity.getPackageManager();
        Context contextValue = serviceActivity.getApplicationContext();
        if (enable) {
          pm.setComponentEnabledSetting(new ComponentName(contextValue, activityName), 1, 1);
        } else {
          pm.setComponentEnabledSetting(new ComponentName(contextValue, activityName), 2, 1);
        } 
      }

    // public String generateTransactionId(String paramString)
    // {
    //   String str = UUID.randomUUID().toString();
    //   return paramString.toUpperCase().substring(0, 3).toUpperCase() + str.replaceAll("-", "");
    // }

    public static void printAll(String saltString, String trustString, JSONArray payInfoString) {
        Utilities.showLogE("NPCI_MOBILE", "appId " + appId);
        Utilities.showLogE("NPCI_MOBILE", "mobileNo " + mobileNo);
        Utilities.showLogE("NPCI_MOBILE", "deviceId " + deviceId);
//        Utilities.showLogE("NPCI_MOBILE", "hmac " + hmac);
        Utilities.showLogE("NPCI_MOBILE", "hexToken " + hexToken);
        Utilities.showLogE("NPCI_MOBILE", "CL Registered " + isCLRegistered);
        Utilities.showLogE("NPCI_MOBILE", "Random " + getRandom());
        Utilities.showLogE("NPCI_MOBILE", "SALT " + saltString);
        Utilities.showLogE("NPCI_MOBILE", "TRUST " + trustString);
        Utilities.showLogE("NPCI_MOBILE", "Pay Info " + payInfoString.toString());
    }

    public static String getRandom() {
        if (TextUtils.isEmpty(randomValue)) {
            SecureRandom random = new SecureRandom();
            byte[] saltStr = new byte[16];
            random.nextBytes(saltStr);
            randomValue = Base64.encodeToString(saltStr, Base64.NO_WRAP);
        }
        return randomValue;
    }


    public static String getCredType() {
        if (TextUtils.isEmpty(credTypeValue)) {
            return "";
        } else {
            return credTypeValue;
        }
    }

}
