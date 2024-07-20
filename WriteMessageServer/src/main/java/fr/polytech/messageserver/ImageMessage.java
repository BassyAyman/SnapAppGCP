package fr.polytech.messageserver;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ImageMessage extends Message{
    private String imageStorageId;
}
