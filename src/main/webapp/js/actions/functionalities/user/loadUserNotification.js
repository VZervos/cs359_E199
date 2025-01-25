import {getSession} from "../../../session/getSession.js";
import {generateNotification} from "../../managers/notificationManager.js";

const session = await getSession();

$(document).ready(async function () {
    const filterFunction = ({incident, distances}) => {
        const entry = distances.find(entry => entry.id == incident.incident_id);
        console.log(entry);
        return entry.distance && entry.distance > 0 && entry.distance <= 30000;
    };

    const notificationGenerator = setTimeout(async () => {
        const notification = await generateNotification(session, filterFunction);
        $('#notification').html(notification);
        console.log('Notification generated:', notification);
        const sound = new Audio('/E199_war_exploded/media/notification.mp3');
        sound.play().catch(error => console.error("Error playing sound:", error));
    }, 0);

    $('#closeNotificationButton').click(_ => {
        $('#notifications').hide();
        clearTimeout(notificationGenerator);
    })
});