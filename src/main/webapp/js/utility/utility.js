export const RESULT_STYLE = {
    [true]: "green",
    [false]: "red",
};

export const scrollAtComponent = (component_id) =>
    $('html, body').animate({scrollTop: $('#' + component_id).offset().top}, 500);

