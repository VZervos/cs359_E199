import {getCallResult, getServiceURL} from "./ajax.js";

export function updateIncidentStatus(incidentId, newStatus, result) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        console.log(result);
        xhr.open('PUT', getServiceURL('incidentStatus/' + incidentId + '/' + newStatus));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "result": result
        }));
    });
}

export function updateIncidentFieldValue(incidentId, field, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('incidentFieldValue/' + incidentId));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "field": field,
            "value": value
        }));
    });
}

export function submitIncident(incidentData) {
    return new Promise((resolve, reject) => {
        console.log(incidentData);
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        xhr.open('POST', getServiceURL('incident'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(incidentData));
    });
}
