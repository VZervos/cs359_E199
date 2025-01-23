import verifyAddress from "../../../evaluation/evaluateAddress.js";
import {scrollAtComponent, setResultMessage} from "../../../utility/utility.js";
import {extractFormValuesAsJson} from "../../../utility_actions/extractFormValues.js";
import {getSession} from "../../../session/getSession.js";
import {submitIncident} from "../../../ajax/ajaxIncident.js";
import {isTelephoneAvailable} from "../../../evaluation/checkForDuplicates.js";

$(document).ready(() => {
    const incidentSubmissionForm = $('#incidentForm');

    incidentSubmissionForm.on('submit', async (event) => {
        const form = incidentSubmissionForm[0];
        event.preventDefault();

        const isFormValid = form.checkValidity()
        const sessionUser = await getSession();
        const {user_type} = sessionUser;
        console.log("submitted");
        console.log(isFormValid);
        console.log(sessionUser);

        let invalidFieldId = null;
        if (user_type === "guest") invalidFieldId = await isTelephoneAvailable();
        invalidFieldId = invalidFieldId || await verifyAddress($('#address'), $('#municipality'), $('#country'));

        console.log(invalidFieldId);
        if (isFormValid && !invalidFieldId) {
            const incident = extractFormValuesAsJson("incidentForm");
            console.log(incident);
            incident.user_type = user_type;
            if (!incident.telephone)
                incident["user_phone"] = user_type === "admin" ? "199" : sessionUser.user.telephone;
            else if (!incident.user_phone && incident.telephone) {
                incident.user_phone = incident.telephone;
                delete incident.telephone;
            }
            console.log(incident);
            console.log("Incident submitted successfully!");
            const result = await submitIncident(incident);
            console.log(result)
            if (result.success)
                location.reload();
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
