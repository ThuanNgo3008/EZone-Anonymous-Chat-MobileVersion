import * as signalR from "@microsoft/signalr";
import { HUB_URL } from "../constants/config";

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
        .withUrl(`${HUB_URL}?userId=${userId}`)
        .withAutomaticReconnect()
        .build();
}