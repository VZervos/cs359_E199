export const scrollAtComponent = (component_id) =>
    $('html, body').animate({scrollTop: $('#' + component_id).offset().top}, 500);

export const getBaseURL = () => {
    const basePath = window.location.pathname.split('/')[1];
    const baseURL = `${window.location.origin}/${basePath}`;
    return baseURL;
}

export const openDashboard = () => {
    window.location.href = `${getBaseURL()}/html/dashboard.html`;
}