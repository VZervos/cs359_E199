/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets.retrieval;

import database.tables.EditUsersTable;
import database.tables.EditVolunteersTable;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mainClasses.Admin;
import mainClasses.User;
import mainClasses.Volunteer;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

import static utility.Resources.*;
import static utility.Utility.getBodyJson;

/**
 * @author micha
 */
public class RetrieveUser extends HttpServlet {

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

        Writer writer = response.getWriter();
        try {
            writer = response.getWriter();
            JSONObject responseBody = retrieveUserData(request, response);
            writer.write(responseBody.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            assert writer != null;
            writer.write(e.getMessage());
            e.printStackTrace();
        }
    }

    private static JSONObject retrieveUserData(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException, ClassNotFoundException {
        JSONObject userCredentials = getBodyJson(request);

        String user_type = userCredentials.getString("user_type");
        String username = userCredentials.getString("username");
        String password = userCredentials.getString("password");
        JSONObject responseBody = new JSONObject();
        switch (user_type) {
            case USER_TYPE_USER -> {
                EditUsersTable eut = new EditUsersTable();
                User user = eut.databaseToUsers(username, password);
                if (user != null) {
                    responseBody.put("user", eut.userToJSON(user));
                    responseBody.put("message", "User successfully retrieved");
                } else {
                    responseBody.put("message", "User not found");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }
            }
            case USER_TYPE_VOLUNTEER -> {
                EditVolunteersTable evt = new EditVolunteersTable();
                Volunteer volunteer = evt.databaseToVolunteer(username, password);
                if (volunteer != null) {
                    responseBody.put("user", evt.volunteerToJSON(volunteer));
                    responseBody.put("message", "Volunteer successfully retrieved");
                } else {
                    responseBody.put("message", "Volunteer not found");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }
            }
            case USER_TYPE_ADMIN -> {
                Admin admin = new Admin(username, password);
                if (admin.isUsernameCorrect() && admin.isPasswordCorrect()) {
                    responseBody.put("user", admin.toJson());
                    responseBody.put("message", "Admin successfully retrieved");
                } else {
                    responseBody.put("message", "Admin not found");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }
            }
            default -> {
                assert false;
            }
        }
        return responseBody;
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
