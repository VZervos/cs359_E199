import {getSession} from "../../../session/getSession.js";
import {generateNotification} from "../../managers/notificationManager.js";

const session = await getSession();
const volunteer = session.user;

$(document).ready(async function () {
    function filterFunction({incident, volunteer, participants, distances}) {
        const {incident_id} = incident;
        const entry = distances.find(entry => entry.id == incident_id);
        const isAlreadyParticipating = participants.data.filter(
            participant => participant.incident_id == incident_id &&
                participant.volunteer_id == volunteer.volunteer_id
        ).length != 0;
        const numberOfParticipants = participants.data.filter(
            participant => participant.incident_id == incident_id &&
                participant.volunteer_type == volunteer.volunteer_type
        ).length;
        const needsParticipants = volunteer.volunteer_type === "simple" ? incident.firemen > numberOfParticipants : incident.vehicles > numberOfParticipants;
        return entry.distance && entry.distance > 0 && entry.distance <= 30000 && needsParticipants && !isAlreadyParticipating;
    }

    function optionsComponent({volunteer_id, incident_id}) {
        return `
            <div>
                <div class="row">
                    <span>
                        <button class="request_participation-option-button"
                            id=${volunteer_id + "-" + incident_id + "-notification"}>Request to participate</button>
                    </span>
                </div>
            </div>
        `;
    }

    const notificationGenerator = setTimeout(async () => {
        const notification = await generateNotification(session,
            filterFunction, {volunteer},
            optionsComponent, {volunteer_id: volunteer.volunteer_id});
        $('#notification').html(notification);
        console.log('Notification generated:', notification);
    }, 0);

    $('#closeNotificationButton').click(_ => {
        $('#notifications').hide();
        clearTimeout(notificationGenerator);
    })
});