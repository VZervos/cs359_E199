import {reloadIncidents} from "./loadAdminIncidents.js";
import {getVolunteersList} from "../../ajax/ajaxLists.js";
import {acceptParticipant, releaseParticipant} from "../../ajax/ajaxParticipant.js";
import {reloadVolunteerRequests} from "./manageIncidentVolunteers.js";
import {updateIncidentStatus} from "../../ajax/ajaxIncident.js";

$(document).ready(function () {
    $(document).on('click', '.participant_status-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getParticipantIdFromEvent = (event) => event.target.id.split('-')[1];
        const getVolunteerIdFromEvent = (event) => event.target.id.split('-')[2];
        const getNewParticipantStatusFromEvent = (event) => event.target.id.split('-')[4];

        const incidentId = getIncidentIdFromEvent(event);
        const participantId = getParticipantIdFromEvent(event);
        const volunteerId = getVolunteerIdFromEvent(event);
        const newParticipantStatus = getNewParticipantStatusFromEvent(event);

        const volunteersList = await getVolunteersList("all");
        const volunteer = volunteersList["data"].find(v => v.volunteer_id == volunteerId);
        console.log(incidentId);
        console.log(participantId);
        console.log(newParticipantStatus);
        console.log(volunteersList);
        console.log(volunteer);
        console.log(volunteerId)

        let result;
        if (newParticipantStatus === "accepted")
            result = await acceptParticipant(participantId, incidentId);
        else {
            const success = $('#' + incidentId + "-" + participantId + "-success-value").val();
            const comment = $('#' + incidentId + "-" + participantId + "-comment-value").val();
            console.log(success, comment);
            result = await releaseParticipant(participantId, success, comment);
        }

        await reloadVolunteerRequests(incidentId);
        $('#' + incidentId + '_vol-message').text(result.message);

        console.log(incidentId);
        console.log(participantId);
        console.log(volunteerId);

    });

    $(document).on('click', '.status-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentNewStatusFromEvent = (event) => event.target.id.split('-')[2];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const incidentNewStatus = getIncidentNewStatusFromEvent(event);

        const incidentResult = $('#' + incidentId + "-result-value").text();

        const result = await updateIncidentStatus(incidentId, incidentNewStatus, incidentResult);
        if (result.success)
            await reloadIncidents();
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId + incidentNewStatus);
    });
});