import {hasActiveSession} from "./hasActiveSession.js";
import {openDashboard} from "../actions/managers/pageManager.js";

$(document).ready(async () => {
    const session = await hasActiveSession();
    console.log(session);
    if (session)
        openDashboard(session.user_type);
});