import {updateFiremanHeight, updateFiremanWeight} from "../utility_actions/heightWeightChange.js";

$(document).ready(() => {
    function enableFiremanFields() {
        const firemanField = $('.fireman-field');
        firemanField.attr("disabled", false);
        firemanField.show();
        $('input[class="firemantype"]').attr("required", true);

        $('#termsofservice_message').html("<u><b>Unnecessary use of the application is prohibited. I agree that any unnecessary use of the application will be prosecuted. Also, I declare responsibly that I am an active member of the volunteer firefighters.</b></u>")

        updateFiremanHeight();
        updateFiremanWeight();
    }

    function disableFiremanFields() {
        const firemanField = $('.fireman-field');
        firemanField.attr("disabled", true);
        firemanField.hide();
        const firemantype = $('input[name="firemantype"]');
        firemantype.attr("required", false);
        firemantype.clear

        $('#termsofservice_message').html("<u><b>Unnecessary use of the application is prohibited. I agree that any unnecessary use of the application will be prosecuted.</b></u>")
    }

    $('.type-selector').on('change', () => {
        if ($('#type_fireman').is(':checked')) {
            enableFiremanFields();
        } else {
            disableFiremanFields()
        }
    })

    disableFiremanFields();
})