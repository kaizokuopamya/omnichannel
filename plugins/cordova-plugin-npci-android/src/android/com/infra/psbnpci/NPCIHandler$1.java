package com.infra.psbnpci;

import android.os.Bundle;
import android.os.Handler;
import android.os.ResultReceiver;
import org.json.JSONObject;

class null extends ResultReceiver {
  null(Handler x0) {
    super(x0);
  }
  
  protected void onReceiveResult(int resultCode, Bundle resultData) {
    super.onReceiveResult(resultCode, resultData);
    if (resultCode == 1) {
      if (resultData != null)
        NPCIHandler.access$100(resultData, NPCIHandler.access$000()); 
    } else if (resultCode == 2) {
      try {
        JSONObject response = new JSONObject();
        response.put("status", "02");
        NPCIHandler.credCallBack.success(response);
      } catch (Exception e) {
        e.printStackTrace();
      } 
    } 
  }
}
