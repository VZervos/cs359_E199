package services;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import mainClasses.Incident;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.post;
import static utility.Resources.*;

public class RESTAPIPost extends API {
    public static void startPostApi() {
        post(API_PATH + "/incident", (request, response) -> {
            initResponse(response);
            Validator validator = new Validator();

            Incident incident = new Gson().fromJson(request.body(), Incident.class);
            if (validator.hasNullItems(new String[]{
                    incident.getIncident_type(),
                    incident.getDescription(),
                    incident.getUser_phone(),
                    incident.getUser_type(),
                    incident.getAddress()})
            ) {
                return ErrorResponse(response, 406, "Error: Not all mandatory fields contain information.");
            }

            String user_phone = incident.getUser_phone();
            if (user_phone != null && (user_phone.length() < MIN_PHONE_LENGTH || user_phone.length() > MAX_PHONE_LENGTH))
                return ErrorResponse(response, 406, "Error: Invalid user phone provided.");

            String user_type = incident.getUser_type();
            if (user_type != null && (!user_type.equals(USER_TYPE_ADMIN) && !user_type.equals(USER_TYPE_GUEST) && !user_type.equals(USER_TYPE_USER)))
                return ErrorResponse(response, 406, "Error: Invalid user type provided.");

            String incident_type = incident.getIncident_type();
            if (incident_type != null && (!incident_type.equals(INCIDENT_TYPE_FIRE) && !incident_type.equals(INCIDENT_TYPE_ACCIDENT)))
                return ErrorResponse(response, 406, "Error: Invalid incident type provided.");

            String prefecture = incident.getPrefecture();
            if (prefecture != null && (!prefecture.equals(PREFECTURE_CHANIA) && !prefecture.equals(PREFECTURE_RETHYMNO) && !prefecture.equals(PREFECTURE_HERAKLION) && !prefecture.equals(PREFECTURE_LASITHI)))
                return ErrorResponse(response, 406, "Error: Invalid prefecture provided.");

            EditIncidentsTable eit = new EditIncidentsTable();
            incident.setStatus(INCIDENT_STATUS_SUBMITTED);
            incident.setDanger(INCIDENT_DANGER_UNKNOWN);
            incident.setStart_datetime();

            eit.addIncidentFromJSON(eit.incidentToJSON(incident));

            return MessageResponse("Incident successfully added.");
        });

//        post(API_PATH + "/participantAddition", (request, response) -> {
//            response.status(200);
//            response.type("application/json");
//            System.out.println(request.body());
//            Participant participant = new Gson().fromJson(request.body(), Participant.class);
//
//            if (participant.getStatus() == null ||
//                    participant.getVolunteer_type() == null ||
//                    participant.getVolunteer_username() == null) {
//                return ErrorResponse(response, 406, "Error: Not all mandatory fields contain information.");
//            }
//
//            EditIncidentsTable eit = new EditIncidentsTable();
//            List<Incident> incidentList = eit.databaseToIncidents();
//            Incident incident = incidentList.stream().filter(inc -> inc.getIncident_id() == participant.getIncident_id()).findFirst().orElse(null);
//
//            if (incident == null)
//                return ErrorResponse(response, 404, "Error: Incident not found.");
//
//            EditParticipantsTable ept = new EditParticipantsTable();
//            ept.createNewParticipant(participant);
//
//            return MessageResponse("Created participant " + participant.getIncident_id() + "(" + participant.getVolunteer_username() + ").");
//        });

    }
}
