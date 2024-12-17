export const RESULT_STYLE = {
    [true]: "green",
    [false]: "red",
};

export const setResultMessage = (messageComponentId, result) => {
    const messageComponent = $('#' + messageComponentId);
    messageComponent.text(result.message);
    messageComponent.css("color", RESULT_STYLE[result.success]);

}

export const scrollAtComponent = (component_id) =>
    $('html, body').animate({scrollTop: $('#' + component_id).offset().top}, 500);

export const getRadioValue = (radioName) =>
    $('input[name=' + radioName + ']:checked').val();

export const clearHtml = (component) =>
    component.html("");