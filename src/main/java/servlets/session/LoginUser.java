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
        String usertype;
        HttpSession session;
        session = request.getSession(false);
        usertype = (String) session.getAttribute("usertype");
        switch (usertype) {
            case USERTYPE_USER -> {
                EditUsersTable eut = new EditUsersTable();
                User sessionUser = eut.jsonToUser(getSessionUserData(request));
                responseBody.put("user", eut.userToJSON(sessionUser));
                responseBody.put("message", "Session found for user " + sessionUser.getUsername());
            }
            case USERTYPE_VOLUNTEER -> {
                EditVolunteersTable evt = new EditVolunteersTable();
                Volunteer sessionVolunteer = evt.jsonToVolunteer(getSessionUserData(request));
                responseBody.put("user", evt.volunteerToJSON(sessionVolunteer));
                responseBody.put("message", "Session found for volunteer " + sessionVolunteer.getUsername());
            }
            case USERTYPE_ADMIN -> {
                // TODO
            }
            default -> {assert false;}
        }
        return session;
    }

    private static void startNewSession(HttpServletRequest request, HttpSession session, JSONObject responseBody) throws IOException {
        JSONObject bodyJson = getBodyJson(request);
        String body = bodyJson.getString("user");
        String usertype = bodyJson.getString("usertype");

        String username = null;
        switch (usertype) {
            case USERTYPE_USER -> {
                EditUsersTable eut = new EditUsersTable();
                User user = eut.jsonToUser(body);
                String userData = eut.userToJSON(user);
                session.setAttribute("user", userData);
                session.setAttribute("usertype", usertype);
                responseBody.put("user", userData);
                username = user.getUsername();
            }
            case USERTYPE_VOLUNTEER -> {
                EditVolunteersTable evt = new EditVolunteersTable();
                Volunteer volunteer = evt.jsonToVolunteer(body);
                String userData = evt.volunteerToJSON(volunteer);
                session.setAttribute("user", userData);
                session.setAttribute("usertype", usertype);
                responseBody.put("user", userData);
                username = volunteer.getUsername();
            }
            case USERTYPE_ADMIN -> {
                // TODO
            }
            default -> {assert false;}
        }
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
