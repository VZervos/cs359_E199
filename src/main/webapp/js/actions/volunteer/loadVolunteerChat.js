import {loadChatBox, loadChatSection, loadIncidentSelector, submitMessage} from "../chatManager.js";
import {getSession} from "../../session/getSession.js";

let incidentId;
let chattype;
let sender;

$(document).ready(async function () {
    const loadChatButton = $('#load-chat-button');
    const chatSection = $('#messages');

    loadChatButton.on('click', async function () {
        chattype = "public";
        incidentId = $('#incident').val();
        console.log(incidentId);
        await loadChatSection(incidentId, sender, chattype);
        const chatBox = $('#chat_box');
        await loadChatBox(incidentId, chattype, chatBox)
    });

    $(document).on('change', '#type', async function (event) {
        chattype = $('#type').val();
        $('#chat_title').text("Incident #" + incidentId + ": " + chattype + " chat");
        const chatBox = $('#chat_box');
        await loadChatBox(incidentId, chattype, chatBox)
    });

    $(document).on('click', '#send-message-button', async function (event) {
        const messageBox = $('#message_box');
        const message = messageBox.val();
        const chatBox = $('#chat_box');
        await submitMessage(incidentId, message, sender, chattype, chatBox, messageBox);
    });

    const session = await getSession();
    console.log(session);
    sender = session.user.username;
    await loadIncidentSelector();
});