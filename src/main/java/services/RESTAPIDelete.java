package services;

import database.tables.EditIncidentsTable;
import mainClasses.Incident;

import static services.StandardResponse.ErrorResponse;
import static services.StandardResponse.MessageResponse;
import static spark.Spark.delete;

public class RESTAPIDelete extends API {
    public static void startDeleteApi() {
        delete(API_PATH + "/incidentDeletion/:incident_id", (request, response) -> {
            initResponse(response);
            String incidentIdParam = getRequestParam(request, "incident_id");

            EditIncidentsTable eit = new EditIncidentsTable();

            Incident incident = eit.getIncidentIfExist(incidentIdParam);
            if (incident == null)
                return ErrorResponse(response, 404, "Error: Incident not found.");

            eit.deleteIncident(incidentIdParam);
            return MessageResponse("Incident was successfully deleted.");
        });
    }
}
