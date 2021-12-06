class Time {
    public static fromString(str: string): Time {
        const [hours, minutes] = str.split(':');

        return new Time(
            parseInt(hours, 10),
            parseInt(minutes, 10),
        );
    }
    public constructor(
        public readonly hours: number,
        public readonly minutes: number,
    ) {}

    public get rawMinutes(): number {
        return this.hours * 60 + this.minutes;
    }

    public isBefore(time: Time): boolean {
        return this.hours < time.hours || (this.hours === time.hours && this.minutes < time.minutes);
    }

    public isAfter(time: Time): boolean {
        return this.hours > time.hours || (this.hours === time.hours && this.minutes > time.minutes);
    }

    public isSame(time: Time): boolean {
        return this.hours === time.hours && this.minutes === time.minutes;
    }

    public isSameOrAfter(time: Time): boolean {
        return this.isSame(time) || this.isAfter(time);
    }

    public isSameOrBefore(time: Time): boolean {
        return this.isSame(time) || this.isBefore(time);
    }

    public min(time: Time): Time {
        if (this.isSameOrBefore(time)) {
            return this.clone();
        } else {
            return time.clone();
        }
    }

    public max(time: Time): Time {
        if (this.isSameOrAfter(time)) {
            return this.clone();
        } else {
            return time.clone();
        }
    }

    public isWithin(period: Period): boolean {
        return this.isSameOrAfter(period.from) && this.isSameOrBefore(period.to);
    }

    public compareTo(time: Time): -1 | 0 | 1 {
        if (this.isBefore(time)) {
            return -1;
        } else if (this.isAfter(time)) {
            return 1;
        } else {
            return 0;
        }
    }

    public clone(): Time {
        return new Time(this.hours, this.minutes);
    }
}

class Period {
    public static fromStringTimes(times: [string, string]): Period {
        return new Period(
            Time.fromString(times[0]),
            Time.fromString(times[1]),
        );
    }

    public constructor(
        public readonly from: Time,
        public readonly to: Time,
    ) {}

    public get lengthMinutes(): number {
        return this.to.rawMinutes - this.from.rawMinutes;
    }

    public overlaps(period: Period): boolean {
        return this.from.isWithin(period) || this.to.isWithin(period);
    }

    public mergeWith(overlappingPeriod: Period): Period {
        if (!this.overlaps(overlappingPeriod)) {
            throw new Error('Cannot merge periods that do no overlap');
        }

        return new Period(
            this.from.min(overlappingPeriod.from),
            this.to.max(overlappingPeriod.to),
        );
    }

    public compareTo(period: Period): -1 | 0 | 1 {
        const result = this.from.compareTo(period.from);

        if (result !== 0) {
            return result;
        }

        if (this.lengthMinutes < period.lengthMinutes) {
            return -1;
        } else if (this.lengthMinutes > period.lengthMinutes) {
            return 1;
        } else {
            return 0;
        }
    }
}

class Calendar {
    public static fromJSON(
        events: [string, string][],
        availability: [string, string],
    ) {
        return new Calendar(
            events.map((e) => Period.fromStringTimes(e)),
            Period.fromStringTimes(availability),
        );
    }

    public constructor(
        public events: Period[],
        public availability: Period,
    ) {}

    public get freeSlots(): Period[] {
        const slots: Period[] = [];

        if (this.events.length === 0) {
            return [this.availability];
        }

        if (this.events[0].from.isAfter(this.availability.from)) {
            slots.push(new Period(
                this.availability.from,
                this.events[0].from,
            ));
        }

        for (let i = 1; i < this.events.length; i++) {
            const current = this.events[i];
            const previous = this.events[i - 1];

            if (current.from.isAfter(previous.to)) {
                slots.push(new Period(previous.to, current.from));
            }
        }

        const lastEvent = this.events[this.events.length - 1];

        if (lastEvent.to.isBefore(this.availability.to)) {
            slots.push(new Period(
                lastEvent.to,
                this.availability.to,
            ));
        }

        return slots;
    }

    public mergeWith(calendar: Calendar) {
        const latestStart = this.availability.from.max(calendar.availability.from);
        const soonestEnd = this.availability.to.min(calendar.availability.to);
        const mergedAvailability = new Period(latestStart, soonestEnd);
        const allEvents = [...this.events, ...calendar.events].sort((a, b) => a.compareTo(b));
        const combinedEvents: Period[] = [];

        for (const event of allEvents) {
            if (combinedEvents.length === 0) {
                combinedEvents.push(event);
            } else {
                const last = combinedEvents[combinedEvents.length - 1];

                if (last.overlaps(event)) {
                    combinedEvents.pop();
                    combinedEvents.push(last.mergeWith(event));
                } else {
                    combinedEvents.push(event);
                }
            }
        }

        return new Calendar(
            combinedEvents,
            mergedAvailability,
        );
    }
}

const eventsOne = JSON.parse('[["9:00","10:30"],["12:00","13:00"],["16:00","18:00"]]') as [string, string][];
const availabilityOne = JSON.parse('["9:00","20:00"]') as [string, string];
const eventsTwo = JSON.parse('[["10:00","11:30"],["12:30","14:30"],["14:30","15:00"],["16:00","17:00"]]') as [string, string][];
const availabilityTwo = JSON.parse('["10:00","18:30"]') as [string, string];
const durationMinutes = 30;

const calendarA = Calendar.fromJSON(eventsOne, availabilityOne);
const calendarB = Calendar.fromJSON(eventsTwo, availabilityTwo);
const mergedCalendars = calendarA.mergeWith(calendarB);
const availableSlots = mergedCalendars.freeSlots.filter((slot) => slot.lengthMinutes >= durationMinutes);

console.log(JSON.stringify(availableSlots, null, 2));
