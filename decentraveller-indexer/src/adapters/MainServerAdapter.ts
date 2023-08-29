import axios, { AxiosRequestConfig } from "axios";

import { EventRequest, EventRequestBody } from "./types";
import AxiosRequestBuilder from "./AxiosRequestBuilder";

const indexerApiKey = process.env.INDEXER_API_KEY;

class MainServerAdapter {
    public async makeRequest<T extends EventRequestBody>(
        eventRequest: EventRequest<T>
    ) {
        const axiosRequest: AxiosRequestConfig = new AxiosRequestBuilder()
            .withBody(eventRequest.body)
            .withMethod(eventRequest.method)
            .withUrl(eventRequest.endpoint)
            .withHeaders({ Authorization: `Bearer ${indexerApiKey}` })
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
