import {getBaseURL} from "../pages/pageManagement.js";

export function getSession() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let sessionUser = null;
            let user_type = "guest";
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Session user retrieval complete");
                const response = JSON.parse(xhr.responseText);
                console.log("Result: " + response);
                sessionUser = JSON.parse(response["user"]);
                user_type = response["user_type"];
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve({sessionUser, user_type});
        };

        xhr.open('GET', getBaseURL() + 'GetActiveSession');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}