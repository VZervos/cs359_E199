import {RESULT_STYLE} from "../utility/utility.js";
import verifyAddress from "../evaluation/evaluateAddress.js";
import verifyPassword from "../evaluation/evaluatePassword.js";
import {extractFormValues} from "./extractFormValues.js";
import {checkForDuplicate} from "../ajax/ajaxValidation.js";
import {updateInfoField} from "../ajax/ajaxUsers.js";

async function checkAddressValidity(invalidField, message) {
    const country = $('#country').val();
    const prefecture = $('#prefecture').val();
    const municipality = $('#municipality').val()
    const address = $('#address').val();
    if (!country || !prefecture || !municipality || !address || country === "" || prefecture === "") {
        invalidField = true;
        message = "Some address fields are empty."
    } else {
        invalidField = await verifyAddress()
    }
    return {invalidField, message};
}

async function updateInfo(invalidField, usertype, infoField, infoFieldValue, message, valueAvailabilityMessage) {
    let success = false;
    if (!invalidField) {
        const updateResult = await updateInfoField(usertype, infoField, infoFieldValue);
        console.log(updateResult);
        success = updateResult["success"];
        message = updateResult["message"];
        valueAvailabilityMessage.css("color", RESULT_STYLE[success]);
        valueAvailabilityMessage.text(message);
    } else {
        valueAvailabilityMessage.css("color", RESULT_STYLE[success]);
        valueAvailabilityMessage.text(message);
    }
    return {success, message};
}

$(document).ready(() => {
    const updateForm = $('form');

    updateForm.on('submit', async (event) => {
        const form = updateForm[0];

        event.preventDefault();

        const isFormValid = form.checkValidity();
        console.log(isFormValid);
        console.log(event);
        console.log(event.target[1].id)
        const usertype = event.target.id.split('-')[1];
        const infoField = event.target.id.split('-')[2];

        console.log(infoField);

        const formValues = JSON.parse(extractFormValues("form-" + usertype + "-" + infoField));

        const infoFieldValue = formValues[infoField];
        console.log(infoFieldValue);


        await checkForDuplicate(infoField, infoFieldValue).then(async result => {
            console.log("Promise result:", result);
            const isAvailable = result["success"];
            let message = result["message"];
            const valueAvailabilityMessage = $('#' + infoField + '_availability');

            if (isAvailable) {
                message = '';
                let invalidField = null;
                if (infoField === "address") {
                    const __ret = await checkAddressValidity(invalidField, message);
                    invalidField = __ret.invalidField;
                    message = __ret.message;
                    if (!invalidField) {
                        for (const [field, value] of Object.entries(formValues)) {
                            const updateResult = await updateInfo(invalidField, usertype, field, value, message, valueAvailabilityMessage);
                            if (updateResult["success"])
                                valueAvailabilityMessage.text("All address fields have been successfully updated");
                            else break;
                        }
                    }
                    return
                } else if (infoField === "password") {
                    invalidField = verifyPassword();
                }
                await updateInfo(invalidField, usertype, infoField, infoFieldValue, message, valueAvailabilityMessage);
            } else {
                valueAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
                valueAvailabilityMessage.text(message);
            }
        });
    });
});

