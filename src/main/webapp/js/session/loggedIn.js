import {openDashboard} from "../utility/utility.js";
import {hasActiveSession} from "./hasActiveSession.js";

$(document).ready(async () => {
    const session = await hasActiveSession();
    console.log(session);
    if (session)
        openDashboard();
});