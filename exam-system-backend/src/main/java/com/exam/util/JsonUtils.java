package com.exam.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JsonUtils {
    private static final Gson gson = new Gson();

    public static void sendSuccess(HttpServletResponse resp, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write(gson.toJson(data));
    }

    public static void sendError(HttpServletResponse resp, int statusCode, String message) throws IOException {
        resp.setContentType("application/json");
        resp.setStatus(statusCode);
        
        JsonObject json = new JsonObject();
        json.addProperty("error", message);
        
        resp.getWriter().write(gson.toJson(json));
    }
    
    public static <T> T parseBody(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }
}
