package services;

import database.tables.EditIncidentsTable;
import database.tables.EditParticipantsTable;
import database.tables.EditVolunteersTable;
import mainClasses.Incident;
import mainClasses.Participant;
import mainClasses.Volunteer;
import utility.Utility;

import java.util.List;

import static services.StandardResponse.DataResponseAsJson;
import static services.StandardResponse.ErrorResponse;
import static spark.Spark.get;
import static utility.Resources.INCIDENT_STATUSES;
import static utility.Resources.VOLUNTEER_TYPES;

public class RESTAPIGet {
    static final String API_PATH = "E199API/";

    public static void startGetApi() {
        get(API_PATH + "/incidents/:type/:status", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String incidentTypeParam = request.params(":type") == null ? "all" : request.params(":type");
            String incidentStatusParam = request.params(":status") == null ? "all" : request.params(":status");
            String municipalityParam = request.raw().getParameter("municipality") == null ? "all" : request.raw().getParameter("municipality");

            if (incidentTypeParam == null || incidentStatusParam == null)
                return ErrorResponse(response, 406, "Error: Incident type or status not provided.");

            if (!incidentStatusParam.equals("all") && !Utility.isInTable(incidentStatusParam, INCIDENT_STATUSES))
                return ErrorResponse(response, 406, "Error: Invalid incident status provided.");

            EditIncidentsTable eit = new EditIncidentsTable();
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

            EditParticipantsTable ept = new EditParticipantsTable();
            StringBuilder participantsJson = new StringBuilder("[");
            List<Participant> participantList = participantList = ept.getParticipants(incidentIdParam);
            for (Participant volunteer : participantList) {
                participantsJson.append(ept.participantToJSON(volunteer)).append(',');
            }
            if (participantsJson.length() > 2)
                participantsJson.deleteCharAt(participantsJson.length() - 1);
            participantsJson.append("]");

            return DataResponseAsJson(participantsJson.toString());
        });

        get(API_PATH + "/volunteers/:type", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String volunteerTypeParam = request.params(":type") == null ? "all" : request.params(":type");

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
    }
}
