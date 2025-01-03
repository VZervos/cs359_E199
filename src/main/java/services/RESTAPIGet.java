package services;

import database.tables.*;
import exceptions.UsernameAlreadyRegisteredException;
import mainClasses.*;
import org.json.JSONArray;
import org.json.JSONObject;
import utility.Utility;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import static services.StandardResponse.DataResponseAsJson;
import static services.StandardResponse.ErrorResponse;
import static spark.Spark.get;
import static utility.Resources.*;

public class RESTAPIGet extends API {
    public static void startGetApi() {
        get(API_PATH + "/incidents/:type/:status", (request, response) -> {
            initResponse(response);
            String incidentTypeParam = getRequestParam(request, "type");
            String incidentStatusParam = getRequestParam(request, "status");
            String municipalityParam = getQueryParamElse(request, "municipality", "all");

            Validator validator = new Validator();
            EditIncidentsTable eit = new EditIncidentsTable();

            if (!incidentStatusParam.equals("all") && !Utility.isInTable(incidentStatusParam, INCIDENT_STATUSES))
                return ErrorResponse(response, 406, "Error: Invalid incident status provided.");
            if (!incidentTypeParam.equals("all") && !Utility.isInTable(incidentTypeParam, INCIDENT_TYPES))
                return ErrorResponse(response, 406, "Error: Invalid incident status provided.");

            List<Incident> incidentsList = eit.databaseToIncidentsSearch(incidentTypeParam, incidentStatusParam, municipalityParam);
            StringBuilder incidentsJson = new StringBuilder("[");
            for (Incident incident : incidentsList) {
                incidentsJson.append(eit.incidentToJSON(incident)).append(',');
            }
            if (incidentsJson.length() > 2)
                incidentsJson.deleteCharAt(incidentsJson.length() - 1);
            incidentsJson.append("]");

            return DataResponseAsJson(incidentsJson.toString());
        });

        get(API_PATH + "/participants/:incident_id", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");

            EditIncidentsTable eit = new EditIncidentsTable();
            EditParticipantsTable ept = new EditParticipantsTable();

            Incident incident = eit.getIncidentIfExist(incidentIdParam);
            if (!incidentIdParam.equals("all") && incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            StringBuilder participantsJson = new StringBuilder("[");
            List<Participant> participantList = ept.getParticipants(incidentIdParam);
            for (Participant volunteer : participantList) {
                participantsJson.append(ept.participantToJSON(volunteer)).append(',');
            }
            if (participantsJson.length() > 2)
                participantsJson.deleteCharAt(participantsJson.length() - 1);
            participantsJson.append("]");

            return DataResponseAsJson(participantsJson.toString());
        });

        get(API_PATH + "/volunteers/:type", (request, response) -> {
            initResponse(response);
            String volunteerTypeParam = getRequestParamElse(request, "type", "all");

            if (!volunteerTypeParam.equals("all") && !Utility.isInTable(volunteerTypeParam, VOLUNTEER_TYPES))
                return ErrorResponse(response, 406, "Error: Volunteer type is invalid.");

            EditVolunteersTable evt = new EditVolunteersTable();
            StringBuilder volunteersJson = new StringBuilder("[");
            List<Volunteer> volunteersList;
            if (volunteerTypeParam.equals("all")) {
                volunteersList = evt.getVolunteers("simple");
                for (Volunteer volunteer : volunteersList) {
                    volunteersJson.append(evt.volunteerToJSON(volunteer)).append(',');
                }
                volunteersList = evt.getVolunteers("driver");
                for (Volunteer volunteer : volunteersList) {
                    volunteersJson.append(evt.volunteerToJSON(volunteer)).append(',');
                }
            } else {
                volunteersList = evt.getVolunteers(volunteerTypeParam);
                for (Volunteer volunteer : volunteersList) {
                    volunteersJson.append(evt.volunteerToJSON(volunteer)).append(',');
                }
            }
            if (volunteersJson.length() > 2)
                volunteersJson.deleteCharAt(volunteersJson.length() - 1);
            volunteersJson.append("]");

            return DataResponseAsJson(volunteersJson.toString());
        });

        get(API_PATH + "/messages/:incident_id", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");
//            String senderParam = getQueryParamElse(request, "sender", "admin");
            String chatType = getQueryParamElse(request, "chattype", "public");

            EditMessagesTable emt = new EditMessagesTable();
            EditIncidentsTable eit = new EditIncidentsTable();
//            try {
//                if (Utility.isInTable(senderParam, PREDEFINED_USERNAMES))
//                    throw new UsernameAlreadyRegisteredException(senderParam);
//                User.checkCredentialsUniqueness(senderParam, null, null);
//                Volunteer.checkCredentialsUniqueness(senderParam, null, null);
//                return ErrorResponse(response, 404, "Error: Sender not found.");
//            } catch (UsernameAlreadyRegisteredException _) {}

            try {
                if (Utility.isInTable(chatType, PREDEFINED_USERNAMES))
                    throw new UsernameAlreadyRegisteredException(chatType);
                User.checkCredentialsUniqueness(chatType, null, null);
                Volunteer.checkCredentialsUniqueness(chatType, null, null);
                return ErrorResponse(response, 404, "Error: Recipient not found.");
            } catch (UsernameAlreadyRegisteredException _) {
            }

            Incident incident = eit.getIncidentIfExist(incidentIdParam);
            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            List<Message> messagesList = emt.databaseToMessages(Integer.parseInt(incidentIdParam), null, chatType);
            StringBuilder messagesJson = new StringBuilder("[");
            for (Message message : messagesList) {
                messagesJson.append(emt.messageToJSON(message)).append(',');
            }
            if (messagesJson.length() > 2)
                messagesJson.deleteCharAt(messagesJson.length() - 1);
            messagesJson.append("]");

            return DataResponseAsJson(messagesJson.toString());
        });

        get(API_PATH + "/chatTypes", (request, response) -> {
            initResponse(response);
            String usernameParam = getQueryParamElse(request, "username", "admin");
            String incidentIdParam = getQueryParamElse(request, "incidentId", null);

            EditUsersTable eut = new EditUsersTable();
            EditVolunteersTable evt = new EditVolunteersTable();
            EditParticipantsTable ept = new EditParticipantsTable();
            EditIncidentsTable eit = new EditIncidentsTable();

            try {
                if (!Utility.isInTable(usernameParam, new String[]{"public", "volunteers", "admin"}))
                    throw new UsernameAlreadyRegisteredException(usernameParam);
                User.checkCredentialsUniqueness(usernameParam, null, null);
                Volunteer.checkCredentialsUniqueness(usernameParam, null, null);
                return ErrorResponse(response, 404, "Error: Username not found.");
            } catch (UsernameAlreadyRegisteredException _) {
            }

            String username = usernameParam;
            String usertype = usernameParam;
            List<User> usersList;
            List<Volunteer> volunteersList;
            if (!usertype.equals("admin")) {
                usersList = eut.getUsers();
                volunteersList = evt.getVolunteers();
                User user = usersList.stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
                Volunteer volunteer = volunteersList.stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
                if (user != null) usertype = USER_TYPE_USER;
                else if (volunteer != null) usertype = USER_TYPE_VOLUNTEER;
                else return ErrorResponse(response, 404, "Error: Usertype not found.");
            }

            // TODO Paragraph 3.7 with messages. Convert to json objects with whether it can readonly or write too, etc.
            List<String> recipients = null;
            JSONArray recipientsJson = new JSONArray();
            switch (usertype) {
                case USER_TYPE_ADMIN -> recipientsJson = generateAdminRecipients();
                case USER_TYPE_VOLUNTEER -> {
                    Incident incident = eit.getIncidentIfExist(incidentIdParam);
                    if (incident == null)
                        return ErrorResponse(response, 404, "Error: Incident not found.");
                    recipientsJson = generateVolunteerRecipients(incident, username);
                }
                case USER_TYPE_USER -> {
                    Incident incident = eit.getIncidentIfExist(incidentIdParam);
                    if (incident == null)
                        return ErrorResponse(response, 404, "Error: Incident not found.");
                    recipientsJson = generateUserRecipients(incident);
                }
                default -> {
                    assert false;
                }
            }

            return DataResponseAsJson(recipientsJson.toString());
        });
    }

    private static JSONArray generateVolunteerRecipients(Incident incident, String username) throws SQLException, ClassNotFoundException {
        JSONArray recipientsJson = new JSONArray();
        EditMessagesTable emt = new EditMessagesTable();
        EditParticipantsTable ept = new EditParticipantsTable();
        List<Participant> participantsList = ept.getParticipants(String.valueOf(incident.getIncident_id()));
        Arrays.stream(RECIPIENT_LISTS).forEach(rec -> {
            JSONObject recipient = new JSONObject();
            recipient.put("username", rec);
            recipient.put("canSend", incident.getStatus().equals(INCIDENT_STATUS_RUNNING));
            recipientsJson.put(recipient);
        });
        Participant participant = participantsList.stream()
                .filter(p ->
                        p.getIncident_id() == incident.getIncident_id()
                                && p.getVolunteer_username().equals(username)
                )
                .findFirst().orElse(null);
        if (participant != null) {
            participantsList.stream()
                    .filter(p -> p.getIncident_id() == incident.getIncident_id())
                    .forEach(p -> {
                        JSONObject recipient = new JSONObject();
                        recipient.put("username", p.getVolunteer_username());
                        recipient.put("canSend", true);
                        recipientsJson.put(recipient);
                    });
        }
        return recipientsJson;
    }

    private static JSONArray generateUserRecipients(Incident incident) throws SQLException, ClassNotFoundException {
        JSONArray recipientsJson = new JSONArray();
        List.of(new String[]{"admin", "public"})
                .forEach(rec -> {
                    JSONObject recipient = new JSONObject();
                    recipient.put("username", rec);
                    recipient.put("canSend", incident.getStatus().equals(INCIDENT_STATUS_RUNNING));
                    recipientsJson.put(recipient);
                });
        return recipientsJson;
    }

    private static JSONArray generateAdminRecipients() throws SQLException, ClassNotFoundException {
        EditUsersTable eut = new EditUsersTable();
        EditVolunteersTable evt = new EditVolunteersTable();
        JSONArray recipientsJson = new JSONArray();
        Stream.concat(
                        eut.getUsers().stream().map(User::getUsername),
                        evt.getVolunteers().stream().map(Volunteer::getUsername)
                )
                .sorted(Comparator.reverseOrder())
                .forEach(recipient -> {
                    JSONObject recipientJson = new JSONObject();
                    recipientJson.put("username", recipient);
                    recipientJson.put("canSend", true);
                    recipientsJson.put(recipientJson);
                });
        JSONObject publicRecipient = new JSONObject();
        publicRecipient.put("username", "public");
        publicRecipient.put("canSend", true);
        recipientsJson.put(publicRecipient);
        JSONObject volunteersRecipient = new JSONObject();
        volunteersRecipient.put("username", "volunteers");
        volunteersRecipient.put("canSend", true);
        recipientsJson.put(volunteersRecipient);
        return recipientsJson;
    }
}
