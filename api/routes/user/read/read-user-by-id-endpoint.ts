import {Request, Response} from "express";
import {Either} from "funfix-core";
import {ApiUtils, idKey, User, UserJsonSerializer} from "../../../../core/src";
import {Database} from "../../../db/database";
import {GetEndpoint} from "../../get-endpoint";

export class ReadUserByIdEndpoint extends GetEndpoint {

    constructor(private db: Database) {
        super("/user/id/:id");
    }

    private getUser(userId: number): Either<string, User> {
        return this.db.cache.users.getByIdEither(userId);
    }

    private getUserId(req: Request): Either<string, number> {
        return ApiUtils.parseNumberFromPath(req, idKey);
    }

    isAuthorized(): boolean {
        return true;
    }

    async run(req: Request, res: Response): Promise<void> {
        this.getUserId(req)
            .map(uid => ApiUtils.sendSerializedResponse(this.getUser(uid), UserJsonSerializer.instance, res));
    }
}
