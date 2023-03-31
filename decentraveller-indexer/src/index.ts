import { mainServerAdapter } from "./contract-configs/adapters/MainServerAdapter";
import { EventRequest } from "./contract-configs/adapters/types";
import { eventsToListen, provider } from "./contract-configs/config";

eventsToListen.forEach(({ contract, eventName, transformer }) => {
    console.log("Registering contract on", eventName);
    contract.on(eventName, async (...event) => {
        console.log(event);
        const eventRequest = transformer.transformEvent(event);
        await mainServerAdapter.makeRequest(eventRequest);
    });
});

provider.on("block", () => console.log("new block listened"));
