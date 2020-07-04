import {Injectable} from "@angular/core";
import {None, Option} from "funfix-core";
import {List} from "immutable";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../../core/src";
import {Candidate} from "../../../../core/src/models/candidate";
import {News} from "../../../../core/src/models/news";
import {Vote} from "../../../../core/src/models/vote";
import {DiscordMessage} from "../../../../core/src/models/discord/discord-message";

@Injectable({
  providedIn: "root",
})
export class UserStateService {

  constructor(private cookieService: CookieService) {
  }

  candidates: BehaviorSubject<List<Candidate>> = new BehaviorSubject<List<Candidate>>(List());
  discordMessages: BehaviorSubject<List<DiscordMessage>> = new BehaviorSubject<List<DiscordMessage>>(List());
  news: BehaviorSubject<List<News>> = new BehaviorSubject<List<News>>(List());
  user: BehaviorSubject<Option<User>> = new BehaviorSubject<Option<User>>(None);
  users: BehaviorSubject<List<User>> = new BehaviorSubject<List<User>>(List());
  votes: BehaviorSubject<List<Vote>> = new BehaviorSubject<List<Vote>>(List());

  getCandidates(): List<Candidate> {
    return this.candidates
      .getValue();
  }

  getCookieToken(): string {
    return this.cookieService.get("token");
  }

  getDiscordMessages(): List<DiscordMessage> {
    return this.discordMessages
      .getValue();
  }

  getNews(): List<News> {
    return this.news
      .getValue();
  }

  getUser(): Option<User> {
    return this.user
      .getValue();
  }

  getUsers(): List<User> {
    return this.users
      .getValue();
  }

  getVotes(): List<Vote> {
    return this.votes
      .getValue();
  }

  isCookieSet(): boolean {
    return this.cookieService.check("token");
  }

  isLoggedIn(): boolean {
    return this.getUser()
      .nonEmpty();
  }

}