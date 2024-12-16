package services;

import database.tables.EditIncidentsTable;
import database.tables.EditParticipantsTable;
import database.tables.EditVolunteersTable;
import mainClasses.Incident;
import mainClasses.Participant;
import mainClasses.Volunteer;
import utility.Utility;

import java.util.List;
import java.util.Objects;

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
    }
}
