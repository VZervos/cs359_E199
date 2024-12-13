package services;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import mainClasses.Incident;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.*;
import static utility.Resources.*;

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
    }
}
