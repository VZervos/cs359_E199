import {getIncidentsList} from "../../../ajax/ajaxLists.js";
import {reloadIncidents, shareIncident} from "../../managers/incidentManager.js";


let loadIncidentsButton;
let incidentsListDiv;

const createIncidentInfo = (incident) => {
    const {
        incident_id,
        danger,
        address,
        municipality,
        prefecture,
        lat,
        lon,
        user_type,
        user_phone,
        vehicles,
        firemen,
        start_datetime,
        finalResult,
        description,
        status
    } = incident;

    const shareButtons = status === "running" ? `
        <button id=${incident_id + "-share-facebook"} class="share-button fa fa-facebook social-icon"></button>
        <button id=${incident_id + "-share-twitter"} class="share-button fa fa-twitter social-icon"></button>
        ` : "";

    return `
        <div>
            <div>Danger: ${danger} </div>
            <div>Location: <span id=${incident_id + "-location"}>${address}, ${municipality}</span>, ${prefecture}, Greece</div>
            <div>Lat/Lon: ${lat}, ${lon}</div>
            <div>User: ${user_type} (${user_phone})</div>
            <div>Vehicles: ${vehicles} </div>
            <div>Firemen:  ${firemen} </div>
            <div>Started: ${start_datetime}</div>
            <div>Result: ${finalResult}</div>
            <div>
                Description:
                <textarea readonly style="width: 100%; height: 10em" class="incident-value-selector" id=${incident_id + "-description-value"}>${description}</textarea>
            </div>
            <button class="map-toggle-button" id=${incident_id + "-showAddressOnMap"} type="button">Show map</button>
            <p class="errorMessage" id=${incident_id + "-address_error"}></p>
            <p id=${incident_id + "-address_availability"}></p>
            <div id=${incident_id + "-map"}></div>
            ${shareButtons}
        </div>
    `;
};

export async function reloadUserIncidents() {
    loadIncidentsButton.text("Reload incidents");
    const incidentsList = await getIncidentsList();
    const incidents = incidentsList.data.filter(incident => incident.status === "running").reverse()
    await reloadIncidents(incidents, incidentsListDiv, createIncidentInfo);
}

$(document).ready(function () {
    loadIncidentsButton = $('#load-incidents-button');
    incidentsListDiv = $('#incident-list');

    loadIncidentsButton.on('click', async function () {
        await reloadUserIncidents();
    });

    $(document).on('click', '.share-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getPlatformIdFromEvent = (event) => event.target.id.split('-')[2];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const platformId = getPlatformIdFromEvent(event);
        await shareIncident(incidentId, platformId);
    });
});