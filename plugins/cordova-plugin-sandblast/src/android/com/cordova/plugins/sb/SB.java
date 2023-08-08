package com.cordova.plugins.sb;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.LOG;
import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.infrasofttech.psb.R;
import com.sandblast.sdk.SBMAuthorizationCallback;
import com.sandblast.sdk.SBMClient;
import com.sandblast.sdk.SBMDetectionType;
import com.sandblast.sdk.SBMEventResult;
import com.sandblast.sdk.SBMScanCallback;
import com.sandblast.sdk.SBMScanResult;
import com.sandblast.sdk.details.SBMRisk;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * This class echoes a string called from JavaScript.
 */
public class SB extends CordovaPlugin {
  PluginResult result = null;
  public CallbackContext callbackContext = null;
  public CallbackContext callbackContext1 = null;
  public Activity cordovaActivity;
  public String packageName;
  private SBMClient sbmClient;
  public static final String ACTION_SCAN = "scan";
  public static final String ACTION_GETCURRENTSTATUS = "getCurrentStatus";
    public static final String ACTION_GETRISKS = "getRisks";


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
        // get current status cordova method
        case ACTION_GETCURRENTSTATUS:
//          getCurrentStatus();
          break;
        //get risks cordova method
        case ACTION_GETRISKS:
          scanDevice();
          break;

        default:
          return false;
      }
    }catch(Exception e ) {
      return false;
    }
    return true;
  }

  public void scanDevice(){
    sbmClient = new SBMClient.Builder(cordovaActivity, "49f065c2cd1e7f33c46e7359dfbdeeabadb896c81190df57e7")
      .setAuthorizationCallback(new SBMAuthorizationCallback() {
        @Override
        public void onAuthorizationCompleted(boolean b, @NonNull SBMEventResult sbmEventResult) {
          scan();
        }
      }).build();
    sbmClient.initialize();
  }

  public void scan() {
    sbmClient.scan(new SBMScanCallback() {
      @Override
      public void onScanCompleted(@NonNull List<SBMScanResult> list) {
        getRisks();
      }
    },0,null,new int[]{SBMDetectionType.DETECTION_ROOT,SBMDetectionType.DETECTION_NETWORK,SBMDetectionType.DETECTION_APP,SBMDetectionType.DETECTION_DEVICE_SETTINGS});
  }


  public void getCurrentStatus() {
    Map<String, String> status = sbmClient.getCurrentStatus();
    sendCallback(status);
  }

  public void getRisks() {
    List<SBMRisk> risksList = sbmClient.getRisks();
    sendCallback(risksList);
  }

  public void sendCallback(Object response){
    Gson gson = new Gson();
    String json = gson.toJson(response);
    result = new PluginResult(PluginResult.Status.OK, json);
    result.setKeepCallback(false);
    if (callbackContext != null) {
      callbackContext.sendPluginResult(result);
    } else {
      callbackContext.error("Callbackcontext is null...");
    }
  }



}

