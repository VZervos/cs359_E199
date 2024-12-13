import {getServiceURL} from "./ajax.js";

export function updateIncidentStatus(incidentId, newStatus) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                success = true;
                message = response.message;
                console.log(message);
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

        xhr.open('PUT', getServiceURL('incidentStatus/' + incidentId + '/' + newStatus));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function updateIncidentFieldValue(incidentId, field, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                success = true;
                message = response.message;
                console.log(message);
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

        xhr.open('PUT', getServiceURL('incidentFieldValue/' + incidentId));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "field": field,
            "value": value
        }));
    });
}