import {getIncidentsList} from "../ajax/ajax.js";
import {clearHtml} from "../utility/utility.js";

$(document).ready(function () {
    const loadIncidentsButton = $('#load-incidents-button');
    const incidentsList = $('#incident-list');

    loadIncidentsButton.on('click', async function () {
        clearHtml(incidentsList);
        loadIncidentsButton.text("Reload incidents")

        const incidents = await getIncidentsList();
        incidents.data.forEach(incident => {
            const {
                id,
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
            
            const component = $(`
                <div class=" section-content list-incidents-admin-item row align-items-center" id=${id}>
                    <div class=" col-sm-6 col">
                        <h4>${id}. ${incident_type}</h4>
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
                    <div class="col-sm-auto col">
                        <button class="remove-item">Remove</button>
                    </div>
            `);

            incidentsList.append(component);
        });
    });
});