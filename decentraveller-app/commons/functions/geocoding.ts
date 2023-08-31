import { GeocodingElementResponse, GeocodingResponse } from '../../api/response/geocoding';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import {apiAdapter} from "../../api/apiAdapter";
import { PickerItem } from '../types';
import React from 'react';

const adapter = apiAdapter;

const getAndParseGeocoding = async (
    addressText: string,
    setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    country?: string,
) => {
    setLoading(true);
    try {
        // const geocodingResponse: GeocodingResponse = await apiAdapter.getGeocoding(addressText, country);
        const geocodingResponse: GeocodingResponse = await adapter.getGeocoding(addressText, country);
        setItems(
            geocodingResponse.results.map((element: GeocodingElementResponse) => ({
                label: element.fullAddress,
                /* We stringify the object since and object type can't be the value type of a picker item. */
                value: JSON.stringify({
                    address: element.fullAddress,
                    latitude: element.latitude,
                    longitude: element.longitude,
                }),
            })),
        );
    } catch (e) {
        console.error('An error happened when trying to get geocoding.', e);
    } finally {
        setLoading(false);
    }
};

export { getAndParseGeocoding };
