import {loadChatBox, loadChatSection, loadIncidentSelector, submitMessage} from "../chatManager.js";

let incidentId;
let chattype;
let sender = "admin"

$(document).ready(async function () {
    const loadChatButton = $('#load-chat-button');
    const chatSection = $('#messages');

    loadChatButton.on('click', async function () {
        chattype = "public";
        const incident = $('#incident').val();
        incidentId = incident;
        await loadChatSection(incident, sender, chattype);
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

    await loadIncidentSelector()
});