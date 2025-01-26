import {getIncidentsList, getParticipantsList} from "../../ajax/ajaxLists.js";
import {calculateDistance} from "../../maps/geocoding.js";

export async function generateNotification(
    session,
    filterFunction = () => true,
    filterFunctionArgs = {},
    optionsComponent = () => "",
    optionsComponentArgs = {}
) {
    const incidents = await getIncidentsList();
    const participants = await getParticipantsList();

    const origin = {"lat": session.user.lat, "lon": session.user.lon};
    const destinations = incidents.data.map(incident => {
        return {"id": incident.incident_id, "lat": incident.lat, "lon": incident.lon}
    });
    const distances = await calculateDistance(origin, destinations);
    console.log(distances)
    const mostRecentCloseIncident = incidents.data.filter(incident => filterFunction({
        ...filterFunctionArgs, incident, participants, distances
    })).reverse()[0];
    console.log(mostRecentCloseIncident);

    let notification = `No recent incident found at close range, all good!`
    if (mostRecentCloseIncident) {
        const {
            incident_id,
            incident_type,
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
            status,
            description
        } = mostRecentCloseIncident;

        notification = `
            <div class="accordion" id="accordion-notification">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-notification">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-notification" aria-expanded="false" aria-controls="collapse-notification">
                            ${status}: Incident #${incident_id} (${incident_type})
                        </button>
                    </h2>
                    <div id="collapse-notification" class="accordion-collapse collapse" aria-labelledby="heading-notification" data-bs-parent="accordion-notification">
                        <div class="accordion-body">
                            <div class="section-content row align-items-center" id="${incident_id}">
                                <div>Danger: ${danger} </div>
                                <div>Location: ${address}, ${municipality}, ${prefecture}, Greece</div>
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
                                ${optionsComponent({...optionsComponentArgs, incident_id})}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    return notification;
}