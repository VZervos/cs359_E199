/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditUsersTable;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

import database.tables.EditVolunteersTable;
import exceptions.EmailAlreadyRegisteredException;
import exceptions.TelephoneAlreadyRegisteredException;
import exceptions.UsernameAlreadyRegisteredException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mainClasses.Resources;
import mainClasses.User;
import mainClasses.Volunteer;
import org.json.JSONObject;

import static utility.Utility.*;

/**
 * @author micha
 */
public class RegisterUser extends HttpServlet {

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
        response.setContentType("text/plain;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        Writer writer = null;
        String body;
        try {
            writer = response.getWriter();
//            JSONObject userData = getBodyJson(request);
            String userDataString = getBodyString(request);
            JSONObject userData = new JSONObject(userDataString);

            String type = userData.getString("type");
            switch (type) {
                case Resources.TYPE_USER -> registerUser(userDataString, userData);
                case Resources.TYPE_ADMIN -> registerAdmin(request);
                case Resources.TYPE_VOLUNTEER -> registerVolunteer(userDataString, userData);
                default -> {
                    assert false;
                }
            }
            writer.write(type + " has been successfully registered: " + userData.getString("username"));
        } catch (UsernameAlreadyRegisteredException | EmailAlreadyRegisteredException |
                 TelephoneAlreadyRegisteredException e) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            assert writer != null;
            writer.write(e.getMessage());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            assert writer != null;
            writer.write(e.getMessage());
            e.printStackTrace();
        }

    }

    private void registerUser(String body, JSONObject userData)
            throws ClassNotFoundException, UsernameAlreadyRegisteredException, TelephoneAlreadyRegisteredException, EmailAlreadyRegisteredException, SQLException {
        User.checkCredentialsUniqueness(userData);
        Volunteer.checkCredentialsUniqueness(userData);

        EditUsersTable eut = new EditUsersTable();
        eut.addUserFromJSON(body);
    }

    private void registerAdmin(HttpServletRequest request) {
        // TODO
    }

    private void registerVolunteer(String body, JSONObject volunteerData)
            throws ClassNotFoundException, UsernameAlreadyRegisteredException, TelephoneAlreadyRegisteredException, EmailAlreadyRegisteredException, SQLException {
        User.checkCredentialsUniqueness(volunteerData);
        Volunteer.checkCredentialsUniqueness(volunteerData);

        EditVolunteersTable evt = new EditVolunteersTable();
        evt.addVolunteerFromJSON(body);
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
