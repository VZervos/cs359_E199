import {getIncidentsList} from "../ajax/ajaxLists.js";
import {reloadIncidents} from "../actions/managers/incidentManager.js";

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
        end_datetime,
        finalResult,
        description,
    } = incident;

    return `
        <div>
            <div>Danger: ${danger} </div>
            <div>Location: <span id=${incident_id + "-location"}>${address}, ${municipality}</span>, ${prefecture}, Greece</div>
            <div>Lat/Lon: ${lat}, ${lon}</div>
            <div>User: ${user_type} (${user_phone})</div>
            <div>Vehicles: ${vehicles} </div>
            <div>Firemen:  ${firemen} </div>
            <div>Started: ${start_datetime}</div>
            <div>Ended: ${end_datetime}</div>
            <div>Result: ${finalResult}</div>
            <div>
                Description:
                <textarea readonly style="width: 100%; height: 10em" class="incident-value-selector" id=${incident_id + "-description-value"}>${description}</textarea>
            </div>
            <button class="map-toggle-button" id=${incident_id + "-showAddressOnMap"} type="button">Show map</button>
            <p class="errorMessage" id=${incident_id + "-address_error"}></p>
            <p id=${incident_id + "-address_availability"}></p>
            <div id=${incident_id + "-map"}></div>
        </div>
    `;
};

export async function reloadUserIncidents() {
    loadIncidentsButton.text("Reload incidents");
    const incidentsList = await getIncidentsList();
    const formData = new FormData(document.getElementById("filtersForm"));
    const filters = Object.fromEntries(formData.entries());

    const incidents = incidentsList.data
        .filter(incident => incident.status === "finished")
        .filter(incident => {
            for (const [key, value] of Object.entries(filters)) {
                const incidentValue = incident[key];
                if (value && key.includes("datetime") && incidentValue.split(' ')[0] != value)
                    return false
                else if (value && !key.includes("datetime") && incidentValue != value)
                    return false
            }
            return true;
        })
        .reverse();
    await reloadIncidents(incidents, incidentsListDiv, createIncidentInfo);
}

$(document).ready(function () {
    loadIncidentsButton = $('#load-incidents-button');
    incidentsListDiv = $('#incident-list');

    loadIncidentsButton.on('click', async function () {
        await reloadUserIncidents();
    });
});