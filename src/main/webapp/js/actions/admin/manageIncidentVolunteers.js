import {updateIncidentFieldValue} from "../../ajax/ajax.js";
import {clearHtml} from "../../utility/utility.js";
import {increaseValue, decreaseValue} from "../../utility_actions/increaseDecreaseValue.js";

import {getIncidentsList} from "../../ajax/lists";

let loadIncidentsButton;
let incidentsList;

export async function reloadIncidents() {
    const createIncidentInfo = (incident) => {
        const changeValueOfField = (field, newValue) => {
            const value = Math.max(0, newValue);
            $(document).on('click', '#' + field, (event) => event.target.value  = value)
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

    const createIncidentOptions = (incident) => {
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


    clearHtml(incidentsList);
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

        incidentsList.append(component);
    });
}

$(document).ready(function () {
    loadIncidentsButton = $('#load-incidents-button');
    incidentsList = $('#incident-list');

    $('.manage_volunteers-options-button').on('click', async function () {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];

        const incidentId = getIncidentIdFromEvent(event);

        const incident = await getIncidentsList().then(incidents => incidents.filter(incident.incident_id === incidentId));
        const volunteers = await getVolunteersList();


        const result = await updateIncidentFieldValue(incidentId, fieldId, newValue);
        $('#' + incidentId + '-message').text(result.message);
    });
});