import {getBaseURL} from "../pages/pageManagement.js";

export function getSessionUser() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let sessionUser = false;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Session user retrieval complete");
                const response = JSON.parse(xhr.responseText);
                console.log("Result: " + response["user"]);
                sessionUser = response["user"];
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve(sessionUser);
        };

        xhr.open('GET', getBaseURL() + 'GetActiveSession');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}