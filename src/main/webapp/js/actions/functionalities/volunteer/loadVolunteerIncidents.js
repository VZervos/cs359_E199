import {getIncidentsList, getParticipantsList} from "../../../ajax/ajaxLists.js";
import {getSession} from "../../../session/getSession.js";
import {reloadIncidents} from "../../managers/incidentManager.js";

let loadIncidentsButton;
let incidentsListDiv;

const session = await getSession();
const volunteer = session.user;

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
            <div>Location: <span id=${incident_id + "-location"}>{address}, ${municipality}, ${country} [${prefecture}]</span></div>
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
        </div>
    `;
};
const createIncidentOptions = ({incident, volunteer, participants}) => {
    const {incident_id, vehicles, firemen} = incident;
    const {volunteer_id, volunteer_type} = volunteer;
    let setAcceptButton;

    console.log(incident);
    console.log(volunteer);
    if (volunteer_type === "simple") {
        const activeFiremen = participants.data.filter(p => p.incident_id == incident_id && p.volunteer_type == "simple" && !p.volunteer_type == "requested").length;
        console.log(activeFiremen)
        setAcceptButton = activeFiremen < firemen;
    } else {
        const activeVehicles = participants.data.filter(p => p.incident_id == incident_id && p.volunteer_type == "driver" && !p.volunteer_type == "requested").length;
        console.log(activeVehicles)
        setAcceptButton = activeVehicles < vehicles;
    }
    console.log(setAcceptButton);

    if (setAcceptButton)
        return `
                <div>
                    <div class="row">
                        <span>
                            <button class="request_participation-option-button" id=${volunteer_id + "-" + incident_id + "-manage_volunteers"}>Request to participate</button>
                        </span>
                    </div>
                </div>
            `;
    return "";
};

export async function reloadVolunteerIncidents() {
    loadIncidentsButton.text("Reload incidents");
    const incidentsList = await getIncidentsList();
    const participants = await getParticipantsList();
    const incidents = incidentsList.data
        .filter(
            incident => incident.status === "running" ||
                (participants.data.some(participant => participant.volunteer_username === volunteer.username && participant.incident_id === incident.incident_id))
        )
        .reverse()
    await reloadIncidents(
        incidents,
        incidentsListDiv,
        createIncidentInfo,
        {createIncidentOptions, createIncidentOptionsArgs: {volunteer, participants}});

}

$(document).ready(function () {
    loadIncidentsButton = $('#load-incidents-button');
    incidentsListDiv = $('#incident-list');

    loadIncidentsButton.on('click', async function () {
        await reloadVolunteerIncidents();
    });
});