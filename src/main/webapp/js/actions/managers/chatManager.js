import {clearHtml} from "../../utility/utility.js";
import {getIncidentsList} from "../../ajax/ajaxLists.js";
import {getChatTypes, getMessages, sendMessage} from "../../ajax/ajaxChat.js";
import {ErrorMessage} from "../../utility/ErrorMessage.js";

let errorMessage;

export async function loadChatBox(incidentId, chattype, username, chatBox) {
    console.log(incidentId, chattype);
    const messages = await getMessages(incidentId, chattype, username);
    console.log(messages);
    const chatContent = messages.data.map(message =>
        `${message.sender}: ${message.message}`
    ).join('\n');
    chatBox.val(chatContent);
}

export async function loadChatSection(incidentId, sender, recipient) {
    async function generateChatTypesOptions(chattypes) {
        if (!chattypes.data.length)
            return `<label class="note">No chat types found</label>`;

        const chatTypesOptions = [];
        chattypes.data.forEach(chatType => {
            const {username} = chatType;
            chatTypesOptions.push(
                `<option ${username === "public" ? "selected" : ""} value="${username}">${username}</option>`
            );
        });

        return chatTypesOptions.join('\n');
    }

    async function generateMessageBox(chattype) {
        const {canSend} = chattype;
        if (canSend)
            return (`
                <h4>Send a message</h4>
                <textarea class="big-text-box"
                          id="message_box"
                          name="message_box"></textarea>
                <p id="message_status"></p>
                <button id="send-message-button">Send</button>
            `)
        return "";
    }

    console.log(incidentId);
    const chattypes = await getChatTypes(sender, incidentId);
    console.log(chattypes);
    const chattype = chattypes.data.filter(ct => ct.username === recipient)?.[0];
    console.log(chattype)
    $('#messages').html(`
        <span id="chat-selector">
            <h4>Select chat</h4>
            <select autoComplete="type"
                    class="form-select"
                    id="type"
                    name="type"
                    required
            >
                    ${await generateChatTypesOptions(chattypes)}
            </select>
        </span>
        <h4 id="chat_title">${"Incident #" + incidentId + ": " + recipient + " chat"}</h4>
        <textarea class="giant-text-box"
                  id="chat_box"
                  name="chat_box"
                  readOnly></textarea>
        ${await generateMessageBox(chattype)}
    `);

    errorMessage = new ErrorMessage("message_status");
}

export async function submitMessage(incidentId, message, sender, recipient, chatBox, messageBox) {
    const result = await sendMessage(incidentId, message, sender, recipient);
    if (!result.success) {
        errorMessage.showError(result.message);
        return;
    }

    errorMessage.hideError();
    await loadChatBox(incidentId, recipient, sender, chatBox);
    messageBox.val("")
    const sound = new Audio('/E199_war_exploded/media/pop.mp3');
    sound.play().catch(error => console.error("Error playing sound:", error));
}

export async function loadIncidentSelector() {
    const incidentSelector = $('#incident-selector');
    clearHtml(incidentSelector);

    console.log("loading selector");
    const incidentsList = await getIncidentsList();
    console.log(incidentsList);
    if (!incidentsList.data.length) {
        incidentSelector.html(`
            <label class="note">No incidents found</label>
        `);
        return;
    }

    const incidentSelectorOptions = [
        `<option disabled value="">Select an incident</option>`
    ];
    incidentsList.data.forEach(incident => {
        const {incident_id, incident_type} = incident;
        incidentSelectorOptions.push(
            `<option value="${incident_id}">${incident_id} (${incident_type})</option>`
        );
    });

    incidentSelector.html(`
        <h4>Select incident</h4>
        <select autocomplete="incident"
                class="form-select"
                id="incident"
                name="incident"
                required
        >
            ${incidentSelectorOptions.join('\n')}
        </select>
    `);
}