package services;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import spark.Response;

public class StandardResponse {
    private String message;
    private JsonElement data;

    public StandardResponse(String message) {
        this.message = message;
    }

    public StandardResponse(JsonElement data) {
        this.data = data;
    }

    public static String ErrorResponse(Response response, int code, String message) {
        response.status(code);
        return new Gson().toJson(new StandardResponse(message));
    }

    public static String MessageResponse(String message) {
        return new Gson().toJson(new StandardResponse(message));
    }

    public static String DataResponseAsJsonString(String data) {
        return new Gson().toJson(new StandardResponse(new Gson().toJsonTree(data)));
    }

    public static String DataResponseAsJson(String data) {
        JsonElement jsonElement;
        try {
            jsonElement = new Gson().fromJson(data, JsonElement.class);
        } catch (Exception e) {
            jsonElement = new Gson().toJsonTree(data);
        }
        return new Gson().toJson(new StandardResponse(jsonElement));
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public JsonElement getData() {
        return data;
    }

    public void setData(JsonElement data) {
        this.data = data;
    }
}
