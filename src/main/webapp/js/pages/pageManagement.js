export const getBaseURL = () => {
    const basePath = window.location.pathname.split('/')[1];
    const baseURL = `${window.location.origin}/${basePath}/`;
    console.log(baseURL);
    return baseURL;
}

export const openDashboard = (userType) => {
    const dashboards = {
        "guest": "submit_incident",
        "user": "submit_incident",
        "volunteer": "list_incidents",
        "admin": "manage_incidents"
    }
    openPage("dashboard/" + userType + "/" + dashboards[userType] + ".html");
}

export const openIndex = () => {
    window.location.href = `${getBaseURL()}` + "index.html";
}

export const openPage = (page) => {
    window.location.href = `${getBaseURL()}` + "html/" + page;
}