import {getVolunteersList} from "../../../ajax/ajaxLists.js";
import {createParticipant} from "../../../ajax/ajaxParticipant.js";
import {reloadUserIncidents} from "../user/loadUserIncidents.js";
import {setResultMessage} from "../../../utility/utility.js";

let loadIncidentsButton;
let incidentsList;

$(document).ready(function () {
    $(document).on('click', '.request_participation-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[1];
        const getVolunteerIdFromEvent = (event) => event.target.id.split('-')[0];

        const incidentId = getIncidentIdFromEvent(event);
        const volunteerId = getVolunteerIdFromEvent(event);
        const isFromNotification = event.target.id.split('-').length > 2;

        console.log(incidentId, volunteerId);
        incidentsList = $("#incident-list");
        loadIncidentsButton = $('#load-incidents-button');
        const volunteersList = await getVolunteersList();
        const volunteer = volunteersList["data"].find(v => v.volunteer_id == volunteerId);
        console.log(volunteer);

        const result = await createParticipant(incidentId, volunteer.username, volunteer.volunteer_type);
        if (result.success && !isFromNotification)
            await reloadUserIncidents();
        isFromNotification ? $('#notification').html(result.message) : setResultMessage(incidentId + '-message', result);
    });
});