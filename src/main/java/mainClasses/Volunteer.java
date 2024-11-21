/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mainClasses;

import database.tables.EditUsersTable;
import database.tables.EditVolunteersTable;
import exceptions.EmailAlreadyRegisteredException;
import exceptions.TelephoneAlreadyRegisteredException;
import exceptions.UsernameAlreadyRegisteredException;
import org.json.JSONObject;

import java.sql.SQLException;

/**
 *
 * @author mountant
 */
public class Volunteer {
    int volunteer_id;
    String username,email,password;
    String firstname,lastname,birthdate;
    String gender,job,afm;
    String country,address;
    Double lat,lon, height, weight;
    String telephone;
    String municipality,prefecture, volunteer_type;

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getVolunteer_type() {
        return volunteer_type;
    }

    public void setVolunteer_type(String volunteer_type) {
        this.volunteer_type = volunteer_type;
    }

    

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public int getVolunteer_id() {
        return volunteer_id;
    }

    public void setVolunteer_id(int volunteer_id) {
        this.volunteer_id = volunteer_id;
    }


    public String getAfm() {
        return afm;
    }

    public void setAfm(String afm) {
        this.afm = afm;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getPrefecture() {
        return prefecture;
    }

    public void setPrefecture(String prefecture) {
        this.prefecture = prefecture;
    }

   
   
    
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    
    
    
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

   
    
    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthDate) {
        this.birthdate = birthDate;
    }

   
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

 

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public static void checkCredentialsUniqueness(JSONObject userData) throws SQLException, ClassNotFoundException {
        String username = userData.getString(Resources.ATTR_USERNAME);
        String email = userData.getString(Resources.ATTR_EMAIL);
        String telephone = userData.getString(Resources.ATTR_TELEPHONE);
        checkCredentialsUniqueness(username, email, telephone);
    }

    public static void checkCredentialsUniqueness(String username, String email, String telephone) throws SQLException, ClassNotFoundException {
        EditVolunteersTable eut = new EditVolunteersTable();

        boolean usernameExists = false;
        if (username != null)
            usernameExists = eut.hasVolunteerWithAttributes(new String[]
                    {Resources.ATTR_USERNAME}, new String[]{username}
            );
        boolean emailExists = false;
        if (email != null)
            emailExists = eut.hasVolunteerWithAttributes(new String[]
                    {Resources.ATTR_EMAIL}, new String[]{email}
            );
        boolean telephoneExists = false;
        if (telephone != null)
            telephoneExists = eut.hasVolunteerWithAttributes(new String[]
                    {Resources.ATTR_TELEPHONE}, new String[]{telephone}
            );

        if (usernameExists) throw new UsernameAlreadyRegisteredException(Resources.ERR_USERNAME_ALREADY_EXISTS + Resources.TABLE_VOLUNTEERS); else
        if (emailExists) throw new EmailAlreadyRegisteredException(Resources.ERR_EMAIL_ALREADY_EXISTS + Resources.TABLE_VOLUNTEERS); else
        if (telephoneExists) throw new TelephoneAlreadyRegisteredException(Resources.ERR_TELEPHONE_ALREADY_EXISTS + Resources.TABLE_VOLUNTEERS);
    }

}
