package com.winestore.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class MoMoConfig {

    @Value("${momo.partnerCode:MOMO}")
    private String partnerCode;

    @Value("${momo.accessKey:M8brj9K6E22vXoDB}")
    private String accessKey;

    @Value("${momo.secretKey:nqQiVSgDMy809JoPF6OzP5OdBUB550Y4}")
    private String secretKey;

    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String endpoint;

    @Value("${momo.returnUrl:${VNPAY_RETURN_URL:https://tttn-web-wine.vercel.app/payment/result}}")
    private String returnUrl;

    @Value("${momo.notifyUrl:${MOMO_NOTIFY_URL:http://localhost:8080/api/payment/notify/momo}}")
    private String notifyUrl;

    public String getPartnerCode() { return partnerCode; }
    public String getAccessKey() { return accessKey; }
    public String getSecretKey() { return secretKey; }
    public String getEndpoint() { return endpoint; }
    public String getReturnUrl() { return returnUrl; }
    public String getNotifyUrl() { return notifyUrl; }

    public static String hmacSHA256(String data, String secretKey) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] raw = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(2 * raw.length);
            for (byte b : raw) {
                hex.append(String.format("%02x", b & 0xff));
            }
            return hex.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
