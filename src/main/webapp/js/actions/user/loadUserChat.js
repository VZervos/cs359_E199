import {loadChatHistory, loadChatSection, loadIncidentSelector, submitMessage} from "../chatManager.js";

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
        await loadChatSection(incident);
        const chatBox = $('#chat_box');
        await loadChatHistory(incidentId, chattype, chatBox)
    });

    $(document).on('change', '#type', async function (event) {
        chattype = $('#type').val();
        $('#chat_title').text("Incident #" + incidentId + ": " + chattype + " chat");
        const chatBox = $('#chat_box');
        await loadChatHistory(incidentId, chattype, chatBox)
    });

    $(document).on('click', '#send-message-button', async function (event) {
        const message = $('#message_box').val();
        const chatBox = $('#chat_box');
        const messageBox = $('#message_box');
        await submitMessage(incidentId, message, sender, chattype, chatBox, messageBox);
    });

    await loadIncidentSelector()
});