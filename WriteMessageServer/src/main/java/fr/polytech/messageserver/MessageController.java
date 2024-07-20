package fr.polytech.messageserver;

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
    MediaServerProxy mediaServerProxy;

    @Autowired
    Auth auth;

    @PostMapping("/text")
    public ResponseEntity<Message> createMessage(@RequestHeader(value = "Auth") String token, @RequestBody Message message) {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Creating message");
        }
        if (!auth.isTokenValid(token)) {
            if (LOGGER.isLoggable(Level.WARNING)) {
                LOGGER.warning("Invalid request with token"+token);
            }
            return ResponseEntity.status(403).build(); // Forbidden
        }
        return ResponseEntity.ok(messageService.createMessage(message));
    }

    @PostMapping("/image")
    public ResponseEntity<Message> createImageMessage(@RequestHeader(value = "Auth") String token, @RequestBody ImageMessage message) {
        if (LOGGER.isLoggable(Level.INFO)) {
            LOGGER.info("Creating image message");
        }
        if (!auth.isTokenValid(token)) {
            if (LOGGER.isLoggable(Level.WARNING)) {
                LOGGER.warning("Invalid request with token"+token);
            }
            return ResponseEntity.status(403).build(); // Forbidden
        }
        if (mediaServerProxy.isValidImage(message.getImageStorageId())) {
            return ResponseEntity.ok(messageService.createMessage(message));
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @PutMapping("/random")
    public ResponseEntity<Message> createRandomMessage() {
        return ResponseEntity.ok(messageService.createRandomMessage());
    }
}
