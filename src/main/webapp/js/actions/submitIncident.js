import verifyAddress from "../evaluation/evaluateAddress.js";
import {scrollAtComponent, setResultMessage} from "../utility/utility.js";
import {extractFormValuesAsJson} from "./extractFormValues.js";
import {getSession} from "../session/getSession.js";
import {submitIncident} from "../ajax/ajaxIncident.js";
import {checkForDuplicate} from "../ajax/ajaxValidation.js";

$(document).ready(() => {
    const incidentSubmissionForm = $('#incidentForm');

    incidentSubmissionForm.on('submit', async (event) => {
        const form = incidentSubmissionForm[0];
        event.preventDefault();

        const isFormValid = form.checkValidity()
        const sessionUser = await getSession();
        console.log("submitted");
        console.log(isFormValid);
        console.log(sessionUser);

        // TODO: Check duplicate for mobile
        let invalidFieldId = await verifyAddress();

        console.log(invalidFieldId);
        if (isFormValid && !invalidFieldId) {
            const incident = extractFormValuesAsJson("incidentForm");
            console.log(incident);
            incident.user_type = sessionUser.user_type;
            if (!incident.user_phone)
                incident["user_phone"] = sessionUser.sessionUser.telephone;
            else {
                incident.user_phone = incident.telephone;
                delete incident.telephone;
            }
            console.log(incident);
            console.log("Incident submitted successfully!");
            const result = await submitIncident(incident);
            console.log(result);
            setResultMessage("submission_result", result);
        } else if (!isFormValid) {
            const firstInvalidField = form.querySelector(':invalid');
            firstInvalidField.scrollIntoView({behavior: 'smooth', block: 'center'});
            firstInvalidField.focus();
            form.reportValidity();
            console.log("Incident submission failed due to validation errors.");
        } else {
            scrollAtComponent(invalidFieldId);
            console.log("Incident submission failed due to validation errors.");
        }
    });
});

