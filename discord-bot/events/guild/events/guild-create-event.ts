import {Client} from "discord.js";
import {EventManager} from "../../event-manager";

export class GuildCreateEvent extends EventManager {

    constructor(readonly client: Client) {
        super(client);
        console.log(`Initialised ${GuildCreateEvent.name}`);
    }

    initialiseEvent(): void {
        this.clientManager.getClient()
            .on("guildCreate", guild => {

            });
    }

}