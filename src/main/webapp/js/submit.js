import verifyPassword from "./evaluatePassword.js";
import verifyFiremanAge from "./evaluateFiremanAge.js";
import verifyAddress, {getAddress} from "./evaluateAddress.js";
import {registerUser} from "./ajax/ajax.js";
import {isEmailAvailable, isTelephoneAvailable, isUsernameAvailable} from "./checkForDuplicates.js";

const scrollAtComponent = (component_id) =>
    $('html, body').animate({scrollTop: $('#' + component_id).offset().top}, 500);

function extractFormValues() {
    const formData = {};
    const userType = $('input[name="type"]:checked').val();

    $('#registrationForm input, #registrationForm select, #registrationForm textarea').each(function () {
        const inputName = $(this).attr('name');
        const inputValue = $(this).val();

        if ($(this).is(':radio') || $(this).is(':checkbox')) {
            if ($(this).is(':checked')) {
                if (userType === "Simple User" && $(this).closest('.fireman-field').length) {
                    return;
                }
                formData[inputName] = inputValue;
            }
        } else if (inputName && inputValue) {
            if (userType === "Simple User" && $(this).closest('.fireman-field').length) {
                return;
            }
            formData[inputName] = inputValue;
        }
    });

    const address = getAddress();
    formData["lat"] = address["lat"];
    formData["lon"] = address["lon"];
    const jsonData = JSON.stringify(formData);
    $('#result').show();
    $('#json_result').text(jsonData);
    console.log(jsonData);
    return jsonData;
}


$(document).ready(() => {
    const registrationForm = $('#registrationForm');

    registrationForm.on('submit', async (event) => {
        const form = registrationForm[0];

        event.preventDefault();

        const isFormValid = form.checkValidity();
        const invalidFieldId =
            verifyPassword()
            || verifyFiremanAge()
            || await verifyAddress()
            || isUsernameAvailable()
            || isEmailAvailable()
            || isTelephoneAvailable();

        if (isFormValid && !invalidFieldId) {
            const userData = extractFormValues();
            console.log("Form submitted successfully!");
            registerUser(userData);
            window.location.href = 'html/registrationSuccess.html';
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

