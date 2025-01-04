import {reloadIncidents} from "./loadAdminIncidents.js";
import {updateIncidentFieldValue, updateIncidentStatus} from "../../ajax/ajaxIncident.js";

$(document).ready(function () {
    const getIncidentFieldNewValue = (incidentId, fieldId) => {
        const field = $('#' + incidentId + '-' + fieldId + '-value');
        return field.val() || field.text();
    }

    $(document).on('click', '.save-info-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentFieldFromEvent = (event) => event.target.id.split('-')[2];

        const incidentId = getIncidentIdFromEvent(event);
        const fieldId = getIncidentFieldFromEvent(event);
        const newValue = getIncidentFieldNewValue(incidentId, fieldId);

        const result = await updateIncidentFieldValue(incidentId, fieldId, newValue);
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId);
        console.log(fieldId);
        console.log(newValue);

    });

    $(document).on('click', '.status-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentNewStatusFromEvent = (event) => event.target.id.split('-')[2];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const incidentNewStatus = getIncidentNewStatusFromEvent(event);
        const incidentResult = getIncidentFieldNewValue(incidentId, "result");
        const incidentVehicles = getIncidentFieldNewValue(incidentId, "vehicles");
        const incidentFiremen = getIncidentFieldNewValue(incidentId, "firemen");
        console.log(incidentResult)
        console.log(incidentVehicles)
        console.log(incidentFiremen)

        const result = await updateIncidentStatus(incidentId, incidentNewStatus, incidentResult, incidentVehicles, incidentFiremen);
        if (result.success)
            await reloadIncidents();
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId + incidentNewStatus);
    });
});