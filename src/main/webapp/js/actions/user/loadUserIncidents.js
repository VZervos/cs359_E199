import {getIncidentsList} from "../../ajax/ajaxLists.js";
import {reloadIncidents} from "../loadIncidents.js";

let loadIncidentsButton;
let incidentsListDiv;

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
});