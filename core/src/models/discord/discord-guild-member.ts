import {None, Option} from "funfix-core";
import {User, UserJsonSerializer} from "../user";
import {List} from "immutable";
import {JsonBuilder, parseList, parseSerialized, rolesKey, SimpleJsonSerializer, userKey} from "../..";
import {DiscordUser, DiscordUserJsonSerilaizer} from "./discord-user";

export class DiscordGuildMember {

    constructor(
        readonly user: Option<DiscordUser> = None,
        readonly roles: List<string> = List(),
    ) {
    }

    getUser(): Option<DiscordUser> {
        return this.user;
    }

    getRoles(): List<string> {
        return this.roles;
    }

    withRole(role: string): DiscordGuildMember {
        return new DiscordGuildMember(
            this.getUser(),
            List.of(role)
        )
    }

}

export class DiscordGuildMemberJsonSerializer extends SimpleJsonSerializer<DiscordGuildMember> {

    static instance: DiscordGuildMemberJsonSerializer = new DiscordGuildMemberJsonSerializer();

    fromJson(json: any): DiscordGuildMember {
        return new DiscordGuildMember(
            parseSerialized(json[userKey], DiscordUserJsonSerilaizer.instance),
            parseList(json[rolesKey]),
        )
    }

    toJsonImpl(value: DiscordGuildMember, builder: JsonBuilder): object {
        return builder.addOptionalSerialized(value.getUser(), userKey, DiscordUserJsonSerilaizer.instance)
            .addList(value.getRoles(), rolesKey)
            .build();
    }


}
