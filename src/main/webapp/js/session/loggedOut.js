import {hasActiveSession} from "./hasActiveSession.js";
import {getBaseURL, openIndex} from "../pages/pageManagement.js";

export function invalidateSession() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let activeSession = false;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Logout success");
                const response = JSON.parse(xhr.responseText);
                console.log(response["message"]);
                openIndex();
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve(activeSession);
        };

        xhr.open('POST', getBaseURL() + 'LogoutUser');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

$(document).ready(async () => {
    $('#logoutButton').click(async event => {
        console.log("logout");
        await invalidateSession();
        openIndex();
    })

    const session = await hasActiveSession();
    console.log(session);
    if (!session)
        openIndex();

})