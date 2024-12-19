package services;

import database.tables.EditIncidentsTable;
import database.tables.EditParticipantsTable;
import database.tables.EditVolunteersTable;
import mainClasses.Incident;
import mainClasses.Participant;
import mainClasses.Volunteer;
import org.json.JSONObject;
import spark.Response;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.put;
import static utility.Resources.*;
import static utility.Utility.getBodyString;
import static utility.Utility.isInTable;

public class RESTAPIPut extends API {
    public static void startPutApi() {
        put(API_PATH + "incidentStatus/:incident_id/:status", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");
            String incidentStatusParam = getRequestParam(request, "status");
            //JSONObject body = getBody(request);
            String requestBody = request.body(); // Get the raw body
            JSONObject body = new JSONObject(requestBody); // Parse into a JSONObject

            // Extract the "result" field from the JSON body
            String incidentResultParam = body.getString("result");
            EditIncidentsTable eit = new EditIncidentsTable();

            if (Arrays.stream(INCIDENT_STATUSES).noneMatch(status -> status.equals(incidentStatusParam)))
                return ErrorResponse(response, 406, "Error: Invalid incident status provided.");

            Incident incident = eit.getIncidentIfExist(incidentIdParam);
            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            String incidentStatus = incident.getStatus();
            if ((incidentStatus.equals(INCIDENT_STATUS_SUBMITTED) && (!incidentStatusParam.equals(INCIDENT_STATUS_FAKE) && !incidentStatusParam.equals(INCIDENT_STATUS_RUNNING))) ||
                    (incidentStatus.equals(INCIDENT_STATUS_RUNNING) && !incidentStatusParam.equals(INCIDENT_STATUS_FINISHED))
            )
                return ErrorResponse(response, 403, "Error: Changing incident status " + incidentStatus + " to " + incidentStatusParam + " is illegal.");

            eit.updateIncident(incidentIdParam, Map.of("status", incidentStatusParam));
            if (incidentStatusParam.equals(INCIDENT_STATUS_FINISHED)) {
                incident.setEnd_datetime();
                eit.updateIncident(incidentIdParam,
                        Map.of(
                                "end_datetime", incident.getEnd_datetime(),
                                "finalResult", incidentResultParam
                        )
                );
            }

            return MessageResponse("Incident status successfully updated to " + incidentStatusParam + ".");
        });

        put(API_PATH + "incidentFieldValue/:incident_id", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");
            JSONObject body = getBody(request);
            String field = body.getString("field");
            String value = body.getString("value");

            EditIncidentsTable eit = new EditIncidentsTable();
            Incident incident = eit.getIncidentIfExist(incidentIdParam);
            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            eit.updateIncident(incidentIdParam, Map.of(field, value));
            return MessageResponse("Updated " + field + " to \"" + value + "\" of incident " + incidentIdParam + ".");
        });

        put(API_PATH + "/participantAccept/:participant_id/:volunteer_username", (request, response) -> {
            initResponse(response);
            String participantIdParam = getRequestParam(request, "participant_id");
            String volunteerUsernameParam = getRequestParam(request, "volunteer_username");

            Validator validator = new Validator();
            EditParticipantsTable ept = new EditParticipantsTable();

            if (validator.hasNullItems(new String[]{participantIdParam, volunteerUsernameParam}))
                return ErrorResponse(response, 406, "Error: Participant Id or volunteer username not provided.");

            Participant participant = ept.getParticipantIfExist(participantIdParam);
            if (participant == null)
                return ErrorResponse(response, 404, "Error: Participant not found.");

            EditVolunteersTable evt = new EditVolunteersTable();
            List<Volunteer> volunteersList = evt.getVolunteers();
            Volunteer volunteer = volunteersList.stream().filter(inc -> inc.getUsername().equals(volunteerUsernameParam)).findFirst().orElse(null);
            if (volunteer == null)
                return ErrorResponse(response, 404, "Error: Volunteer not found.");

            ept.acceptParticipant(Integer.parseInt(participantIdParam), volunteerUsernameParam);

            EditIncidentsTable eit = new EditIncidentsTable();
            Incident incident = eit.databaseToIncident(participant.getIncident_id());
            String volunteerType = volunteer.getVolunteer_type();
            String incidentVolunteerType = volunteerType.equals(VOLUNTEER_TYPE_SIMPLE) ? "firemen" : "vehicles";
            int newIncidentVolunteerTypeValue = volunteerType.equals(VOLUNTEER_TYPE_SIMPLE) ? incident.getFiremen() + 1 : incident.getVehicles() + 1;
            eit.updateIncident(String.valueOf(participant.getIncident_id()), Map.of(incidentVolunteerType, String.valueOf(newIncidentVolunteerTypeValue)));
            return MessageResponse("Accepted participant " + participantIdParam + "(" + volunteerUsernameParam + ").");
        });

        put(API_PATH + "/participantRelease/:participant_id/:success", (request, response) -> {
            initResponse(response);
            String participantIdParam = getRequestParam(request, "participant_id");
            String successParam = getRequestParam(request, "success");
            JSONObject body = getBody(request);
            String commentParam = body.getString("comment");

            Validator validator = new Validator();
            EditParticipantsTable ept = new EditParticipantsTable();

            if (validator.hasNullItems(new String[]{participantIdParam, successParam}))
                return ErrorResponse(response, 406, "Error: Participant Id or success value not provided.");

            if (!isInTable(successParam, PARTICIPANT_SUCCESSOUTCOMES))
                return ErrorResponse(response, 404, "Error: Invalid success outcome provided.");

            Participant participant = ept.getParticipantIfExist(participantIdParam);
            if (participant == null)
                return ErrorResponse(response, 404, "Error: Participant not found.");

            ept.finalStatusParticipant(Integer.parseInt(participantIdParam), successParam, commentParam);
            return MessageResponse("Released participant " + participantIdParam + " with " + successParam + " outcome with comment \"" + commentParam + "\".");
        });
    }
}
