import { EventRequest } from "../adapters/types";

abstract class EventTransformer {
    public abstract transformEvent(...event: Array<any>): EventRequest;
}

export default EventTransformer;
