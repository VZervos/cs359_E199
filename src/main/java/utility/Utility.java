package utility;

import database.tables.EditUsersTable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utility {
    public static JSONObject getBodyJson(HttpServletRequest request) throws IOException {
        return new JSONObject(getBodyString(request));
    }

    public static String getBodyString(HttpServletRequest request) throws IOException {
        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
        }

        System.out.println("Request Body: " + body);
        String jsonString = body.toString();
        System.out.println("Request Body: " + jsonString);
        return jsonString;
    }

    public static boolean isActiveSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        return session != null && getSessionUserData(request) != null;
    }

    public static String getSessionUserData(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String sessionUser = (String) session.getAttribute("user");
        return sessionUser;
    }

    public static String getCurrentDatetime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

}
