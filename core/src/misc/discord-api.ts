import * as axios from "axios";
import {Either, Left, None, Option, Right} from "funfix-core";
import {List} from "immutable";
import * as querystring from "querystring";
import {accessTokenKey, expiresInKey, parseNumber, parseString, refreshTokenKey, scopeKey, tokenTypeKey,} from "..";
import {DiscordGuild, DiscordGuildJsonSerializer} from "../models/discord/discord-guild";
import {DiscordGuildMember, DiscordGuildMemberJsonSerializer} from "../models/discord/discord-guild-member";
import {DiscordUser, DiscordUserJsonSerilaizer} from "../models/discord/discord-user";
import {JsonBuilder} from "./json-builder";
import {SimpleJsonSerializer} from "./simple-json-serializer";

export class DiscordApi {

    static getDiscordApiUrl(): string {
        return "https://discordapp.com/api";
    }

    static getDiscordPanelBotToken(): string {
        // TODO: Make this an Either
        return process.env.FFK_DISCORD_PANEL_BOT_TOKEN!;
    }

    static getGuildMember(userId: string, guildId: string, accessToken: string): Promise<Either<string, DiscordGuildMember>> {
        return axios.default.get("https://discordapp.com/api/guilds/539188746114039818/members/178140794555727872", {
            headers: {
                Authorization: `Bot ${this.getDiscordPanelBotToken()}`,
                access_token: accessToken,
            },
        })
            .then(x => Right(DiscordGuildMemberJsonSerializer.instance.fromJson(x.data)))
            .catch(x => Left(x));
    }

    static getOAuth(clientId: string, clientSecret: string, code: string): Promise<Either<string, DiscordOAuthResponse>> {
        return axios.default.post(this.getTokenRequestUrl(), querystring.encode({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            // tslint:disable-next-line
            code: code,
            redirect_uri: "http://localhost:4200/sso",
            scope: "identify guilds",
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(x => Right(DiscordOAuthResponseJsonSerializer.instance.fromJson(x.data)))
            .catch(x => Left(x));
    }

    static getTokenRequestUrl(): string {
        return "https://discordapp.com/api/oauth2/token";
    }

    static getUser(accessCode: string): Promise<Either<string, DiscordUser>> {
        return axios.default.get(this.getDiscordApiUrl().concat("/users/@me"), {headers: {Authorization: `Bearer ${accessCode}`}})
            .then(x => Right(DiscordUserJsonSerilaizer.instance.fromJson(x.data)))
            .catch(x => Left(x));
    }

    static getUserGuilds(userId: string, accessCode: string): Promise<Either<string, List<DiscordGuild>>> {
        return axios.default.get(this.getDiscordApiUrl().concat("/users/@me/guilds"), {headers: {Authorization: `Bearer ${accessCode}`}})
            .then(x => Right(DiscordGuildJsonSerializer.instance.fromJsonArray(List(x.data))))
            .catch(x => Left(x));
    }

}

/**
 * This class should never find usage in the API cache
 * It is purely used for a one way transaction between the Discord API and the database
 */
export class DiscordOAuthResponse {

    constructor(
        readonly accessToken: Option<string> = None,
        readonly tokenType: Option<string> = None,
        readonly expiresIn: Option<number> = None,
        readonly refreshToken: Option<string> = None,
        readonly scope: Option<string> = None,
    ) {
    }

    getAccessToken(): Option<string> {
        return this.accessToken;
    }

    getExpiresIn(): Option<number> {
        return this.expiresIn;
    }

    getRefreshToken(): Option<string> {
        return this.refreshToken;
    }

    getScope(): Option<string> {
        return this.scope;
    }

    getTokenType(): Option<string> {
        return this.tokenType;
    }

}

/**
 * This class should never find usage in the API cache
 * It is purely used for a one way transaction between the Discord API and the database
 */
export class DiscordOAuthResponseJsonSerializer extends SimpleJsonSerializer<DiscordOAuthResponse> {

    static instance: DiscordOAuthResponseJsonSerializer = new DiscordOAuthResponseJsonSerializer();

    fromJson(json: any): DiscordOAuthResponse {
        return new DiscordOAuthResponse(
            parseString(json[accessTokenKey]),
            parseString(json[tokenTypeKey]),
            parseNumber(json[expiresInKey]),
            parseString(json[refreshTokenKey]),
            parseString(json[scopeKey]),
        );
    }

    toJson(value: DiscordOAuthResponse, builder: JsonBuilder): object {
        return builder.addOptional(value.getAccessToken(), accessTokenKey)
            .addOptional(value.getTokenType(), tokenTypeKey)
            .addOptional(value.getExpiresIn(), expiresInKey)
            .addOptional(value.getRefreshToken(), refreshTokenKey)
            .addOptional(value.getScope(), scopeKey)
            .build();
    }

}