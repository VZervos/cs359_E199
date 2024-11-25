import {openDashboard} from "../utility/utility.js";

export function hasActiveSession() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let activeSession = false;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Session found");
                const response = JSON.parse(xhr.responseText);
                console.log(response["activeSession"]);
                activeSession = response["activeSession"];
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve(activeSession);
        };

        xhr.open('GET', 'GetActiveSession');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

$(document).ready(async () => {
    const session = await hasActiveSession();
    console.log(session);
    if (session)
        openDashboard();
});