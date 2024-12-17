import {getServletURL} from "./ajax.js";

export function checkForDuplicate(attribute, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Available");
                console.log('Message:', xhr.responseText);
                success = true;
                message = xhr.responseText;
            } else if (xhr.readyState === 4 && xhr.status === 409) {
                console.log("Not available");
                console.log('Message:', xhr.responseText);
                success = false;
                message = xhr.responseText;
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                console.log('Message:', xhr.responseText);
                success = false;
                message = xhr.responseText;
            }
            console.log("result: ");
            console.log(success);
            console.log(message);
            resolve({success, message});
        };

        console.log(attribute);
        console.log(value);
        switch (attribute) {
            case "username":
                console.log("username");
                xhr.open('GET', getServletURL('IsUsernameAvailable?username=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "email":
                console.log("email");
                xhr.open('GET', getServletURL('IsEmailAvailable?email=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "telephone":
                console.log("telephone");
                xhr.open('GET', getServletURL('IsTelephoneAvailable?telephone=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            default:
                console.log(attribute);
                resolve({
                    "success": true,
                    "message": "No duplicates were found for " + attribute
                });
        }
    });
}