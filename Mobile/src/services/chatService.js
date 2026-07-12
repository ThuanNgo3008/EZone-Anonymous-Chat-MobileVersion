import * as signalR from '@microsoft/signalr';
import { HUB_URL } from '../constants/config';

export function createChatConnection(userId) {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_URL}?userId=${userId}`)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
}
