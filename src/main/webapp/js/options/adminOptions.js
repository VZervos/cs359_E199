import {updateIncidentStatus} from "../ajax/ajax.js";
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
});