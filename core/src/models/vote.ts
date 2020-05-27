import {None, Option, Some} from "funfix-core";
import {List, Set} from "immutable";
import {
    candidateKey,
    commentsKey,
    dateKey,
    groupKey,
    idKey,
    JsonBuilder,
    notesKey,
    parseBoolean,
    parseNumber,
    parseSerialized,
    parseSerializedList,
    parseSerializedSet,
    parseString,
    SimpleJsonSerializer,
    sponsorKey,
    statusKey,
    votersKey,
} from "..";
import {Candidate, CandidateJsonSerializer} from "./candidate";
import {Comment, CommentJsonSerializer} from "./comment";
import {User, UserJsonSerializer} from "./user";
import {Voter, VoterJsonSerializer} from "./voter";

export class Vote {

    constructor(
        readonly id: Option<number> = None,
        readonly sponsor: Option<User> = None,
        readonly candidate: Option<Candidate> = None,
        readonly group: Option<string> = None,
        readonly notes: Option<string> = None,
        readonly voters: Set<Voter> = Set(),
        readonly status: Option<boolean> = Some(false),
        readonly comments: List<Comment> = List(),
        readonly createdDate: Option<string> = None,
    ) {
    }

    public getCandidate(): Option<Candidate> {
        return this.candidate;
    }

    public getCandidateName(): Option<string> {
        return this.getCandidate()
            .flatMap(c => c.getDiscordUsername());
    }

    public getComments(): List<Comment> {
        return this.comments;
    }

    public getCreatedDate(): Option<string> {
        return this.createdDate;
    }

    public getGroup(): Option<string> {
        return this.group;
    }

    public getId(): Option<number> {
        return this.id;
    }

    public getNotes(): Option<string> {
        return this.notes;
    }

    public getSponsor(): Option<User> {
        return this.sponsor;
    }

    public getSponsorId(): Option<number> {
        return this.getSponsor()
            .flatMap(u => u.getId());
    }

    public getSponsorUsername(): Option<string> {
        return this.getSponsor()
            .flatMap(s => s.getUsername());
    }

    public getStatus(): Option<boolean> {
        return this.status;
    }

    public getVoters(): Set<Voter> {
        return this.voters;
    }

    public hasFailed(): boolean {
        return this.getStatus()
            .contains(false)
        && this.getVoters()
                .map(v => v.didDeny())
                .size > 4;
    }

    public hasPassed(): boolean {
        return this.getStatus()
            .contains(true);
    }

    public isCAAVote(): boolean {
        return this.getGroup()
            .contains("Companion at Arms");
    }

    public isEmpty(): boolean {
        return this.getId().isEmpty()
        && this.getSponsor().isEmpty()
        && this.getCandidate().isEmpty()
        && this.getGroup().isEmpty()
        && this.getNotes().isEmpty()
        && this.getVoters().isEmpty()
        && this.getStatus().isEmpty()
        && this.getComments().isEmpty()
        && this.getCreatedDate().isEmpty();
    }

    public isKnightCommanderVote(): boolean {
        return this.getGroup()
            .contains("Knight Commander");
    }

    public isKnightLieutenantVote(): boolean {
        return this.getGroup()
            .contains("Knight Lieutenant");
    }

    public isKnightVote(): boolean {
        return this.getGroup()
            .contains("Knight");
    }

    public isSergeantFirstClassVote(): boolean {
        return this.getGroup()
            .contains("Sergeant First Class");
    }

    public isSergeantVote(): boolean {
        return this.getGroup()
            .contains("Sergeant");
    }

    public isSquireVote(): boolean {
        return this.getGroup()
            .contains("Squire");
    }

    public shouldBeInKnightVoting(): boolean {
        return this.isKnightCommanderVote()
            || this.isKnightLieutenantVote()
            || this.isKnightVote();
    }

    public shouldBeInSergeantVoting(): boolean {
        return this.isSergeantFirstClassVote()
            || this.isSergeantVote();
    }

}

export class VoteJsonSerializer extends SimpleJsonSerializer<Vote> {

    static instance: VoteJsonSerializer = new VoteJsonSerializer();

    fromJson(json: any): Vote {
        return new Vote(
            parseNumber(json[idKey]),
            parseSerialized(json[sponsorKey], UserJsonSerializer.instance),
            parseSerialized(json[candidateKey], CandidateJsonSerializer.instance),
            parseString(json[groupKey]),
            parseString(json[notesKey]),
            parseSerializedSet(json[votersKey], VoterJsonSerializer.instance),
            parseBoolean(json[statusKey]),
            parseSerializedList(json[commentsKey], CommentJsonSerializer.instance),
            parseString(json[dateKey]),
        );
    }

    toJson(value: Vote, builder: JsonBuilder): object {
        return builder.addOptional(value.getId(), idKey)
            .addOptionalSerialized(value.getSponsor(), sponsorKey, UserJsonSerializer.instance)
            .addOptionalSerialized(value.getCandidate(), candidateKey, CandidateJsonSerializer.instance)
            .addOptional(value.getGroup(), groupKey)
            .addOptional(value.getNotes(), notesKey)
            .addSetSerialized(value.getVoters(), votersKey, VoterJsonSerializer.instance)
            .addOptional(value.getStatus(), statusKey)
            .addListSerialized(value.getComments(), commentsKey, CommentJsonSerializer.instance)
            .addOptional(value.getCreatedDate(), dateKey)
            .build();
    }

}
