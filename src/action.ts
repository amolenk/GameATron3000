/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { RoomObject } from './room-object'

export class Action {

    public static GiveVerb: string = "Give";
    public static PickUpVerb: string = "Pick up";
    public static UseVerb: string = "Use";
    public static OpenVerb: string = "Open";
    public static LookAtVerb: string = "Look at";
    public static PushVerb: string = "Push";
    public static CloseVerb: string = "Close";
    public static TalkToVerb: string = "Talk to";
    public static PullVerb: string = "Pull";

    public subjects: Array<RoomObject>;

    constructor(public displayName: string, private subjectSeparator?: string) {
        this.subjects = new Array<RoomObject>();
    }

    public addSubject(roomObject: RoomObject): boolean {

        // Only add the subject if it differs from the first subject (if any).
        if (this.subjects.length == 0 || this.subjects[0] != roomObject) {
            this.subjects.push(roomObject);
        }

        return this.subjects.length == (this.subjectSeparator != null ? 2 : 1);
    }

    public getDisplayText(roomObject?: RoomObject): string {

        // Ignore the current room object that the mouse is over if it's the same as
        // the first subject (if any).
        if (this.subjects.length == 1 && this.subjects[0] == roomObject) {
            roomObject = null;
        }

        if (this.subjects.length == 2) {
            return `${this.displayName} ${this.subjects[0].DisplayName} ${this.subjectSeparator} ${this.subjects[1].DisplayName}`;
        }

        if (this.subjects.length == 1) {

            if (roomObject != null) {
                return `${this.displayName} ${this.subjects[0].DisplayName} ${this.subjectSeparator} ${roomObject.DisplayName}`;
            }

            if (this.subjectSeparator != null) {
                return `${this.displayName} ${this.subjects[0].DisplayName} ${this.subjectSeparator}`;
            }

            return `${this.displayName} ${this.subjects[0].DisplayName}`;
        }

        if (this.subjects.length == 0 && roomObject != null) {
            return `${this.displayName} ${roomObject.DisplayName}`;
        }

        return this.displayName;
    }
}
