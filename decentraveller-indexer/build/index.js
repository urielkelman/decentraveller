"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
const MainServerAdapter_1 = require("./contract-configs/adapters/MainServerAdapter");
const config_1 = require("./contract-configs/config");
config_1.eventsToListen.forEach(({ contract, eventName, transformer }) => {
    console.log("Registering contract on", eventName);
    contract.on(eventName, (...event) =>
        __awaiter(void 0, void 0, void 0, function* () {
            console.log(event);
            const eventRequest = transformer.transformEvent(event);
            yield MainServerAdapter_1.mainServerAdapter.makeRequest(
                eventRequest
            );
        })
    );
});
config_1.provider.on("block", () => console.log("new block listened"));
