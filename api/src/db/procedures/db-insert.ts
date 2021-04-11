import {DbRequest} from "../db-request";
import {User, UserJsonSerializer} from "@kashw2/lib-ts";
import {Either} from "funfix-core";
import {List} from "immutable";

export class DbInsert {

    constructor(readonly requests: DbRequest) {
    }

    insertUser(user: User): (username: string) => Promise<Either<string, User>> {
        return (modifiedBy: string): Promise<Either<string, User>> => {
            return this.requests.sendRequestSerialized('ssp_json_InsertUser', List.of(`@Json = '${UserJsonSerializer.instance.toJsonString(user)}'`, `@ModifiedBy = '${modifiedBy}'`), UserJsonSerializer.instance)
        }
    }

}
