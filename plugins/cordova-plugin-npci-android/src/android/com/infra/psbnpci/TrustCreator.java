package com.infra.psbnpci;

import android.util.Base64;

public class TrustCreator {
    public static String genTrust(String alg, String padding, String message, String token, String random) throws Exception {
        String reconMsg = null;
        try {
            CryptLib cryptLib = new CryptLib();
            byte[] hmacBytes = cryptLib.encrypt(alg, padding, cryptLib.SHA256(message, random), cryptLib.hexStringToByteArray(token), random);
            reconMsg = Base64.encodeToString(hmacBytes, Base64.DEFAULT);
        } catch (Exception e) {
            // e.printStackTrace();
            Utilities.showLogE("NPCI_MOBILE", "TrustCreator Exception Error : " + e);
        }
        return reconMsg;
    }

    /*
        String trust = null;
        CryptLib lib = null;
        try {
            lib = new CryptLib();
            byte[] tokenBytes = lib.hexStringToByteArray(token);
            trust = Base64.encodeToString(lib.encrypt(alg, padding, lib.SHA256(message), tokenBytes), 2);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return trust;
*/

}
