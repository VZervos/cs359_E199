package services;

import database.tables.EditIncidentsTable;
import mainClasses.Incident;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.delete;
import static spark.Spark.put;
import static utility.Resources.*;

public class RESTAPIDelete {
    static final String API_PATH = "E199API/";

    public static void startDeleteApi() {
        delete(API_PATH + "/incidentDeletion/:incident_id", (request, response) -> {
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

            eit.deleteIncident(String.valueOf(incidentId));

            return MessageResponse("Incident was successfully deleted.");
        });
    }
}
