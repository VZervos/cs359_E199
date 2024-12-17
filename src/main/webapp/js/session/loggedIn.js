import {hasActiveSession} from "./hasActiveSession.js";
import {openDashboard} from "../pages/pageManagement.js";

$(document).ready(async () => {
    const session = await hasActiveSession();
    console.log(session);
    if (session)
        openDashboard(session.user_type);
});