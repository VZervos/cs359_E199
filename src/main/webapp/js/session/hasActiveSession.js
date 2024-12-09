import {getBaseURL} from "../pages/pageManagement.js";

export function hasActiveSession() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let activeSession = false;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Session check complete");
                const response = JSON.parse(xhr.responseText);
                console.log("Result: " + response["activeSession"]);
                activeSession = response["activeSession"];
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve(activeSession);
        };

        xhr.open('GET', getBaseURL() + 'GetActiveSession');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}