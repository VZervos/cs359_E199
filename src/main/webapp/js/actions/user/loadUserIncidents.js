import {clearHtml} from "../../utility/utility.js";
import {getIncidentsList, getParticipantsList} from "../../ajax/ajaxLists.js";
import {getSession} from "../../session/getSession.js";

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
            <div>Danger: ${danger} </div>
            <div>Location: ${address}, ${municipality}, ${prefecture}, ${country}</d>
            <div>Lat/Lon: ${lat}, ${lon}</d>
            <div>User: ${user_type} (${user_phone})</d>
            <div>Vehicles: ${vehicles} </div>
            <div>Firemen:  ${firemen} </div>
            <div>Started: ${start_datetime}</d>
            <div>Result: ${finalResult}</d>
            <div>
                Description:
                <textarea readonly style="width: 100%; height: 10em" class="incident-value-selector" id=${incident_id + "-description-value"}>${description}</textarea>
            </div>
        </div>
    `;
    };

    clearHtml(incidentsList);
    loadIncidentsButton.text("Reload incidents")

    const incidents = await getIncidentsList();

    incidents.data
        .filter(incident => incident.status === "running")
        .reverse()
        .forEach(incident => {
            const {incident_id, incident_type, status} = incident;
            console.log(incident);
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
                                    <p id="${incident_id}-message"></p>
                                    <div class="container" id="${incident_id}-users-list"></div>
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