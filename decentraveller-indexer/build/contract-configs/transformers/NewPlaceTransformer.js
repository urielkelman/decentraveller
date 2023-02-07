"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPlaceTransformer = void 0;
const config_1 = require("../adapters/config");
const EventTransformer_1 = __importDefault(require("./EventTransformer"));
class NewPlaceTransformer extends EventTransformer_1.default {
    transformEvent(event) {
        return {
            endpoint: config_1.eventEndpoints.NEW_PLACE_ENDPOINT,
            body: {
                id: event[0].toNumber(),
                placeCreator: event[1],
                placeName: event[2],
                tourismField: event[3],
                latitude: event[4],
                longitude: event[5],
            },
        };
    }
}
const newPlaceTransformer = new NewPlaceTransformer();
exports.newPlaceTransformer = newPlaceTransformer;
