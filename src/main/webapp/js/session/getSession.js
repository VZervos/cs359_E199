import {getBaseURL} from "../actions/managers/pageManager.js";

export function getSession() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let user = null;
            let user_type = "guest";
            let activeSession = false;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Session user retrieval complete");
                const response = JSON.parse(xhr.responseText);
                console.log("Result: " + response);
                console.log('Message:', response.message);
                if (response["user"]) user = JSON.parse(response["user"]);
                user_type = response["user_type"];
                activeSession = response["activeSession"];
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            console.log(user);
            console.log(user_type);
            console.log(activeSession);
            resolve({user, user_type, activeSession});
        };

        xhr.open('GET', getBaseURL() + 'GetActiveSession');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}