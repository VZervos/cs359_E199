import {getSessionUser} from "../session/getSessionUser.js";

$(document).ready(async () => {
    const infoFields = $('.show-user-info-field');

    const sessionUser = await getSessionUser();
    console.log(sessionUser)
    const userData = JSON.parse(sessionUser);
    console.log(userData);

    infoFields.each((_, infoField) => {
        const id = infoField.id;
        const fieldName = id.split('_').slice(1).join('_');
        console.log(userData[fieldName]);
        $(infoField).html(userData[fieldName]);
        console.log(fieldName);
    });
    $('#view_type').html("user");

})