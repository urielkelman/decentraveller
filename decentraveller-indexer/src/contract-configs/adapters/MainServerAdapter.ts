import axios, { AxiosRequestConfig } from "axios";

import { EventRequest, EventRequestBody } from "./types";
import AxiosRequestBuilder from "./AxiosRequestBuilder";

class MainServerAdapter {
    public async makeRequest<T extends EventRequestBody>(
        eventRequest: EventRequest<T>
    ) {
        const axiosRequest: AxiosRequestConfig = new AxiosRequestBuilder()
            .withBody(eventRequest.body)
            .withMethod(eventRequest.method)
            .withUrl(eventRequest.endpoint)
            .build();

        // console.log("Axios request:", axiosRequest);

        try {
            await axios.request(axiosRequest);
            // const response = await axios.request(axiosRequest);
            // console.log(response);
        } catch (error) {
            console.log("An error happened", error);
        }
    }
}

const mainServerAdapter = new MainServerAdapter();

export { mainServerAdapter };
