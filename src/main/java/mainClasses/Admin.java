package mainClasses;

import com.google.gson.Gson;

public class Admin {
    public static final String ADMIN_USERNAME = "admin";
    public static final String ADMIN_PASSWORD = "admiN12@*";

    public String username;
    public String password;

    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Admin(String adminJson) {
        Gson gson = new Gson();
        Admin admin = gson.fromJson(adminJson, Admin.class);
        this.username = admin.username;
        this.password = admin.password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String toJson() {
        Gson gson = new Gson();
        return gson.toJson(this, Admin.class);
    }

    public boolean isUsernameCorrect() {
        return this.username.equals(ADMIN_USERNAME);
    }

    public boolean isPasswordCorrect() {
        return this.password.equals(ADMIN_PASSWORD);
    }
}
