import { mainServerAdapter } from "./adapters/MainServerAdapter";
import { eventsToListen, provider } from "./contract-configs/config";

eventsToListen.forEach(({ contract, eventName, transformer }) => {
    console.log("Registering to listen event named:", eventName);
    contract.on(eventName, async (...event) => {
        // console.log(event);
        const eventRequest = transformer.transformEvent(event);
        await mainServerAdapter.makeRequest(eventRequest);
    });
});

provider.on("block", () => console.log("new block listened"));
