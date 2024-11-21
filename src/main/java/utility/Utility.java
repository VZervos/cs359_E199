package utility;

import jakarta.servlet.http.HttpServletRequest;

import java.io.BufferedReader;
import java.io.IOException;

public class Utility {
    public static String getBody(HttpServletRequest request) throws IOException {
        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
        }

        System.out.println("Request Body: " + body.toString());
        String jsonString = body.toString();
        System.out.println("Request Body: " + jsonString);

        return jsonString;
    }
}
