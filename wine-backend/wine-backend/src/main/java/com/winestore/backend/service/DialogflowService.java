package com.winestore.backend.service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;

@Service
public class DialogflowService {

    // Vui lòng nhập Project ID của bạn từ Google Cloud Console
    @Value("${dialogflow.project.id:your-project-id-here}")
    private String projectId;

    private SessionsClient sessionsClient;

    @PostConstruct
    public void init() {
        try {
            // Đọc file JSON cấu hình từ resources
            // Vui lòng copy file service account JSON từ GCP vào src/main/resources/dialogflow-credentials.json
            ClassPathResource resource = new ClassPathResource("dialogflow-credentials.json");
            if (resource.exists()) {
                InputStream inputStream = resource.getInputStream();
                GoogleCredentials credentials = GoogleCredentials.fromStream(inputStream);

                SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                        .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                        .build();

                this.sessionsClient = SessionsClient.create(sessionsSettings);
                System.out.println("Dialogflow connected successfully!");
            } else {
                System.out.println("LƯU Ý: Không tìm thấy file dialogflow-credentials.json. Dialogflow chưa được khởi tạo.");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi kết nối Dialogflow: " + e.getMessage());
        }
    }

    public String detectIntentTexts(String sessionId, String text, String languageCode) {
        if (sessionsClient == null) {
            return "Xin lỗi, hiện tại tính năng Chatbot đang trong quá trình bảo trì và chờ cấp quyền (Thiếu cấu hình Dialogflow).";
        }

        try {
            SessionName session = SessionName.of(projectId, sessionId);
            TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode(languageCode);
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

            DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
            QueryResult queryResult = response.getQueryResult();

            return queryResult.getFulfillmentText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi kết nối tới AI Dialogflow: " + e.getMessage();
        }
    }
}
