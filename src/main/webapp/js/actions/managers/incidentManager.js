import {clearHtml} from "../../utility/utility.js";
import {getIncidentsList} from "../../ajax/ajaxLists.js";

export async function reloadIncidents(
    incidents = [],
    incidentsListDiv,
    createIncidentInfo = (_) => "",
    {createIncidentOptions = (_) => "", createIncidentOptionsArgs = {}} = {},
    otherFunctions = {}
) {
    console.log(createIncidentOptions);
    console.log(createIncidentOptionsArgs);
    const {createStatusOptions, sublistComponent} = otherFunctions;
    clearHtml(incidentsListDiv);

    incidents.forEach(incident => {
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
                                ${createIncidentOptions ? createIncidentOptions({incident, ...createIncidentOptionsArgs}) : ""}
                                <p id="${incident_id}-message"></p>
                                ${sublistComponent ? sublistComponent(incident_id) : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);

        incidentsListDiv.append(component);
    });
}

export async function shareIncident(incidentId, platformId) {
    let shareURL = "";
    const incidentsList = await getIncidentsList()
    const incident = incidentsList.data.find(incident => incident.incident_id == incidentId);
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
        description
    } = incident;

    if (platformId === "facebook") {
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.fireservice.gr/')}&quote=${encodeURIComponent(`
                Incident at ${address}, ${municipality}, ${prefecture}:
                Danger: ${danger}
                Lat/Lon: ${lat}, ${lon}
                Vehicles: ${vehicles}
                Firemen: ${firemen}
                Started: ${start_datetime}
                Result: ${finalResult}
                #Incident #Emergency
            `)}`;
    } else {
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`
                Incident at ${address}, ${municipality}, ${prefecture}:
                Danger: ${danger}
                Lat/Lon: ${lat}, ${lon}
                Vehicles: ${vehicles}
                Firemen: ${firemen}
                Started: ${start_datetime}
                Result: ${finalResult}
                #Incident #Emergency
            `)}`;
    }
    window.open(shareURL, '_blank');
}