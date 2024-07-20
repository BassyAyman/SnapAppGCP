package fr.polytech.readmessageserver;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sender;
    private String receiver;
    private String content;
    private Integer durationInMinutes;
    private Date creationDate;

    public Message(String sender, String receiver, String content, Integer durationInMinutes) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.durationInMinutes = durationInMinutes;
    }

    public Message() {
    }
}
