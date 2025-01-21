package services;

import database.tables.EditIncidentsTable;
import database.tables.EditParticipantsTable;
import database.tables.EditVolunteersTable;
import mainClasses.Incident;
import mainClasses.Participant;
import mainClasses.Volunteer;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.put;
import static utility.Resources.*;
import static utility.Utility.isInTable;

public class RESTAPIPut extends API {
    public static void startPutApi() {
        put(API_PATH + "incidentStatus/:incident_id/:status", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");
            String incidentStatusParam = getRequestParam(request, "status");
            //JSONObject body = getBody(request);
            String requestBody = request.body();
            JSONObject body = new JSONObject(requestBody);

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
                String incidentResultParam = body.getString("result");
                incident.setEnd_datetime();
                eit.updateIncident(incidentIdParam,
                        Map.of(
                                "end_datetime", incident.getEnd_datetime(),
                                "finalResult", incidentResultParam
                        )
                );
            } else if (incidentStatusParam.equals(INCIDENT_STATUS_RUNNING)) {
                String firemen = body.getString("firemen");
                if (!firemen.isBlank()) eit.updateIncident(incidentIdParam,
                        Map.of(
                                "firemen", body.getString("firemen")
                        )
                );
                String vehicles = body.getString("vehicles");
                if (!vehicles.isBlank()) eit.updateIncident(incidentIdParam,
                        Map.of(
                                "vehicles", body.getString("vehicles")
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

        put(API_PATH + "/participantAccept/:participant_id/:incident_id", (request, response) -> {
            initResponse(response);
            String participantIdParam = getRequestParam(request, "participant_id");
            String incidentIdParam = getRequestParam(request, "incident_id");

            Validator validator = new Validator();
            EditParticipantsTable ept = new EditParticipantsTable();
            EditVolunteersTable evt = new EditVolunteersTable();

            if (validator.hasNullItems(new String[]{participantIdParam, incidentIdParam}))
                return ErrorResponse(response, 406, "Error: Participant Id or incident Id not provided.");

            Participant participant = ept.getParticipantIfExist(participantIdParam);
            if (participant == null)
                return ErrorResponse(response, 404, "Error: Participant not found.");

            List<Volunteer> volunteersList = evt.getVolunteers();
            Volunteer volunteer = volunteersList.stream().filter(inc -> inc.getUsername().equals(participant.getVolunteer_username())).findFirst().orElse(null);
            if (volunteer == null)
                return ErrorResponse(response, 404, "Error: Volunteer not found.");

            ept.acceptParticipant(Integer.parseInt(participantIdParam), volunteer.getUsername());

            EditIncidentsTable eit = new EditIncidentsTable();
            Incident incident = eit.databaseToIncident(participant.getIncident_id());
            String volunteerType = volunteer.getVolunteer_type();
            List<Participant> participantList = ept.getParticipants(String.valueOf(incident.getIncident_id()));
            int activeTypeParticipants = Math.toIntExact(participantList.stream()
                    .filter(
                            p -> p.getIncident_id() == incident.getIncident_id()
                                    && p.getVolunteer_type().equals(volunteer.getVolunteer_type())
                                    && !p.getStatus().equals(PARTICIPANT_STATUS_REQUESTED)
                    ).count());
            if (volunteerType.equals(VOLUNTEER_TYPE_SIMPLE) && activeTypeParticipants > incident.getFiremen()) {
                eit.updateIncident(incidentIdParam,
                        Map.of(
                                "firemen", String.valueOf(incident.getFiremen() + 1)
                        )
                );
            } else if (volunteerType.equals(VOLUNTEER_TYPE_DRIVER) && activeTypeParticipants > incident.getVehicles())
                eit.updateIncident(incidentIdParam,
                        Map.of(
                                "vehicles", String.valueOf(incident.getVehicles() + 1)
                        )
                );
            return MessageResponse("Accepted participant " + participantIdParam + "(" + volunteer.getUsername() + ").");
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
