import {getIncidentsList} from "../ajax/ajax.js";
import {clearHtml} from "../utility/utility.js";

let loadIncidentsButton;
let incidentsList;

export async function reloadIncidents() {
    const createIncidentInfo = (incident) => {
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
                </div>
            <div>Location: ${address}, ${municipality}, ${prefecture}, ${country}</d>
            <div>Lat/Lon: ${lat}, ${lon}</d>
            <div>User: ${user_type} (${user_phone})</d>
            <div>Vehicles/Firemen: ${vehicles}/${firemen}</d>
            <div>Started: ${start_datetime}</d>
            <div>Result: ${finalResult}</d>
                        <div>
                    Description: 
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

    loadIncidentsButton.on('click', async function () {
        await reloadIncidents();
    });
});