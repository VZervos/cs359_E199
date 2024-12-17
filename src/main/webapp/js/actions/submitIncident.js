import verifyAddress from "../evaluation/evaluateAddress.js";
import {isTelephoneAvailable} from "../evaluation/checkForDuplicates.js";
import {scrollAtComponent} from "../utility/utility.js";
import {extractFormValues} from "./extractFormValues.js";
import {getSessionUser} from "../session/getSessionUser";
import {submitIncident} from "../ajax/ajaxIncident.js";

$(document).ready(() => {
    const incidentSubmissionForm = $('#incidentSubmission');

    incidentSubmissionForm.on('submit', async (event) => {
        const form = incidentSubmissionForm[0];
        event.preventDefault();

        const isFormValid = form.checkValidity()
        const sessionUser = await getSessionUser();

        let invalidFieldId = await verifyAddress()
            || (sessionUser == null || sessionUser.usertype === "admin" ? null : isTelephoneAvailable());

        if (isFormValid && !invalidFieldId) {
            const incident = extractFormValues("incidentSubmission");
            if (!incident.telephone) incident["telephone"] = sessionUser.user.telephone;
            console.log("Incident submitted successfully!");
            const result = submitIncident(incident);
            $("#submission_result").text(result.message);
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

    $("#submission_result").hide();
});

