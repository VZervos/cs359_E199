import {getIncidentsList} from "../ajax/ajax.js";
import {clearHtml} from "../utility/utility.js";

let loadIncidentsButton;
let incidentsList;

export async function reloadIncidents() {
    const createIncidentInfo = (incident) => {
        const {
            incident_id,
            incident_type,
            status,
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
        <div class="col-sm-6 col">
            <h4>${incident_id}. ${incident_type}</h4>
            <label>Status: ${status}</label>
            <label>Danger: ${danger}</label>
            <label>Location: ${address}, ${municipality}, ${prefecture}, ${country}</label>
            <label>Lat/Lon: ${lat}, ${lon}</label>
            <label>User: ${user_type} (${user_phone})</label>
            <label>Vehicles/Firemen: ${vehicles}/${firemen}</label>
            <label>Started: ${start_datetime}</label>
            <label>Result: ${finalResult}</label>
            <p>${description}</p>
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
                <div>
                    <div class="col-auto">
                        <button class="status-option-button" id=${incident_id + "-mark_as-finished"}>Mark as Finished</button>
                    </div>
                </div>
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
        const buttonId = incident_id + "activate-edit-mode-button";

        return `
        <div class="col-sm-auto col">
            <div class="row">
                <button id="${buttonId}">Edit</button>
            </div>
            <div class="row">
                ${createStatusOptions(incident_id, status)}
            </div>
        </div>
    `;
    };


    clearHtml(incidentsList);
    loadIncidentsButton.text("Reload incidents")

    const incidents = await getIncidentsList();
    incidents.data.forEach(incident => {
        const {incident_id} = incident;
        const component = $(`
                <div class=" section-content list-incidents-admin-item row align-items-center" id=${incident_id}>
                    ${createIncidentInfo(incident)}
                    ${createIncidentOptions(incident)}
                    <p id=${incident_id + '-message'}></p>
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