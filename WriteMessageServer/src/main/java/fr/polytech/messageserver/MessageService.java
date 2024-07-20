package fr.polytech.messageserver;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message createMessage(Message message) {
        message.setCreationDate(new Date());
        return messageRepository.save(message);
    }

    public Message createRandomMessage() {
        Message message = new Message("PeterSender", "JohnReceiver", "hello John", 10);
        return messageRepository.save(message);
    }
}
