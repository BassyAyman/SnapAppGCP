package fr.polytech.readmessageserver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Auth {
    @Value("${TOKEN_SECRET}")
    private String tokenSecret;

    public boolean isTokenValid(String token) {
        return token.equals(tokenSecret);
    }
}
