import verifyPassword from "../evaluation/evaluatePassword.js";
import verifyFiremanAge from "../evaluation/evaluateFiremanAge.js";
import verifyAddress, {getAddress} from "../evaluation/evaluateAddress.js";
import {registerUser} from "../ajax/ajax.js";
import {isEmailAvailable, isTelephoneAvailable, isUsernameAvailable} from "../evaluation/checkForDuplicates.js";
import {openPage, scrollAtComponent} from "../utility/utility.js";
import {extractFormValues} from "./extractFormValues.js";

$(document).ready(() => {
    const registrationForm = $('#registrationForm');

    registrationForm.on('submit', async (event) => {
        const form = registrationForm[0];

        event.preventDefault();

        const isFormValid = form.checkValidity()
        const invalidFieldId =
            verifyPassword()
            || verifyFiremanAge()
            || await verifyAddress()
            || isUsernameAvailable()
            || isEmailAvailable()
            || isTelephoneAvailable();

        if (isFormValid && !invalidFieldId) {
            const userData = extractFormValues("registrationForm");
            console.log("Form submitted successfully!");
            registerUser(userData);
            openPage("html/registrationSuccess.html");
        } else if (!isFormValid) {
            const firstInvalidField = form.querySelector(':invalid');
            firstInvalidField.scrollIntoView({behavior: 'smooth', block: 'center'});
            firstInvalidField.focus();
            form.reportValidity();
            console.log("Form submission failed due to validation errors.");
        } else {
            scrollAtComponent(invalidFieldId);
            console.log("Form submission failed due to validation errors.");
        }
    });

    $('#result').hide();
});

