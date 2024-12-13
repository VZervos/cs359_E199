import {getServiceURL} from "./ajax.js";

export function acceptParticipant(participant_id, volunteer_username) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Accepted " + volunteer_username + " as participant " + participant_id);
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                console.log('Message:', message);
                success = true;
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                console.log('Message:', message);
                success = false;
            }
            console.log("result: ");
            console.log(success);
            console.log(message);
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('participantAccept/' + participant_id + "/" + volunteer_username));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function releaseParticipant(participant_id, success, comment) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Released participant " + participant_id);
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                console.log('Message:', message);
                success = true;

            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                console.log('Message:', message);
                success = false;
            }
            console.log("result: ");
            console.log(success);
            console.log(message);
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('participantRelease/' + participant_id + "/" + success));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "comment": comment
        }));
    });
}