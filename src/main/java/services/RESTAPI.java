package services;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import mainClasses.Incident;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.*;
import static spark.Spark.*;
import static utility.Resources.*;

public class RESTAPI {
    static final String API_PATH = "E199API/";

    public static void main(String[] args) {
        post(API_PATH + "/incident", (request, response) -> {
            response.status(200);
            response.type("application/json");
            System.out.println(request.body());
            Incident incident = new Gson().fromJson(request.body(), Incident.class);

            if (incident.getIncident_type() == null ||
                    incident.getDescription() == null ||
                    incident.getUser_type() == null ||
                    incident.getUser_phone() == null ||
                    incident.getAddress() == null) {
                return ErrorResponse(response, 406, "Error: Not all mandatory fields contain information.");
            }

            String user_phone = incident.getUser_phone();
            if (user_phone != null && (user_phone.length() < MIN_PHONE_LENGTH || user_phone.length() > MAX_PHONE_LENGTH))
                return ErrorResponse(response, 406, "Error: Invalid user phone provided.");

            String user_type = incident.getUser_type();
            if (user_type != null && (!user_type.equals(USERTYPE_ADMIN) && !user_type.equals(USERTYPE_GUEST) && !user_type.equals(USERTYPE_USER)))
                return ErrorResponse(response, 406, "Error: Invalid user type provided.");

            String incident_type = incident.getIncident_type();
            if (incident_type != null && (!incident_type.equals(INCIDENTTYPE_FIRE) && !incident_type.equals(INCIDENTTYPE_ACCIDENT)))
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

        get(API_PATH + "/incidents/:type/:status", (request, response) -> {
            response.status(200);
            response.type("application/json");

            String incidentTypeParam = request.params(":type") == null ? "all" : request.params(":type");
            String incidentStatusParam = request.params(":status") == null ? "all" : request.params(":status");
            String municipalityParam = request.raw().getParameter("municipality") == null ? "all" : request.raw().getParameter("municipality");

            if (incidentTypeParam == null || incidentStatusParam == null)
                return ErrorResponse(response, 406, "Error: Incident type or status not provided.");

            if (!incidentStatusParam.equals("all") && Arrays.stream(INCIDENT_STATUSES).noneMatch(inc -> inc.equals(incidentStatusParam)))
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
