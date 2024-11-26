import {checkForDuplicate, updateInfoField} from "../ajax/ajax.js";
import {RESULT_STYLE} from "../utility/utility.js";
import verifyAddress from "../evaluation/evaluateAddress.js";
import verifyPassword from "../evaluation/evaluatePassword.js";

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

async function updateInfo(invalidField, infoField, infoFieldValue, message, valueAvailabilityMessage) {
    if (!invalidField) {
        const updateResult = await updateInfoField(infoField, infoFieldValue);
        console.log(updateResult);
        const success = updateResult["success"];
        message = updateResult["message"];
        valueAvailabilityMessage.css("color", RESULT_STYLE[success]);
        valueAvailabilityMessage.text(message);
    } else {
        const success = false;
        valueAvailabilityMessage.css("color", RESULT_STYLE[success]);
        valueAvailabilityMessage.text(message);
    }
}

$(document).ready(() => {
    $('.update-info-button').click(async (event) => {
        const buttonClickedId = event.target.id;
        const infoField = buttonClickedId.split('-')[1];
        console.log(infoField);

        const infoFieldValue = $('#' + infoField).val();
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
                } else if (infoField === "password") {
                    invalidField = verifyPassword();
                }
                await updateInfo(invalidField, infoField, infoFieldValue, message, valueAvailabilityMessage);
            } else {
                valueAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
                valueAvailabilityMessage.text(message);
            }
        });
    });
});

