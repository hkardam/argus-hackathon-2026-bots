package com.bots.hackathon.messaging.service;

import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.common.exception.AccessDeniedException;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.messaging.dto.CreateThreadRequest;
import com.bots.hackathon.messaging.dto.MessageResponse;
import com.bots.hackathon.messaging.dto.SendMessageRequest;
import com.bots.hackathon.messaging.dto.ThreadResponse;
import com.bots.hackathon.messaging.model.Message;
import com.bots.hackathon.messaging.model.MessageThread;
import com.bots.hackathon.messaging.repo.MessageRepository;
import com.bots.hackathon.messaging.repo.MessageThreadRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessagingService {

    private final MessageThreadRepository threadRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    /** Only staff/officers can create internal message threads. Applicants are excluded. */
    @Transactional
    public ThreadResponse createThread(CreateThreadRequest request, Long createdByUserId) {
        UserEntity user =
                userRepository
                        .findById(createdByUserId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", createdByUserId));

        if (user.getRole() == Role.APPLICANT) {
            throw new AccessDeniedException("Applicants cannot create internal message threads.");
        }

        MessageThread thread =
                MessageThread.builder()
                        .subject(request.subject())
                        .applicationId(request.applicationId())
                        .createdByUserId(createdByUserId)
                        .build();

        return toThreadResponse(threadRepository.save(thread));
    }

    /** Send a message to a thread. Thread must be open. */
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, Long senderUserId) {
        MessageThread thread =
                threadRepository
                        .findById(request.threadId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Thread", request.threadId()));

        if (Boolean.TRUE.equals(thread.getIsClosed())) {
            throw new BusinessException("Cannot send message to a closed thread.");
        }

        Message message =
                Message.builder()
                        .threadId(request.threadId())
                        .senderUserId(senderUserId)
                        .content(request.content())
                        .build();

        return toMessageResponse(messageRepository.save(message));
    }

    /** Staff can view any thread. Applicants are blocked from internal threads. */
    @Transactional(readOnly = true)
    public List<MessageResponse> getThreadMessages(UUID threadId, Long requestingUserId) {
        if (!threadRepository.existsById(threadId)) {
            throw new ResourceNotFoundException("Thread", threadId);
        }

        UserEntity user =
                userRepository
                        .findById(requestingUserId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", requestingUserId));

        // Applicants cannot read internal (staff) threads
        if (user.getRole() == Role.APPLICANT) {
            throw new AccessDeniedException("Applicants cannot read internal message threads.");
        }

        return messageRepository.findByThreadIdOrderByCreatedAtAsc(threadId).stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ThreadResponse> getThreadsByApplication(UUID applicationId) {
        return threadRepository.findByApplicationId(applicationId).stream()
                .map(this::toThreadResponse)
                .toList();
    }

    private ThreadResponse toThreadResponse(MessageThread t) {
        return new ThreadResponse(
                t.getId(),
                t.getSubject(),
                t.getApplicationId(),
                t.getCreatedByUserId(),
                t.getIsClosed(),
                t.getCreatedAt());
    }

    private MessageResponse toMessageResponse(Message m) {
        return new MessageResponse(
                m.getId(), m.getThreadId(), m.getSenderUserId(), m.getContent(), m.getCreatedAt());
    }
}
