package com.cordova.plugins.wc;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.LOG;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.wifi.ScanResult;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * This class echoes a string called from JavaScript.
 */
public class WC extends CordovaPlugin {
  PluginResult result = null;
  public CallbackContext callbackContext = null;
  public CallbackContext callbackContext1 = null;
  public Activity cordovaActivity;
  public String packageName;
  public static final String ACTION_CHECK_PERMISSIONS = "checkPermission";
  public static final String ACTION_SCAN_WIFI = "scanWifi";

  @Override
  public void initialize(final CordovaInterface cordova, final CordovaWebView webView) {
    super.initialize(cordova, webView);
    cordovaActivity = cordova.getActivity();

    LOG.i("PLUGIN_START", "Plugin Initialization Done");
  }

  @Override
  public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    this.callbackContext = callbackContext;
    LOG.i("args", args.toString());

    try {
      switch (action) {
        case ACTION_SCAN_WIFI:
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String scanResult = allowNetwork();
            sendCallback(scanResult);
          } else {
            sendCallback(null);
          }
          break;

        default:
          return false;
      }
    } catch (Exception e) {
      return false;
    }
    return true;
  }


  public void sendCallback(String response) {
    result = new PluginResult(PluginResult.Status.OK, response);
    result.setKeepCallback(false);
    if (callbackContext != null) {
      callbackContext.sendPluginResult(result);
    } else {
      callbackContext.error("Callbackcontext is null...");
    }
  }


  public boolean isMobNetworkAvailable() {
    return ((ConnectivityManager) cordovaActivity.getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE)).getActiveNetworkInfo().getTypeName().equals("MOBILE");
  }

  public String checkPermission() {
    ArrayList var0;
    var0 = new ArrayList<Integer>();
    if (ContextCompat.checkSelfPermission(cordovaActivity.getApplicationContext(), "android.permission.ACCESS_WIFI_STATE") != 0) {
      var0.add("android.permission.ACCESS_WIFI_STATE");
    }

    if (ContextCompat.checkSelfPermission(cordovaActivity.getApplicationContext(), "android.permission.CHANGE_WIFI_STATE") != 0) {
      var0.add("android.permission.CHANGE_WIFI_STATE");
    }

    if (ContextCompat.checkSelfPermission(cordovaActivity.getApplicationContext(), "android.permission.ACCESS_COARSE_LOCATION") != 0) {
      var0.add("android.permission.ACCESS_COARSE_LOCATION");
    }

    return var0.size() > 0 ? "PERMISSION" : "ALLOW";
  }

  @RequiresApi(
    api = 23
  )
  public String allowNetwork() {
    if (isMobNetworkAvailable()) {
      return "MOBILE";
    } else if (checkPermission().equalsIgnoreCase("ALLOW")) {
      WifiManager wifi = (WifiManager) cordovaActivity.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      List<ScanResult> networkList = wifi.getScanResults();
      if (networkList != null) {
        for (ScanResult network : networkList) {
          String Capabilities = network.capabilities;
          Log.w("WC Class", network.SSID + " capabilities : " + Capabilities);
        }
      }
      WifiManager var0;
      WifiManager var10000 = var0 = (WifiManager) cordovaActivity.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      String var1 = null;
      WifiInfo var2;
      if ((var2 = var10000.getConnectionInfo()).getSupplicantState() == SupplicantState.COMPLETED) {
        var1 = var2.getSSID().replace("\"", "");
      }
      Log.i(WC.class.getSimpleName(), var0.getScanResults().toString());

      List var3;
      if ((var3 = var0.getScanResults()) != null) {
        Iterator var4 = var3.iterator();

        while (var4.hasNext()) {
          ScanResult var6;
          if ((var6 = (ScanResult) var4.next()).SSID.toString().equals(var1)) {
            String var5;
            if ((var5 = var6.capabilities).toUpperCase().contains("WEP")) {
              return "SECURE";
            }

            if (!var5.toUpperCase().contains("WPA") && !var5.toUpperCase().contains("WPA2")) {
              return "OPEN";
            }

            if(isAirplaneModeOn(cordovaActivity.getApplicationContext())){
              return "OPEN";
            }
            return "SECURE";
          }
        }
      }
      if(isAirplaneModeOn(cordovaActivity.getApplicationContext())){
        return "OPEN";
      }
      return "SECURE";
    } else {
      return "PERMISSION";
    }


  }


  /**
   * Gets the state of Airplane Mode.
   *
   * @param context
   * @return true if enabled.
   */
  private static boolean isAirplaneModeOn(Context context) {
    return Settings.System.getInt(context.getContentResolver(),
      Settings.Global.AIRPLANE_MODE_ON, 0) != 0;
  }
}

