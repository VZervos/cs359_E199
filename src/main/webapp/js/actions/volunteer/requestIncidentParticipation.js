import {getVolunteersList} from "../../ajax/ajaxLists.js";
import {createParticipant} from "../../ajax/ajaxParticipant.js";
import {reloadIncidents} from "./loadVolunteerIncidents.js";

let loadIncidentsButton;
let incidentsList;

$(document).ready(function () {
    $(document).on('click', '.request_participation-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[1];
        const getVolunteerIdFromEvent = (event) => event.target.id.split('-')[0];

        const incidentId = getIncidentIdFromEvent(event);
        const volunteerId = getVolunteerIdFromEvent(event);

        console.log(incidentId, volunteerId);
        incidentsList = $("#incident-list");
        loadIncidentsButton = $('#load-incidents-button');
        const volunteersList = await getVolunteersList("all");
        const volunteer = volunteersList["data"].find(v => v.volunteer_id == volunteerId);
        console.log(volunteer);
        await createParticipant(incidentId, volunteer.username, volunteer.type);

        const result = await reloadIncidents();
        if (result.success)
            await reloadIncidents();
        $('#' + incidentId + '-message').text(result.message);
    });
});