import * as signalR from "@microsoft/signalr";

export function createChatConnection() {
    const params = new URLSearchParams(window.location.search);

    let userId = params.get("userId");

    if (userId) {
        localStorage.setItem("userId", userId);
    } else {
        userId = localStorage.getItem("userId");
    }

    console.log("SignalR userId:", userId);

    return new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:44352/chatHub?userId=${userId}`)
        .withAutomaticReconnect()
        .build();
}