import { apiRequest } from "./api";

export async function getMessages(roomId) {
    return await apiRequest(`/Message/${roomId}`);
}