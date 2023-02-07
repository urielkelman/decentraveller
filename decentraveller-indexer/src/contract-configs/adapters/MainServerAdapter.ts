import { EventRequest } from "./types";

class MainServerAdapter {
    public async makeRequest(eventRequest: EventRequest) {
        console.log(
            `Making request to main server with request: ${JSON.stringify(
                eventRequest
            )}`
        );
    }
}

const mainServerAdapter = new MainServerAdapter();

export { mainServerAdapter };
