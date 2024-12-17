import {getCallResult, getServiceURL, getServletURL} from "./ajax.js";

export function acceptParticipant(participant_id, volunteer_username) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
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
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('participantRelease/' + participant_id + "/" + success));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "comment": comment
        }));
    });
}

export function createParticipant(incident_id, volunteer_username, volunteer_type) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        xhr.open('POST', getServletURL("CreateParticipant"));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "incident_id": incident_id,
            "volunteer_username": volunteer_username,
            "volunteer_type": volunteer_type,
            "status": "requested"
        }));
    });
}