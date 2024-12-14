package services;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import database.tables.EditParticipantsTable;
import database.tables.EditVolunteersTable;
import mainClasses.Incident;
import mainClasses.Participant;
import mainClasses.Volunteer;
import org.json.JSONObject;
import utility.Utility;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.*;
import static spark.Spark.*;
import static utility.Resources.*;
import static utility.Utility.isInTable;

public class RESTAPIPut {
    static final String API_PATH = "E199API/";

    public static void startPutApi() {
        put(API_PATH + "incidentStatus/:incident_id/:status", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String incidentIdParam = request.params(":incident_id");
            String incidentStatusParam = request.params(":status");

            int incidentId;
            try {
                incidentId = Integer.parseInt(incidentIdParam);
            } catch (NumberFormatException e) {
                return ErrorResponse(response, 406, "Error: Incident Id provided is not a valid Id.");
            }

            if (Arrays.stream(INCIDENT_STATUSES).noneMatch(inc -> inc.equals(incidentStatusParam)))
                return ErrorResponse(response, 406, "Error: Invalid incident status provided.");


            EditIncidentsTable eit = new EditIncidentsTable();
            List<Incident> incidentList = eit.databaseToIncidents();
            Incident incident = incidentList.stream().filter(inc -> inc.getIncident_id() == incidentId).findFirst().orElse(null);

            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            String incidentStatus = incident.getStatus();
            String newIncidentStatus = incidentStatusParam;
            if ((incidentStatus.equals(INCIDENT_STATUS_SUBMITTED) && (!newIncidentStatus.equals(INCIDENT_STATUS_FAKE) && !newIncidentStatus.equals(INCIDENT_STATUS_RUNNING))) ||
                    (incidentStatus.equals(INCIDENT_STATUS_RUNNING) && !newIncidentStatus.equals(INCIDENT_STATUS_FINISHED))
            )
                return ErrorResponse(response, 403, "Error: Changing incident status " + incidentStatus + " to " + newIncidentStatus + " is illegal.");

            eit.updateIncident(incidentIdParam, Map.of("status", newIncidentStatus));
            if (newIncidentStatus.equals(INCIDENT_STATUS_FINISHED)) {
                incident.setEnd_datetime();
                eit.updateIncident(incidentIdParam, Map.of("end_datetime", incident.getEnd_datetime()));
            }

            return MessageResponse("Incident status successfully updated to " + newIncidentStatus + ".");
        });

        put(API_PATH + "incidentFieldValue/:incident_id", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String incidentIdParam = request.params(":incident_id");

            int incidentId;
            try {
                incidentId = Integer.parseInt(incidentIdParam);
            } catch (NumberFormatException e) {
                return ErrorResponse(response, 406, "Error: Incident Id provided is not a valid Id.");
            }

            EditIncidentsTable eit = new EditIncidentsTable();
            List<Incident> incidentList = eit.databaseToIncidents();
            Incident incident = incidentList.stream().filter(inc -> inc.getIncident_id() == incidentId).findFirst().orElse(null);

            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            JSONObject body = new JSONObject(request.body());
            String field = body.getString("field");
            String value = body.getString("value");
            eit.updateIncident(incidentIdParam, Map.of(field, value));

            return MessageResponse("Updated " + field + " to \"" + value + "\" of incident " + incidentId + ".");
        });

        put(API_PATH + "/participantAccept/:participant_id/:volunteer_username", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String participantIdParam = request.params(":participant_id");
            String volunteerUsernameParam = request.params(":volunteer_username");

            if (participantIdParam == null || volunteerUsernameParam == null)
                return ErrorResponse(response, 406, "Error: Participant Id or volunteer username not provided.");

            int participantId;
            try {
                participantId = Integer.parseInt(participantIdParam);
            } catch (NumberFormatException e) {
                return ErrorResponse(response, 406, "Error: Participant Id provided is not a valid Id.");
            }

            EditParticipantsTable ept = new EditParticipantsTable();
            Participant participant = ept.databaseToParticipant(participantId);
            if (participant == null)
                return ErrorResponse(response, 404, "Error: Participant not found.");

            EditVolunteersTable evt = new EditVolunteersTable();
            List<Volunteer> volunteersList = evt.getVolunteers("all");
            Volunteer volunteer = volunteersList.stream().filter(inc -> inc.getUsername().equals(volunteerUsernameParam)).findFirst().orElse(null);
            if (volunteer == null)
                return ErrorResponse(response, 404, "Error: Volunteer not found.");
            ept.acceptParticipant(participantId, volunteerUsernameParam);

            EditIncidentsTable eit = new EditIncidentsTable();
            Incident incident = eit.databaseToIncident(participant.getIncident_id());
            String volunteerType = volunteer.getVolunteer_type();
            String incidentVolunteerType = volunteerType.equals(VOLUNTEER_TYPE_SIMPLE) ? "firemen" : "vehicles";
            int newIncidentVolunteerTypeValue = volunteerType.equals(VOLUNTEER_TYPE_SIMPLE) ? incident.getFiremen() + 1 : incident.getVehicles() + 1;
            eit.updateIncident(String.valueOf(participant.getIncident_id()), Map.of(incidentVolunteerType, String.valueOf(newIncidentVolunteerTypeValue)));

            return MessageResponse("Accepted participant " + participantId + "(" + volunteerUsernameParam + ").");
        });

        put(API_PATH + "/participantRelease/:participant_id/:success", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String participantIdParam = request.params(":participant_id");
            String successParam = request.params(":success");
            String commentParam = request.raw().getParameter("municipality") == null ? "all" : request.raw().getParameter("municipality");

            if (participantIdParam == null || successParam == null)
                return ErrorResponse(response, 406, "Error: Participant Id or volunteer username not provided.");

            int participantId;
            try {
                participantId = Integer.parseInt(participantIdParam);
            } catch (NumberFormatException e) {
                return ErrorResponse(response, 406, "Error: Participant Id provided is not a valid Id.");
            }

            EditParticipantsTable ept = new EditParticipantsTable();
            Participant participant = ept.databaseToParticipant(participantId);
            if (participant == null)
                return ErrorResponse(response, 404, "Error: Participant not found.");

            if (!isInTable(successParam, PARTICIPANT_SUCCESSOUTCOMES))
                return ErrorResponse(response, 404, "Error: Invalid success outcome provided.");
            ept.finalStatusParticipant(participantId, successParam, commentParam);

            return MessageResponse("Released participant " + participantId + " with " + successParam + " outcome with comment \"" + commentParam + "\".");
        });
    }
}
