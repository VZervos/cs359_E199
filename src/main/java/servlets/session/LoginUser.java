/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets.session;

import database.tables.EditUsersTable;
import database.tables.EditVolunteersTable;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import mainClasses.Admin;
import mainClasses.User;
import mainClasses.Volunteer;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

import static utility.Resources.*;
import static utility.Utility.*;

/**
 * @author micha
 */
public class LoginUser extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        //
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        HttpSession session;
        JSONObject responseBody = new JSONObject();
        if (isActiveSession(request)) {
            session = getActiveSession(request, responseBody);
            responseBody.put("activeSession", true);
        } else {
            session = request.getSession(true);
            responseBody.put("activeSession", false);
            startNewSession(request, session, responseBody);
        }
        responseBody.put("session", session.toString());

        Writer writer = response.getWriter();
        try {
            writer.write(responseBody.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            assert writer != null;
            writer.write(e.getMessage());
            e.printStackTrace();
        }
    }

    private static HttpSession getActiveSession(HttpServletRequest request, JSONObject responseBody) {
        String user_type;
        HttpSession session;
        session = request.getSession(false);
        user_type = (String) session.getAttribute("user_type");

        String userdata = null;
        String username = null;
        switch (user_type) {
            case USER_TYPE_USER -> {
                EditUsersTable eut = new EditUsersTable();
                User sessionUser = eut.jsonToUser(getSessionUserData(request));
                userdata = eut.userToJSON(sessionUser);
                username = sessionUser.getUsername();
            }
            case USER_TYPE_VOLUNTEER -> {
                EditVolunteersTable evt = new EditVolunteersTable();
                Volunteer sessionVolunteer = evt.jsonToVolunteer(getSessionUserData(request));
                userdata = evt.volunteerToJSON(sessionVolunteer);
                username = sessionVolunteer.getUsername();
            }
            case USER_TYPE_ADMIN -> {
                Admin sessionAdmin = new Admin(getSessionUserData(request));
                userdata = sessionAdmin.toJson();
                username = sessionAdmin.getUsername();
            }
            default -> {
                assert false;
            }
        }
        responseBody.put("user", userdata);
        responseBody.put("message", "Session found for user " + username);
        return session;
    }

    private static void startNewSession(HttpServletRequest request, HttpSession session, JSONObject responseBody) throws IOException {
        JSONObject bodyJson = getBodyJson(request);
        String body = bodyJson.getString("user");
        String user_type = bodyJson.getString("user_type");

        String username = null;
        String userData = null;
        switch (user_type) {
            case USER_TYPE_USER -> {
                EditUsersTable eut = new EditUsersTable();
                User user = eut.jsonToUser(body);
                userData = eut.userToJSON(user);
                username = user.getUsername();
            }
            case USER_TYPE_VOLUNTEER -> {
                EditVolunteersTable evt = new EditVolunteersTable();
                Volunteer volunteer = evt.jsonToVolunteer(body);
                userData = evt.volunteerToJSON(volunteer);
                username = volunteer.getUsername();
            }
            case USER_TYPE_ADMIN -> {
                Admin admin = new Admin(body);
                userData = admin.toJson();
                username = admin.getUsername();
            }
            default -> {
                assert false;
            }
        }
        session.setAttribute("user", userData);
        session.setAttribute("user_type", user_type);
        responseBody.put("user", userData);
        responseBody.put("message", "Initiated new session for user " + username);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
