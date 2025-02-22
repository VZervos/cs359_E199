import verifyPassword from "../../../evaluation/evaluatePassword.js";
import verifyFiremanAge from "../../../evaluation/evaluateFiremanAge.js";
import verifyAddress from "../../../evaluation/evaluateAddress.js";
import {isEmailAvailable, isTelephoneAvailable, isUsernameAvailable} from "../../../evaluation/checkForDuplicates.js";
import {scrollAtComponent} from "../../../utility/utility.js";
import {extractFormValues} from "../../../utility_actions/extractFormValues.js";
import {openPage} from "../../managers/pageManager.js";
import {registerUser} from "../../../ajax/ajaxUsers.js";

$(document).ready(() => {
    const registrationForm = $('#registrationForm');

    registrationForm.on('submit', async (event) => {
        const form = registrationForm[0];

        event.preventDefault();

        const isFormValid = form.checkValidity()
        const invalidFieldId =
            verifyPassword()
            || verifyFiremanAge()
            || await verifyAddress($('#address'), $('#municipality'), $('#country'))
            || isUsernameAvailable()
            || isEmailAvailable()
            || isTelephoneAvailable();

        if (isFormValid && !invalidFieldId) {
            const userData = extractFormValues("registrationForm");
            console.log("Form submitted successfully!");
            registerUser(userData);
            openPage("session/registrationSuccess.html");
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

