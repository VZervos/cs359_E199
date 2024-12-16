package services;

import org.json.JSONObject;
import spark.Request;
import spark.Response;

public abstract class API {
    public static final String API_PATH = "E199API/";

    public static void initResponse(Response response) {
        response.status(200);
        response.type("application/json");
    }

    public static String getRequestParam(Request request, String param) {
        return request.params(":" + param);
    }

    public static String getRequestParamElse(Request request, String param, String elseValue) {
        return request.params(":" + param) == null ? elseValue : request.params(":" + param);
    }

    public static String getQueryParam(Request request, String param) {
        return request.raw().getParameter(param);
    }

    public static String getQueryParamElse(Request request, String param, String elseValue) {
        return request.raw().getParameter(param) == null ? elseValue : request.raw().getParameter(param);
    }

    public static JSONObject getBody(Request request) {
        return new JSONObject(request.body());
    }
}
