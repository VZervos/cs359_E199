/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

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

/**
 * @author micha
 */
public class IsUserAttributeValueAvailable extends HttpServlet {

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
        response.setContentType("text/plain;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        Writer writer = null;
        try {
            writer = response.getWriter();

            String attribute = request.getParameter("attribute");
            String value = request.getParameter("value");
            switch (attribute) {
                case Resources.ATTR_USERNAME -> {
                    User.checkCredentialsUniqueness(value, null, null);
                    Volunteer.checkCredentialsUniqueness(value, null, null);
                }
                case Resources.ATTR_EMAIL -> {
                    User.checkCredentialsUniqueness(null, value, null);
                    Volunteer.checkCredentialsUniqueness(null, value, null);
                }
                case Resources.ATTR_TELEPHONE -> {
                    User.checkCredentialsUniqueness(null, null, value);
                    Volunteer.checkCredentialsUniqueness(null, null, value);
                }
            }

            writer.write("Username is unique");
        } catch (UsernameAlreadyRegisteredException | EmailAlreadyRegisteredException | TelephoneAlreadyRegisteredException e) {
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

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

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
