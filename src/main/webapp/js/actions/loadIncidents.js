import {clearHtml} from "../utility/utility.js";

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