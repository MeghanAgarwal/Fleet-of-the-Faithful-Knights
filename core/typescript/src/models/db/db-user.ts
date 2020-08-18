import {Option} from "funfix-core";
import {User} from "../user";
import { DiscordGuildMember } from "../discord/discord-guild-member";
import { GroupUtils } from "../../util/group-utils";
import { SimpleJsonSerializer } from "../../misc/simple-json-serializer";
import { JsonBuilder } from "../../misc/json-builder";
import { usernameKey, discordIdKey, discriminatorKey, localeKey, groupIdKey, avatarKey } from "../../misc/json-keys";

export class DbUser {

    constructor(
        private username: string,
        private discordId: string,
        private discriminator: string,
        private groupId: number,
        private avatar: string,
        private locale: string = "en-US",
    ) {
    }

    static fromDiscordGuildMember(guildMember: DiscordGuildMember): Option<DbUser> {
        return Option.map5(
            guildMember.getUser().flatMap(u => u.getId()),
            guildMember.getUser().flatMap(u => u.getDiscriminatorWithSymbol()),
            guildMember.getUser().flatMap(u => u.getUsername()),
            guildMember.getUser().flatMap(u => u.getRequestFormedAvatarUrl()),
            guildMember.getUser().flatMap(u => u.getLocale()),
            (discordId, discriminator, username, avatar, locale) => {
                return new DbUser(
                    username,
                    discordId,
                    discriminator,
                    GroupUtils.getGroupIdFromName(GroupUtils.parseGroup(guildMember.getRolesSortedHierarchy().first())),
                    avatar,
                    locale,
                );
            },
        );
    }

    static fromUser(user: User): Option<DbUser> {
        return Option.map6(
            user.getDiscordId(),
            user.getDiscriminator(),
            user.getUsername(),
            user.getGroup(),
            user.getAvatar(),
            user.getLocale(),
            (discordId, discriminator, username, group, avatar, locale) => {
                return new DbUser(
                    username,
                    discordId,
                    discriminator,
                    GroupUtils.getGroupIdFromName(GroupUtils.parseGroup(group)),
                    avatar,
                    locale,
                );
            },
        );
    }

    getAvatar(): string {
        return this.avatar;
    }

    getDiscordId(): string {
        return this.discordId;
    }

    getDiscriminator(): string {
        return this.discriminator;
    }

    getGroupId(): number {
        return this.groupId;
    }

    getLocale(): string {
        return this.locale;
    }

    getUsername(): string {
        return this.username;
    }

}

export class DbUserJsonSerializer extends SimpleJsonSerializer<DbUser> {

    static instance: DbUserJsonSerializer = new DbUserJsonSerializer();

    fromJson(json: any): DbUser {
        throw new Error("Db classes are read only");
    }

    toJson(value: DbUser, builder: JsonBuilder): object {
        return builder.add(value.getUsername(), usernameKey)
            .add(value.getDiscordId(), discordIdKey)
            .add(value.getDiscriminator(), discriminatorKey)
            .add(value.getAvatar(), avatarKey)
            .add(value.getGroupId(), groupIdKey)
            .add(value.getLocale(), localeKey)
            .build();
    }

}