package utility;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

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

        String jsonString = body.toString();
        if (jsonString.startsWith("\"{") && jsonString.endsWith("}\"")) {
            jsonString = jsonString.substring(1, jsonString.length() - 1).replace("\\\"", "\"");
        }
        return jsonString;
    }

    public static String replaceLast(String text, String regex, String replacement) {
        return text.replaceFirst("(?s)(.*)" + regex, "$1" + replacement);
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

    public static JSONObject getAllSessionUserData(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String sessionUser = (String) session.getAttribute("user");
        String sessionUserType = (String) session.getAttribute("user_type");
        JSONObject sessionUserData = new JSONObject();
        sessionUserData.put("user", sessionUser);
        sessionUserData.put("user_type", sessionUserType);
        return sessionUserData;
    }

    public static String getCurrentDatetime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

    public static boolean isInTable(String item, String[] table) {
        return Arrays.asList(table).contains(item);
    }

    public static String SQLizeString(String str) {
        return str
                .replace("\\", "\\\\")
                .replace("'", "''")
                .replace("\"", "\\\"");
    }

}
