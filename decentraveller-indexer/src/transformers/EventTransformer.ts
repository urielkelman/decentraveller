import { EventRequest, EventRequestBody } from "../adapters/types";

abstract class EventTransformer<T extends EventRequestBody> {
    public abstract transformEvent(...event: Array<any>): EventRequest<T>;
}

export default EventTransformer;
