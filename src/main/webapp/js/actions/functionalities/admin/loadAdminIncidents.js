import {getIncidentsList} from "../../../ajax/ajaxLists.js";
import {reloadIncidents, shareIncident} from "../../managers/incidentManager.js";
import {updateIncidentFieldValue, updateIncidentStatus} from "../../../ajax/ajaxIncident.js";
import {setResultMessage} from "../../../utility/utility.js";

let loadIncidentsButton;
let incidentsListDiv;

const createIncidentInfo = (incident) => {
    const changeValueOfField = (field, newValue) => {
        const value = Math.max(0, newValue);
        $(document).on('click', '#' + field, (event) => event.target.value = value)
    }

    const generateVehiclesFiremenSelectors = (incident) => {
        let vehiclesFiremenSelectors;
        if (incident.status == "submitted") {
            vehiclesFiremenSelectors = `
                <div>
                    Vehicles: 
                    <button type="button" class="incrdecr-button decr-button" id=${incident_id + "-vehicles-decrease"}>-</button>
                    <span id=${incident_id + "-vehicles-value"}>${vehicles}</span>
                    <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-vehicles-increase"}>+</button>
                </div>
                <div>
                    Firemen:
                    <button type="button" class="incrdecr-button decr-button" id=${incident_id + "-firemen-decrease"}>-</button>
                    <span id=${incident_id + "-firemen-value"}>${firemen}</span>
                    <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-firemen-increase"}>+</button>
                </div>
            `
        } else if (incident.status == "running") {
            vehiclesFiremenSelectors = `
                <div>
                    Vehicles: 
                    <span id=${incident_id + "-vehicles-value"}>${vehicles}</span>
                    <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-vehicles-increase"}>+</button>
                    <button class="save-info-button" id=${incident_id + "-change-vehicles-button"}>Save Changes</button>
                </div>
                <div>
                    Firemen:
                    <span id=${incident_id + "-firemen-value"}>${firemen}</span>
                    <button type="button" class="incrdecr-button incr-button" id=${incident_id + "-firemen-increase"}>+</button>
                    <button class="save-info-button" id=${incident_id + "-change-firemen-button"}>Save Changes</button>
                </div>
            `
        } else {
            vehiclesFiremenSelectors = `
                <div>
                    Vehicles: 
                    <span id=${incident_id + "-vehicles-value"}>${vehicles}</span>
                </div>
                <div>
                    Firemen: 
                    <span id=${incident_id + "-firemen-value"}>${firemen}</span>
                </div>
            `
        }
        return vehiclesFiremenSelectors
    }

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
        status
    } = incident;

    const shareButtons = status === "running" ? `
        <button id=${incident_id + "-share-facebook"} class="share-button fa fa-facebook social-icon"></button>
        <button id=${incident_id + "-share-twitter"} class="share-button fa fa-twitter social-icon"></button>
        ` : "";

    let finalResultField;
    if (status === "running")
        finalResultField = `
        <div>
            Result:
            <textarea id=${incident_id + "-result-value"}>${finalResult}</textarea>
        </div>
        `
    else
        finalResultField = `
        <div>
            Result:
            <textarea readonly id=${incident_id + "-result-value"}>${finalResult}</textarea>
        </div>
        `

    return `
    <div xmlns="http://www.w3.org/1999/html">
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
        <div>Location: <span id=${incident_id + "-location"}>${address}, ${municipality}, Greece [${prefecture}]</span></div>
        <div>Lat/Lon: ${lat}, ${lon}</div>
        <div>User: ${user_type} (${user_phone})</div>
        ${generateVehiclesFiremenSelectors(incident)}
        <div>Started: ${start_datetime}</div>
        <div>Ended: ${end_datetime}</div>
        ${finalResultField}
        <div>
            Description:
            <button class="save-info-button" id=${incident_id + "-change-description-button"}>Save Changes</button>
            <textarea class="big-text-box incident-value-selector" id=${incident_id + "-description-value"}>${description}</textarea>
        </div>
        <button class="map-toggle-button" id=${incident_id + "-showAddressOnMap"} type="button">Show map</button>
        <p class="errorMessage" id=${incident_id + "-address_error"}></p>
        <p id=${incident_id + "-address_availability"}></p>
        <div id=${incident_id + "-map"}></div>
        ${shareButtons}
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
const createIncidentOptions = ({incident}) => {
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
const volunteersList = (incident_id) => `<div class="container" id="${incident_id}-volunteers-list"></div>`;

export async function reloadAdminIncidents() {
    loadIncidentsButton.text("Reload incidents");
    const incidentsList = await getIncidentsList();
    const incidents = incidentsList.data.reverse();
    console.log({createIncidentOptions, createStatusOptionsArgs: {}});
    await reloadIncidents(
        incidents,
        incidentsListDiv,
        createIncidentInfo,
        {createIncidentOptions, createStatusOptionsArgs: {}},
        {createStatusOptions, sublistComponent: volunteersList}
    );
}

$(document).ready(function () {
    loadIncidentsButton = $('#load-incidents-button');
    incidentsListDiv = $('#incident-list');

    loadIncidentsButton.on('click', async function () {
        await reloadAdminIncidents();
    });

    const getIncidentFieldNewValue = (incidentId, fieldId) => {
        const field = $('#' + incidentId + '-' + fieldId + '-value');
        return field.val() || field.text();
    }

    $(document).on('click', '.save-info-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentFieldFromEvent = (event) => event.target.id.split('-')[2];

        const incidentId = getIncidentIdFromEvent(event);
        const fieldId = getIncidentFieldFromEvent(event);
        const newValue = getIncidentFieldNewValue(incidentId, fieldId);

        const result = await updateIncidentFieldValue(incidentId, fieldId, newValue);
        setResultMessage(incidentId + '-message', result);

        console.log(incidentId);
        console.log(fieldId);
        console.log(newValue);

    });

    $(document).on('click', '.status-option-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getIncidentNewStatusFromEvent = (event) => event.target.id.split('-')[2];

        console.log(event);
        const incidentId = getIncidentIdFromEvent(event);
        const incidentNewStatus = getIncidentNewStatusFromEvent(event);
        const incidentResult = getIncidentFieldNewValue(incidentId, "result");
        const incidentVehicles = getIncidentFieldNewValue(incidentId, "vehicles");
        const incidentFiremen = getIncidentFieldNewValue(incidentId, "firemen");
        console.log(incidentResult)
        console.log(incidentVehicles)
        console.log(incidentFiremen)

        const result = await updateIncidentStatus(incidentId, incidentNewStatus, incidentResult, incidentVehicles, incidentFiremen);
        if (result.success) {
            const incidentsList = await getIncidentsList();
            const incidents = incidentsList.data.reverse();
            await reloadIncidents(
                incidents,
                incidentsListDiv,
                createIncidentInfo,
                {createIncidentOptions, createStatusOptionsArgs: {}},
                {createStatusOptions, sublistComponent: volunteersList}
            );
        }
        setResultMessage(incidentId + '-message', result);

        console.log(incidentId + incidentNewStatus);
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