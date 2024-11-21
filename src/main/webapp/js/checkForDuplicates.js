import {checkForDuplicate} from "./ajax/ajax.js";

const RESULT_STYLE = {
    [true]: "green",
    [false]: "red",
};

let usernameAvailable = false;
let emailAvailable = false;
let telephoneAvailable = false;

export const isUsernameAvailable = () => usernameAvailable ? null : 'username';
export const isEmailAvailable = () => emailAvailable ? null : 'email';
export const isTelephoneAvailable = () => telephoneAvailable ? null : 'telephone';


$(document).ready(() => {
    $('#username').on('change', () => {
        const usernameAvailabilityMessage = $('#username_availability');
        checkForDuplicate("username", $('#username').val()).then(result => {
            console.log("Promise result:", result);
            const isAvailable = result["success"];
            const message = result["message"];
            console.log(isAvailable);
            console.log(message);
            console.log(RESULT_STYLE[isAvailable]);
            usernameAvailable = isAvailable;
            usernameAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
            usernameAvailabilityMessage.text(message);
        });
    });

    $('#email').on('change', () => {
        const emailAvailabilityMessage = $('#email_availability');
        checkForDuplicate("email", $('#email').val()).then(result => {
            console.log("Promise result:", result);
            const isAvailable = result["success"];
            const message = result["message"];
            console.log(isAvailable);
            console.log(message);
            console.log(RESULT_STYLE[isAvailable]);
            emailAvailable = isAvailable;
            emailAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
            emailAvailabilityMessage.text(message);
        });
    });

    $('#telephone').on('change', () => {
        const telephoneAvailabilityMessage = $('#telephone_availability');
        checkForDuplicate("telephone", $('#telephone').val()).then(result => {
            console.log("Promise result:", result);
            const isAvailable = result["success"];
            const message = result["message"];
            console.log(isAvailable);
            console.log(message);
            console.log(RESULT_STYLE[isAvailable]);
            telephoneAvailable = isAvailable;
            telephoneAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
            telephoneAvailabilityMessage.text(message);
        });
    });
});