import {updateIncidentFieldValue, updateIncidentStatus} from "../ajax/ajax.js";
import {reloadIncidents} from "../actions/loadAdminIncidents.js";

$(document).ready(function () {
    console.log("options listener loaded");

    $(document).on('click', '.status-option-button', async function (event) {
        const getIncidentIdFromButton = (button) => {
            return button.id.split('-')[0];
        }

        const getIncidentNewStatusFromButton = (button) => {
            return button.id.split('-')[2];
        }

        console.log(event);
        const incidentId = getIncidentIdFromButton(event.target);
        const incidentNewStatus = getIncidentNewStatusFromButton(event.target);

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