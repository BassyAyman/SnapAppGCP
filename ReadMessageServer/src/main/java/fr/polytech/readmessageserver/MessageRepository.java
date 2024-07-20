package fr.polytech.readmessageserver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySender(String sender);

    List<Message> findByReceiver(String receiver);

    @Query("SELECT m.sender FROM Message m")
    List<String> findAllSenders();

    @Query("SELECT m.receiver FROM Message m")
    List<String> findAllReceivers();

    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1)")
    List<Message> findBetweenTwoUsers(@Param("user1") String user1, @Param("user2") String user2);

}
