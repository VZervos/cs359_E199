$(document).ready(async () => {
    const activateEditMode = () => {
        console.log("activateEditMode");
        $('#edit-information').show();
        $('#view-information').hide();
    }

    const deactivateEditMode = () => {
        console.log("deactivateEditMode");
        $('#edit-information').hide();
        $('#view-information').show();
    }

    $('#activate-edit-mode-button').click(async (event) => {
        activateEditMode();
    });

    $('#deactivate-edit-mode-button').click(async (event) => {
        deactivateEditMode();
    });

    deactivateEditMode()

});