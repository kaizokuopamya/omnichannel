package com.infra.psbnpci;

import android.util.Base64;

import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class CryptLib {
    public byte[] SHA256Old(String paramString) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(paramString.getBytes("UTF-8"));
            byte[] digest = md.digest();
            return digest;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public byte[] encryptOld(String alg, String padding, byte[] data, byte[] key) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key, alg);
            byte[] iv = new byte[16];
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            Cipher acipher = Cipher.getInstance(padding);
            acipher.init(1, keySpec, ivSpec);
            byte[] arrayOfByte1 = acipher.doFinal(data);
            return arrayOfByte1;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public byte[] encrypt(String algo, String padding, final byte[] array, final byte[] array2, String random) throws Exception {
        final SecretKeySpec secretKeySpec = new SecretKeySpec(array2, algo);//AES
        final IvParameterSpec ivParameterSpec = new IvParameterSpec(Base64.decode(random, Base64.NO_WRAP));
        final Cipher instance = Cipher.getInstance(padding);//AES/CBC/PKCS5Padding
        instance.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
        return instance.doFinal(array);
    }

    public byte[] SHA256(String s, String random) {
        try {
            byte[] randomBytes = Base64.decode(random, Base64.NO_WRAP);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(randomBytes);
            return digest.digest(s.getBytes("UTF-8"));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public byte[] hexStringToByteArray(String s) {
        byte[] b = new byte[s.length() / 2];
        for (int i = 0; i < b.length; ++i) {
            int index = i * 2;
            int v = Integer.parseInt(s.substring(index, index + 2), 16);
            b[i] = (byte) v;
        }

        return b;
    }
}
