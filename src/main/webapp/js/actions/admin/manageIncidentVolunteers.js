import {clearHtml} from "../../utility/utility.js";
import {getIncidentsList, getParticipantsList, getVolunteersList} from "../../ajax/ajaxLists.js";

let loadIncidentsButton;
let volunteersList;

export async function reloadIncidents() {
    const createIncidentInfo = (incident) => {
        const changeValueOfField = (field, newValue) => {
            const value = Math.max(0, newValue);
            $(document).on('click', '#' + field, (event) => event.target.value = value)
        }

        const {
            incident_id,
            danger,
            address,
            municipality,
            prefecture,
            country,
            lat,
            lon,
            user_type,
            user_phone,
            vehicles,
            firemen,
            start_datetime,
            finalResult,
            description
        } = incident;

        return `
        <div>
            <div>
                    Danger: 
                    <select class="incident-value-selector" id=${incident_id + "-danger-value"}>
                        <option value="low" ${danger === 'low' ? 'selected' : ''}>low</option>
                        <option value="medium" ${danger === 'medium' ? 'selected' : ''}>medium</option>
                        <option value="high" ${danger === 'high' ? 'selected' : ''}>high</option>
                        <option value="unknown" ${danger === 'unknown' ? 'selected' : ''}>unknown</option>
                    </select>
                    <button class="save-info-button" id=${incident_id + "-change-danger-button"}>Save Changes</button>
                </div>
            <div>Location: ${address}, ${municipality}, ${prefecture}, ${country}</d>
            <div>Lat/Lon: ${lat}, ${lon}</d>
            <div>User: ${user_type} (${user_phone})</d>
            <div>
                Vehicles: 
                <button type="button" class="incrdecr-button decr-button" id=${incident_id + "-vehicles-decrease"}>-</button>
                <span id=${incident_id + "-vehicles-value"}>${vehicles}</span>
                <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-vehicles-increase"}>+</button>
                <button class="save-info-button" id=${incident_id + "-change-vehicles-button"}>Save Changes</button>
            </div>
            <div>
                Firemen: 
                <button type="button" class="incrdecr-button decr-button" id=${incident_id + "-firemen-decrease"}>-</button>
                <span id=${incident_id + "-firemen-value"}>${firemen}</span>
                <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-firemen-increase"}>+</button>
                <button class="save-info-button" id=${incident_id + "-change-firemen-button"}>Save Changes</button>
            </div>
            <div>Started: ${start_datetime}</d>
            <div>Result: ${finalResult}</d>
            <div>
                Description:
                <button class="save-info-button" id=${incident_id + "-change-description-button"}>Save Changes</button>
                <textarea style="width: 100%; height: 10em" class="incident-value-selector" id=${incident_id + "-description-value"}>${description}</textarea>
            </div>
        </div>
    `;
    };

    const createStatusOptions = (incident_id, status) => {
        let statusOptions;
        switch (status) {
            case "submitted":
                statusOptions = `
                <span>
                        <button class="status-option-button" id=${incident_id + "-mark_as-running"}>Mark as Running</button>
                        <button class="status-option-button" id=${incident_id + "-mark_as-fake"}>Mark as Fake</button>
                </span>
            `;
                break;
            case "running":
                statusOptions = `
                <span>
                        <button class="status-option-button" id=${incident_id + "-mark_as-finished"}>Mark as Finished</button>
                </span>
            `;
                break;
            default:
                statusOptions = `<div></div>`;
                break;
        }
        return statusOptions;
    };

    const createSimpleParticipants = (incident) => {
        const {incident_id, status} = incident;

        return `
        <div>
            <div class="row">
                ${createStatusOptions(incident_id, status)}
                <span>
                        <button class="manage_volunteers-option-button" id=${incident_id + "-manage_volunteers"}>Manage volunteers</button>
                </span>
            </div>
        </div>
    `;
    };


    clearHtml(volunteersList);
    loadIncidentsButton.text("Reload incidents")

    const incidents = await getIncidentsList();
    incidents.data.reverse().forEach(incident => {
        const {incident_id, incident_type, status} = incident;
        const component = $(`
            <div class="accordion" id=${"accordion-" + incident_id}>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${incident_id}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${incident_id}" aria-expanded="false" aria-controls="collapse-${incident_id}">
                            ${status}: Incident #${incident_id} (${incident_type})
                        </button>
                    </h2>
                    <div id="collapse-${incident_id}" class="accordion-collapse collapse" aria-labelledby="heading-${incident_id}" data-bs-parent=${"accordion-" + incident_id}>
                        <div class="accordion-body">
                            <div class="section-content list-incidents-admin-item row align-items-center" id="${incident_id}">
                                ${createIncidentInfo(incident)}
                                ${createIncidentOptions(incident)}
                                <p id="${incident_id}-message"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);

        volunteersList.append(component);
    });
}

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
                        <div>Success: ${success}</d>
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
});