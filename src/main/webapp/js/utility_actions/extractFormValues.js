import {getAddress} from "../evaluation/evaluateAddress.js";

export function extractFormValuesAsJson(formId) {
    const formData = {};
    const userType = $('input[name="type"]:checked').val();

    $('#' + formId + ' input, #' + formId + ' select, #' + formId + ' textarea').each(function () {
        const inputName = $(this).attr('name');
        const inputValue = $(this).val();

        if ($(this).is(':radio') || $(this).is(':checkbox')) {
            if ($(this).is(':checked')) {
                if (userType === "user" && $(this).closest('.fireman-field').length) {
                    return;
                }
                formData[inputName] = inputValue;
            }
        } else if (inputName && inputValue) {
            if (userType === "user" && $(this).closest('.fireman-field').length) {
                return;
            }
            formData[inputName] = inputValue;
        }
    });

    const address = getAddress();
    formData["lat"] = address["lat"];
    formData["lon"] = address["lon"];
    return formData;
}

export function extractFormValues(formId) {
    return JSON.stringify(extractFormValuesAsJson(formId));
}