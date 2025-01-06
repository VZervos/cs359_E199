import {clearHtml} from "../../../utility/utility.js";
import {getIncidentsList, getParticipantsList, getVolunteersList} from "../../../ajax/ajaxLists.js";
import {acceptParticipant, releaseParticipant} from "../../../ajax/ajaxParticipant.js";
import {updateIncidentStatus} from "../../../ajax/ajaxIncident.js";
import {reloadAdminIncidents} from "./loadAdminIncidents.js";

let volunteersList;

async function createParticipants(incidentId) {
    const createParticipantComponents = (participant) => {
        const {participant_id, incident_id, volunteer_username, volunteer_type, status, success, comment} = participant;
        const volunteer = volunteers["data"].find(v => v.username === volunteer_username);
        console.log(volunteer);
        const {
            volunteer_id,
            email,
            firstname,
            lastname,
            birthdate,
            gender,
            country,
            prefecture,
            municipality,
            address,
            telephone,
            height,
            weight
        } = volunteer;

        const participantInfo = `
            <div>
                <div>Volunteer: ${lastname} ${firstname} (${volunteer_username})</div>
                <div>Type: ${volunteer_type}</div>
                <div>Email: ${email}</div>
                <div>Telephone: ${telephone}</div>
                <div>Full address: ${address}, ${municipality}, ${prefecture}, ${country}</div>
                <div>Gender: ${gender}</div>
                <div>Height/Weight: ${height}cm/${weight}kg</div>
                <div>Birthdate: ${birthdate}</div>
                <div>Status: ${status}</div>
            </div>
        `;

        console.log(status);
        let statusButton = "";
        let finishInfo = "";
        switch (status) {
            case "requested":
                statusButton = `
                    <span>
                        <button class="participant_status-option-button" id=${incident_id + "-" + participant_id + "-" + volunteer_id + "-mark_as-accepted"}>Accept volunteer</button>
                    <span>
                `;
                break;
            case "accepted":
                console.log(incidents);
                const incident = incidents["data"].find(inc => inc.incident_id == incidentId);
                statusButton = `
                    <span>
                        <button class="participant_status-option-button" id=${incident_id + "-" + participant_id + "-" + volunteer_id + "-mark_as-finished"}>Release volunteer</button>
                    <span>
                `;
                finishInfo = `
                    <span>
                        <div>
                            Success: 
                            <select class="participant-success-selector" id=${incident_id + "-" + participant_id + "-success-value"}>
                                <option value="yes" ${success === 'yes' ? 'selected' : ''}>yes</option>
                                <option value="no" ${success === 'no' ? 'selected' : ''}>no</option>
                            </select>
                        </div>
                        <div>
                            Comment:
                            <textarea style="width: 100%; height: 5em" class="incident-value-selector" id=${incident_id + "-" + participant_id + "-comment-value"}>${comment}</textarea>
                        </div>
                    <span>
                `;
                console.log(incident);
                $("#" + incident_id + "-firemen-value").text(incident.firemen)
                $("#" + incident_id + "-vehicles-value").text(incident.vehicles)
                break;
            case "finished":
                finishInfo = `
                    <span>
                        <div>Success: ${success}</div>
                        <div>
                            Comment:
                            <textarea readonly style="width: 100%; height: 5em" class="incident-value-selector" id=${incident_id + "-" + participant_id + "-comment-value"}>${comment}</textarea>
                        </div>
                    <span>
                `;
        }
        return {participantInfo, statusButton, finishInfo};
    }

    let simpleParticipants = $(`
        <div> 
    `);

    const participants = await getParticipantsList(incidentId);
    const volunteers = await getVolunteersList();
    const incidents = await getIncidentsList();
    console.log(participants);
    participants.data.forEach(participant => {
        const {participantInfo, statusButton, finishInfo} = createParticipantComponents(participant);
        if (participantInfo || finishInfo || statusButton)
            simpleParticipants.append($(`
                <div class="section-content"> 
                    ${participantInfo}
                    ${finishInfo}
                    ${statusButton}
                </div>
        `));
    });

    simpleParticipants.append($(`
        </div>
    `));
    return simpleParticipants;
}

export async function reloadVolunteerRequests(incidentId) {
    volunteersList = $("#" + incidentId + "-volunteers-list");
    clearHtml(volunteersList);
    console.log(incidentId);
    console.log(volunteersList);

    const participantsComponent = await createParticipants(incidentId);
    let component = $(`<div> No volunteer requests where found </div>`);
    if (participantsComponent.children().length > 0)
        component = $(`
            <div class="accordion" id=${"accordion-volunteers-" + incidentId}>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-vol-${incidentId}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-vol-${incidentId}" aria-expanded="false" aria-controls="collapse-vol-${incidentId}">
                            Incident volunteers
                        </button>
                    </h2>
                    <div id="collapse-vol-${incidentId}" class="accordion-collapse collapse" aria-labelledby="heading-vol-${incidentId}" data-bs-parent=${"accordion-volunteers-" + incidentId}>
                        <div class="accordion-body">
                            <div class="list-incident_volunteers-admin-item row align-items-center" id="vol-${incidentId}">
                                ${participantsComponent.prop("outerHTML")}
                                <p id="${incidentId}_vol-message"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);

    volunteersList.append(component);

    console.log(volunteersList);
    $('#' + incidentId + "-manage_volunteers").text("Reload volunteers");
}

$(document).ready(function () {
    $(document).on('click', '.manage_volunteers-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];

        const incidentId = getIncidentIdFromEvent(event);
        await reloadVolunteerRequests(incidentId);
    });

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
            await reloadAdminIncidents();
        $('#' + incidentId + '-message').text(result.message);

        console.log(incidentId + incidentNewStatus);
    });
});