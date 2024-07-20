package fr.polytech.messageserver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MediaServerProxy {
    @Value("${MEDIA_SERVER_URL}")
    private String mediaServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isValidImage(String imageStorageId) {
        MediaServerResponse response = restTemplate.getForObject(mediaServerUrl + "/checkMedia?mediaID=" + imageStorageId , MediaServerResponse.class);
        return response.isExists();
    }
}
