package com.pbakondy;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.LOG;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.CaptivePortal;
import android.os.Build;
import android.Manifest;

import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;
import android.telephony.TelephonyManager;

import android.provider.Settings;
import android.provider.Settings.Secure;
import android.content.ContentResolver;

import static android.Manifest.permission.READ_PHONE_NUMBERS;
import static android.Manifest.permission.READ_PHONE_STATE;
import static android.Manifest.permission.READ_SMS;
import static android.Manifest.permission.SEND_SMS;

import java.util.ArrayList;
import java.util.List;

public class SIMCP extends CordovaPlugin {
  private static final String LOG_TAG = "CordovaPluginSim";


  private static final String GET_SIM_INFO = "getSimInfo";
  private static final String HAS_READ_PERMISSION = "hasReadPermission";
  private static final String REQUEST_READ_PERMISSION = "requestReadPermission";

  private CallbackContext callback;

  @SuppressLint("HardwareIds")
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    callback = callbackContext;

    if (GET_SIM_INFO.equals(action)) {
      Context context = this.cordova.getActivity().getApplicationContext();

      TelephonyManager manager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);

      // dual SIM detection with SubscriptionManager API
      // requires API 22
      // requires permission READ_PHONE_STATE
      JSONArray sims = null;
      Integer phoneCount = null;
      Integer activeSubscriptionInfoCount = null;
      Integer activeSubscriptionInfoCountMax = null;

      // try {
        // TelephonyManager.getPhoneCount() requires API 23
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
          phoneCount = manager.getPhoneCount();
        }

        // if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP_MR1) {

          if (simPermissionGranted(Manifest.permission.READ_PHONE_STATE)) {

            SubscriptionManager subscriptionManager = (SubscriptionManager) context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
            activeSubscriptionInfoCount = subscriptionManager.getActiveSubscriptionInfoCount();
            activeSubscriptionInfoCountMax = subscriptionManager.getActiveSubscriptionInfoCountMax();

            sims = new JSONArray();

            List<SubscriptionInfo> subscriptionInfos = subscriptionManager.getActiveSubscriptionInfoList();
            for (SubscriptionInfo subscriptionInfo : subscriptionInfos) {

              CharSequence carrierName = subscriptionInfo.getCarrierName();
              String countryIso = subscriptionInfo.getCountryIso();
              int dataRoaming = subscriptionInfo.getDataRoaming();  // 1 is enabled ; 0 is disabled
              CharSequence displayName = subscriptionInfo.getDisplayName();
              String iccId = subscriptionInfo.getIccId();
              int mcc = subscriptionInfo.getMcc();
              int mnc = subscriptionInfo.getMnc();
              String number = subscriptionInfo.getNumber();
              int simSlotIndex = subscriptionInfo.getSimSlotIndex();
              int subscriptionId = subscriptionInfo.getSubscriptionId();

              boolean networkRoaming = subscriptionManager.isNetworkRoaming(simSlotIndex);

              String deviceId = null;
              // TelephonyManager.getDeviceId(slotId) requires API 23
              if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                // deviceId = manager.getDeviceId(simSlotIndex);
                deviceId = Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
              }

              JSONObject simData = new JSONObject();

              simData.put("carrierName", carrierName.toString());
              simData.put("displayName", displayName.toString());
              simData.put("countryCode", countryIso);
              simData.put("mcc", mcc);
              simData.put("mnc", mnc);
              simData.put("isNetworkRoaming", networkRoaming);
              simData.put("isDataRoaming", (dataRoaming == 1));
              simData.put("simSlotIndex", simSlotIndex);
              simData.put("phoneNumber", number);
              if (deviceId != null) {
                simData.put("deviceId", deviceId);
              }
              simData.put("simSerialNumber", iccId);
              simData.put("subscriptionId", subscriptionId);

              sims.put(simData);

            }
          }
        // }
      // } catch (JSONException e) {
      //   e.printStackTrace();
      // } catch (Exception e) {
      //   e.printStackTrace();
      // }

      String phoneNumber = null;
      String countryCode = manager.getSimCountryIso();
      String simOperator = manager.getSimOperator();
      String carrierName = manager.getSimOperatorName();

      String deviceId = null;
      String deviceSoftwareVersion = null;
      String simSerialNumber = null;
      String subscriberId = null;

      int callState = manager.getCallState();
      int dataActivity = manager.getDataActivity();
      int networkType = manager.getNetworkType();
      int phoneType = manager.getPhoneType();
      int simState = manager.getSimState();

      boolean isNetworkRoaming = manager.isNetworkRoaming();

      if (simPermissionGranted(Manifest.permission.READ_PHONE_STATE)) {
        phoneNumber = manager.getLine1Number();
        // deviceId = manager.getDeviceId();
        deviceId = Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
        deviceSoftwareVersion = manager.getDeviceSoftwareVersion();
        // simSerialNumber = manager.getSimSerialNumber();
        simSerialNumber = Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
        // subscriberId = manager.getSubscriberId();
        subscriberId = Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
      }

      String mcc = "";
      String mnc = "";

      if (simOperator.length() >= 3) {
        mcc = simOperator.substring(0, 3);
        mnc = simOperator.substring(3);
      }

      JSONObject result = new JSONObject();

      result.put("carrierName", carrierName);
      result.put("countryCode", countryCode);
      result.put("mcc", mcc);
      result.put("mnc", mnc);

      result.put("callState", callState);
      result.put("dataActivity", dataActivity);
      result.put("networkType", networkType);
      result.put("phoneType", phoneType);
      result.put("simState", simState);

      result.put("isNetworkRoaming", isNetworkRoaming);

      if (phoneCount != null) {
        result.put("phoneCount", (int)phoneCount);
      }
      if (activeSubscriptionInfoCount != null) {
        result.put("activeSubscriptionInfoCount", (int)activeSubscriptionInfoCount);
      }
      if (activeSubscriptionInfoCountMax != null) {
        result.put("activeSubscriptionInfoCountMax", (int)activeSubscriptionInfoCountMax);
      }

      if (simPermissionGranted(Manifest.permission.READ_PHONE_STATE)) {
        result.put("phoneNumber", phoneNumber);
        result.put("deviceId", deviceId);
        result.put("deviceSoftwareVersion", deviceSoftwareVersion);
        result.put("simSerialNumber", simSerialNumber);
        result.put("subscriberId", subscriberId);
      }

      if (sims != null && sims.length() != 0) {
        result.put("cards", sims);
      }

      callbackContext.success(result);

      return true;
    } else if (HAS_READ_PERMISSION.equals(action)) {
      hasReadPermission();
      return true;
    } else if (REQUEST_READ_PERMISSION.equals(action)) {
      requestReadPermission();
      return true;
    } else {
      return false;
    }
  }

  private void hasReadPermission() {
    this.callback.sendPluginResult(new PluginResult(PluginResult.Status.OK,
      checkAllPermission()));
  }

  private boolean checkAllPermission(){
    boolean allPermissionStatus = true;
    allPermissionStatus = allPermissionStatus && simPermissionGranted(Manifest.permission.READ_PHONE_STATE);
    allPermissionStatus = allPermissionStatus && simPermissionGranted(READ_PHONE_NUMBERS);
    allPermissionStatus = allPermissionStatus && simPermissionGranted(Manifest.permission.SEND_SMS);
    return allPermissionStatus;
  }

  private void requestReadPermission() {
    LOG.i(LOG_TAG, "requestPermission =====> "+ Build.VERSION_CODES.O);
    LOG.i(LOG_TAG, "requestPermission =====> "+ Build.VERSION.SDK_INT);

    ArrayList<String> permissionArray = new ArrayList<>();
    if (!cordova.hasPermission(READ_PHONE_STATE)) {
      permissionArray.add(READ_PHONE_STATE);
    }

    if (!cordova.hasPermission(READ_PHONE_NUMBERS)) {
      permissionArray.add(READ_PHONE_NUMBERS);
    }
    if (!cordova.hasPermission(SEND_SMS)) {
      permissionArray.add(SEND_SMS);
    }

    LOG.i(LOG_TAG, "requestPermission =====> Pending Permission Count "+ permissionArray.size());

//    if (Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) {
//      LOG.i(LOG_TAG, "INSIDE 30");
//      requestPermission(Manifest.permission.READ_PHONE_NUMBERS);
//      requestPermission(Manifest.permission.READ_PHONE_STATE);
      cordova.requestPermissions(this,100, permissionArray.toArray(new String[permissionArray.size()]));
//    }
//      else {
//         requestPermission(Manifest.permission.READ_PHONE_STATE);
//      }
  }

  private ContentResolver getContentResolver(){
    return cordova.getActivity().getContentResolver();
}


  private boolean simPermissionGranted(String type) {
    if (Build.VERSION.SDK_INT < 23) {
      return true;
    }

    return cordova.hasPermission(type);
  }

  private void requestPermission(String type) {
    LOG.i(LOG_TAG, "requestPermission");
    if (!simPermissionGranted(type)) {
      cordova.requestPermission(this, 12345, type);
    } else {
      this.callback.success();
    }
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException
  {

    boolean allPermissionGranted = true;
    for (int i = 0; i < grantResults.length; i++) {
      allPermissionGranted = allPermissionGranted && grantResults[i] == PackageManager.PERMISSION_GRANTED;
    }

    if (allPermissionGranted) {
      this.callback.success();
    } else {
      this.callback.error("Permission denied");
    }
  }
}
