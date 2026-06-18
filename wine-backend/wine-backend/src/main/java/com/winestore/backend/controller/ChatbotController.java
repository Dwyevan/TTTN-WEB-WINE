package com.winestore.backend.controller;

import com.winestore.backend.DTO.ChatRequest;
import com.winestore.backend.DTO.ChatResponse;
import com.winestore.backend.service.DialogflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin("*")
public class ChatbotController {

    @Autowired
    private DialogflowService dialogflowService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askBot(@RequestBody ChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        // Truyền tin nhắn của user tới Dialogflow, ngôn ngữ "vi" cho tiếng Việt
        String responseText = dialogflowService.detectIntentTexts(sessionId, request.getMessage(), "vi");

        return ResponseEntity.ok(new ChatResponse(responseText));
    }
}
