import {updateIncidentFieldValue, updateIncidentStatus} from "../ajax/ajax.js";
import {reloadIncidents} from "../actions/loadAdminIncidents.js";

$(document).ready(function () {
    $(document).on('click', '.status-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentNewStatusFromEvent = (event) => event.target.id.split('-')[2];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const incidentNewStatus = getIncidentNewStatusFromEvent(event);

        const result = await updateIncidentStatus(incidentId, incidentNewStatus);
        if (result.success)
            await reloadIncidents();
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId + incidentNewStatus);
    });

    $(document).on('change', '.incident-value-selector', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentFieldFromEvent = (event) => event.target.id.split('-')[1];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const field = getIncidentFieldFromEvent(event)
        const newValue = event.target.value;

        const result = await updateIncidentFieldValue(incidentId, field, newValue);
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId);
        console.log(field);
        console.log(newValue);
    });
});