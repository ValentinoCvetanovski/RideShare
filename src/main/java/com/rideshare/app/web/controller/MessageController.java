package com.rideshare.app.web.controller;

import com.rideshare.app.model.Message;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.MessageRepository;
import com.rideshare.app.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @GetMapping("/users/{userId}")
    public List<User> getMessageUsers(@PathVariable Long userId) {
        List<Message> messages = messageRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);

        Map<Long, User> users = new LinkedHashMap<>();

        for(Message message : messages) {
            User otherUser = message.getSender().getId().equals(userId)
                    ? message.getReceiver()
                    : message.getSender();

            users.putIfAbsent(otherUser.getId(), otherUser);
        }
        return new ArrayList<>(users.values());
    }
    @GetMapping("/search")
    public List<User> searchUsers(
            @RequestParam Long userId,
            @RequestParam String q
    ){
        if(q==null || q.isBlank()){
            return List.of();
        }
        return userRepository
                .findTop8ByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q,q)
                .stream()
                .filter(user -> !user.getId().equals(userId))
                .toList();
    }
    @GetMapping("/conversation")
    public List<Message> getConversation(
            @RequestParam Long userId,
            @RequestParam Long otherUserId
    ){
        return messageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
                userId,
                otherUserId,
                otherUserId,
                userId
        );
    }
    @PostMapping
    public Message sendMessage(@RequestBody SendMessageRequest req) {
        User sender = userRepository.findById(req.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(req.getContent());

        return messageRepository.save(message);
    }
    @Data
    public static class SendMessageRequest {
        private Long senderId;
        private Long receiverId;
        private String content;
    }
}
