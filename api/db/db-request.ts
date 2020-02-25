import {Database} from "./database";
import {ConnectionPool, IRecordSet} from "mssql";
import {List} from 'immutable';
import {Either, Left} from "funfix-core";
import {getJsonFromRecordSet, SimpleJsonSerializer} from "../../core/src";

export class DbRequest {

    private connection: Promise<ConnectionPool>;

    constructor(private db: Database) {
        this.connection = this.db.getConnection();
    }

    async sendRequest(procedure: string, params: List<string>): Promise<Either<string, IRecordSet<any>>> {
        const connection = await this.connection;
        const result = await connection.request()
            .query(`${procedure} ${params.join(',').trim()}`);
        // recordsets always exists whereas recordset only exists if a dataset is returned
        if (result.recordsets.length < 1) {
            return Left('No data');
        }
        return getJsonFromRecordSet(result.recordset);
    }

    async sendRequestList<A>(procedure: string, params: List<string>): Promise<Either<string, List<any>>> {
        const connection = await this.connection;
        const result = await connection.request()
            .query(`${procedure} ${params.join(', ').trim()}`);
        if (!result.recordsets) {
            return Left('No data');
        }
        return getJsonFromRecordSet(result.recordset)
            .map(x => List(x));
    }

    async sendRequestListSerialized<A>(procedure: string, params: List<string>, serializer: SimpleJsonSerializer<A>): Promise<Either<string, List<A>>> {
        const result = await this.sendRequestList(procedure, params);
        if (result.isLeft()) {
            return Left(result.value);
        }
        return result.map(x => serializer.fromJsonArray(x));
    }

    async sendRequestSerialized<A>(procedure: string, params: List<string>, serializer: SimpleJsonSerializer<A>): Promise<Either<string, A>> {
        const response = await this.sendRequest(procedure, params);
        return response.map(x => serializer.fromJson(x));
    }

}
