package com.rideshare.app.repository;

import com.rideshare.app.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Long senderId, Long recieverId);

    List<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
            Long senderId1,
            Long receiverId1,
            Long senderId2,
            Long receiverId2
    );
    long countByReceiverIdAndReadFalse(Long receiverId);

    List<Message> findByReceiverIdAndSenderIdAndReadFalse(Long receiverId, Long senderId);
}
