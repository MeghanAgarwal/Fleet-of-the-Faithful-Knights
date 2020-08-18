import {None, Option, Some} from "funfix-core";
import {
    avatarKey,
    discordIdKey,
    discriminatorKey,
    groupKey,
    idKey,
    localeKey,
    memberSinceKey,
    permissionsKey,
    tokenKey,
    usernameKey
} from "../misc/json-keys";
import {parseNumber, parseSerializedSet, parseString} from "../util/object-utils";
import {JsonBuilder} from "../misc/json-builder";
import {SimpleJsonSerializer} from "../misc/simple-json-serializer";
import {Set} from "immutable";
import {Enum, EnumJsonSerializer} from "./enum";


export class User {

    constructor(
        private id: Option<number> = None,
        private discordId: Option<string> = None,
        private discriminator: Option<string> = None,
        private username: Option<string> = None,
        private locale: Option<string> = Some("en-US"),
        private avatar: Option<string> = None,
        private token: Option<string> = None,
        private group: Option<string> = None,
        private permissions: Set<Enum> = Set(),
        private memberSince: Option<string> = None,
    ) {
    }

    public static withoutToken(user: User): User {
        return new User(
            user.getId(),
            user.getDiscordId(),
            user.getDiscriminator(),
            user.getUsername(),
            user.getLocale(),
            user.getAvatar(),
            None,
            user.getGroup(),
            user.getPermissions(),
            user.getMemberSince(),
        );
    }

    public getAvatar(): Option<string> {
        return this.avatar;
    }

    public getDiscordId(): Option<string> {
        return this.discordId;
    }

    public getDiscriminator(): Option<string> {
        return this.discriminator;
    }

    public getGroup(): Option<string> {
        return this.group;
    }

    public getId(): Option<number> {
        return this.id;
    }

    public getLocale(): Option<string> {
        return this.locale;
    }

    public getMemberSince(): Option<string> {
        return this.memberSince;
    }

    public getPermissions(): Set<Enum> {
        return this.permissions;
    }

    public getToken(): Option<string> {
        return this.token;
    }

    public getUsername(): Option<string> {
        return this.username;
    }

    public hasAllPermissions(...permissions: number[]): boolean {
        return permissions.every(p => this.hasPermission(p));
    }

    public hasOneOfPermissions(...permissions: number[]): boolean {
        return permissions.some(p => this.hasPermission(p));
    }

    public hasPermission(permission: number): boolean {
        return this.getPermissions()
            .every(p => p.getId().contains(permission));
    }

    public isCompanionAtArms(): boolean {
        return this.getGroup()
            .contains("Companion at Arms");
    }

    public isDeveloper(): boolean {
        return this.getGroup()
            .contains("Developer");
    }

    public isEmpty(): boolean {
        return this.getId().isEmpty()
            && this.getDiscordId().isEmpty()
            && this.getUsername().isEmpty()
            && this.getLocale().isEmpty()
            && this.getAvatar().isEmpty()
            && this.getToken().isEmpty()
            && this.getDiscriminator().isEmpty()
            && this.getGroup().isEmpty()
            && this.getMemberSince().isEmpty();
    }

    public isGenericKnight(): boolean {
        return this.isKnightCommander()
            || this.isKnightLieutenant()
            || this.isKnight();
    }

    public isGenericSergeant(): boolean {
        return this.isSergeantFirstClass()
            || this.isSergeant();
    }

    public isGrandMaster(): boolean {
        return this.getGroup()
            .contains("Grand Master");
    }

    public isGuest(): boolean {
        return !this.isDeveloper()
            && !this.isGrandMaster()
            && !this.isMasterCommander()
            && !this.isKnightCommander()
            && !this.isKnightLieutenant()
            && !this.isKnight()
            && !this.isSergeantFirstClass()
            && !this.isSergeant()
            && !this.isSquire()
            && !this.isCompanionAtArms();
    }

    public isKnight(): boolean {
        return this.getGroup()
            .contains("Knight");
    }

    public isKnightCommander(): boolean {
        return this.getGroup()
            .contains("Knight Commander");
    }

    public isKnightLieutenant(): boolean {
        return this.getGroup()
            .contains("Knight Lieutenant");
    }

    public isMasterCommander(): boolean {
        return this.getGroup()
            .contains("Master Commander");
    }

    public isSergeant(): boolean {
        return this.getGroup()
            .contains("Sergeant");
    }

    public isSergeantFirstClass(): boolean {
        return this.getGroup()
            .contains("Sergeant First Class");
    }

    public isSpecial(): boolean {
        return this.isDeveloper()
            || this.isGrandMaster()
            || this.isMasterCommander()
            || this.isKnightCommander();
    }

    public isSquire(): boolean {
        return this.getGroup()
            .contains("Squire");
    }

    public isUnverifiedDeveloper(): boolean {
        return this.getGroup()
            .contains("Developer (Unverified)");
    }

}

export class UserJsonSerializer extends SimpleJsonSerializer<User> {

    static instance: UserJsonSerializer = new UserJsonSerializer();

    fromJson(json: any): User {
        return new User(
            parseNumber(json[idKey]),
            parseString(json[discordIdKey]),
            parseString(json[discriminatorKey]),
            parseString(json[usernameKey]),
            parseString(json[localeKey]),
            parseString(json[avatarKey]),
            parseString(json[tokenKey]),
            parseString(json[groupKey]),
            parseSerializedSet(json[permissionsKey], EnumJsonSerializer.instance),
            parseString(json[memberSinceKey]),
        );
    }

    toJson(value: User, builder: JsonBuilder): object {
        return builder
            .addOptional(value.getId(), idKey)
            .addOptional(value.getDiscordId(), discordIdKey)
            .addOptional(value.getDiscriminator(), discriminatorKey)
            .addOptional(value.getUsername(), usernameKey)
            .addOptional(value.getAvatar(), avatarKey)
            .addOptional(value.getToken(), tokenKey)
            .addOptional(value.getLocale(), localeKey)
            .addOptional(value.getGroup(), groupKey)
            .addSetSerialized(value.getPermissions(), permissionsKey, EnumJsonSerializer.instance)
            .addOptional(value.getMemberSince(), memberSinceKey)
            .build();
    }

}