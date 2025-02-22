/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets.modification;

import database.tables.EditUsersTable;
import database.tables.EditVolunteersTable;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mainClasses.User;
import mainClasses.Volunteer;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

import static utility.Resources.USER_TYPE_USER;
import static utility.Resources.USER_TYPE_VOLUNTEER;
import static utility.Utility.getBodyJson;
import static utility.Utility.getSessionUserData;

/**
 * @author micha
 */
public class UpdateInfoField extends HttpServlet {

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
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        JSONObject newInfo = getBodyJson(request);
        String user_type = newInfo.getString("user_type");
        String field = newInfo.getString("field");
        String value = newInfo.getString("value");

        JSONObject responseBody = new JSONObject();
        Writer writer = response.getWriter();
        try {
            String username = null;
            switch (user_type) {
                case USER_TYPE_USER -> {
                    EditUsersTable eut = new EditUsersTable();
                    User sessionUser = eut.jsonToUser(getSessionUserData(request));
                    username = sessionUser.getUsername();
                    eut.updateUser(username, field, value);
                }
                case USER_TYPE_VOLUNTEER -> {
                    EditVolunteersTable evt = new EditVolunteersTable();
                    Volunteer sessionVolunteer = evt.jsonToVolunteer(getSessionUserData(request));
                    username = sessionVolunteer.getUsername();
                    evt.updateVolunteer(username, field, value);
                }
                default -> {
                    assert false;
                }
            }
            responseBody.put("message", "Updated " + field + " of user " + username + " to " + value);
            writer.write(responseBody.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            assert writer != null;
            writer.write(e.getMessage());
            e.printStackTrace();
        }

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
