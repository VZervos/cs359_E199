import {reloadIncidents} from "./loadAdminIncidents.js";
import {updateIncidentFieldValue, updateIncidentStatus} from "../../ajax/ajaxIncident.js";

$(document).ready(function () {
    $(document).on('click', '.save-info-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentFieldFromEvent = (event) => event.target.id.split('-')[2];
        const getIncidentFieldNewValue = (incidentId, fieldId) => {
            const field = $('#' + incidentId + '-' + fieldId + '-value');
            return field.val() || field.text();
        }

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
        const incidentResult = $('#' + incidentId + "-result-value").val();
        console.log(incidentResult)

        const result = await updateIncidentStatus(incidentId, incidentNewStatus, incidentResult);
        if (result.success)
            await reloadIncidents();
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId + incidentNewStatus);
    });
});