package fr.polytech.readmessageserver;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<String> getAllUsers() {
        List<String> senders = messageRepository.findAllSenders();
        List<String> receivers = messageRepository.findAllReceivers();
        List<String> allUsers = new ArrayList<>(senders);
        allUsers.addAll(receivers);
        return allUsers.stream()
                .distinct()
                .filter(user -> !user.equals("story"))
                .collect(Collectors.toList());
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesBySender(String sender) {
        return messageRepository.findBySender(sender);
    }

    public List<Message> getMessagesByReceiver(String receiver) {
        return messageRepository.findByReceiver(receiver);
    }

    public List<Message> getMessagesBetweenTwoUsers(String user1, String user2) {
        return messageRepository.findBetweenTwoUsers(user1, user2);
    }

    public List<Message> getRecentStories() {
        List<Message> allStories = getMessagesByReceiver("story");
        Date current = new Date();
        return allStories.stream()
                .filter(story -> (current.getTime() - story.getCreationDate().getTime()) <= 24 * 60 * 60 * 1000)
                .collect(Collectors.toList());
    }

    public List<Message> getStoriesBySender(String sender) {
        return getRecentStories().stream()
                .filter(message -> message.getSender().equals(sender))
                .filter(message -> message.getReceiver().equals("story"))
                .collect(Collectors.toList());
    }
}
