package fr.polytech.readmessageserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping
public class MessageController {
    private static final Logger LOGGER = Logger.getLogger(MessageController.class.getName());

    @Autowired
    MessageService messageService;

    @Autowired
    Auth auth;

    @GetMapping("/")
    public ResponseEntity<List<Message>> getAllMessages() {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Getting all messages");
        }
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/users")
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(messageService.getAllUsers());
    }

    @GetMapping("/sender/{sender}")
    public ResponseEntity<List<Message>> getMessagesBySender(@PathVariable String sender) {
        return ResponseEntity.ok(messageService.getMessagesBySender(sender));
    }

    @GetMapping("/receiver/{receiver}")
    public ResponseEntity<List<Message>> getMessagesByReceiver(@PathVariable String receiver) {
        return ResponseEntity.ok(messageService.getMessagesByReceiver(receiver));
    }

    @GetMapping("/chat")
    public ResponseEntity<List<Message>> getMessagesBySenderAndReceiver(@RequestParam String user1, @RequestParam String user2) {
        return ResponseEntity.ok(messageService.getMessagesBetweenTwoUsers(user1, user2));
    }

    /**
     * stories
     */
    @GetMapping("/storiesContent")
    public ResponseEntity<List<Message>> getAllStories() {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Getting all stories");
        }
        return ResponseEntity.ok(messageService.getRecentStories());
    }

    /**
     * get stories owner names
     */
    @GetMapping("/stories")
    public ResponseEntity<List<String>> getAllStoriesOwners() {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Getting all stories owners");
        }
        return ResponseEntity.ok(messageService.getRecentStories().stream()
                .map(Message::getSender)
                .distinct()
                .toList());
    }

    /**
     * get stories by sender
     */
    @GetMapping("/stories/{sender}")
    public ResponseEntity<List<Message>> getStoriesBySender(@PathVariable String sender) {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Getting stories by sender");
        }
        return ResponseEntity.ok(messageService.getStoriesBySender(sender));
    }

}
