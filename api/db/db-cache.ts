import {Database} from "./database";
import {interval} from "rxjs";
import {List} from 'immutable';
import {UserCache, UserJsonSerializer} from "../../core/src";
import {NewsCache} from "../../core/src/models/news-cache";
import {News, NewsJsonSerializer} from "../../core/src/models/news";

export class DbCache {

    constructor(private db: Database) {
        this.start5MinuteCache();

        interval(300000)
            .subscribe(() => this.start5MinuteCache());
    }

    news: NewsCache = new NewsCache(List());
    users: UserCache = new UserCache(List());

    async cacheNews(): Promise<void> {
        this.db.requests.sendRequestListSerialized('ssp_json_GetNews', List.of(), NewsJsonSerializer.instance)
            .then(result => {
                result.forEach(x => {
                    this.news = new NewsCache(x);
                    console.log(`Cached ${x.size} News Articles`);
                });
            });
    }

    async cacheUsers(): Promise<void> {
        this.db.requests.sendRequestListSerialized('ssp_json_GetUsers', List.of(), UserJsonSerializer.instance)
            .then(result => {
                result.forEach(x => {
                    this.users = new UserCache(x);
                    console.log(`Cached ${x.size} Users`);
                });
            });
    }

    start5MinuteCache(): void {
        Promise.resolve([
            this.cacheUsers(),
            this.cacheNews(),
        ]);
    }

}
