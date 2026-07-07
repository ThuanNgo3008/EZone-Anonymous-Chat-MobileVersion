import { apiRequest } from "./api";

export async function createReport(data) {

    return await apiRequest("/ChatReports", {
        method: "POST",

        body: JSON.stringify(data)
    });
}