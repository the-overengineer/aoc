import '@core/polyfill';
import { Solution } from '@core/DaySolution';

type AmphipodType = 'A' | 'B' | 'C' | 'D';

interface Hall {
    occupant?: AmphipodType;
    x: number;
}

interface Room {
    x: number;
    roomType: AmphipodType;
    occupants: Array<AmphipodType | undefined>;
}

interface State {
    halls: Hall[];
    rooms: Room[];
}

type Cost = number;
type History = Set<string>;

// Ignore hall spaces above the rooms, those are not valid stopping points
// We care only about singular fluid moves between rooms and free spots,
// not each tiny sub-step
function parseState(rows: string[]): State {
    const halls: Hall[] = [];
    const rooms: Room[] = [];
    const actualRoomTypesOrdered: AmphipodType[] = ['A', 'B', 'C', 'D'];

    for (let y = 0; y < rows.length - 2; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            if (rows[y][x] === '.' && !/[A-D]/.test(rows[y + 1][x])) {
                halls.push({ x } as Hall);
            } else if (/[A-D]/.test(rows[y][x])) {
                const topOccupant = rows[y][x] as AmphipodType;
                const bottomOccupant = rows[y + 1][x] as AmphipodType;
                rooms.push({
                    x,
                    occupants: [topOccupant, bottomOccupant],
                    roomType: 'A', // We'll fix this,
                })
            }
        }
    }

    return {
        halls,
        rooms: rooms.map((room, idx) => ({
            ...room,
            roomType: actualRoomTypesOrdered[idx],
        })),
    };
}

function isDone(state: State) {
    return state.rooms.every(isRoomDone);
}

function isBetween(x: number, x1: number, x2: number) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);

    return x > minX && x < maxX;
}

function isMoveBlocked(state: State, x1: number, x2: number) {
    return state.halls.some((h) => h.occupant != null && isBetween(h.x, x1, x2));
}

const costPerMove: Record<AmphipodType, number> = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
};

function serialize(state: State): string {
    return JSON.stringify(state);
}

function isValidRoomToMoveInto(room: Room): boolean {
    // Empty rooms are always good
    if (room.occupants.every(_ => _ == null)) {
        return true;
    }

    // We don't touch solved rooms
    if (isRoomDone(room)) {
        return false;
    }

    // Every slot is either empty or correct thus far
    return room.occupants.every(_ => _ == null || _ === room.roomType);
}

function isRoomDone(room: Room): boolean {
    return room.occupants.every(_ => _ === room.roomType);
}

function isValidRoomToMoveOutOf(room: Room): boolean {
    // We don't touch solved rooms
    if (isRoomDone(room)) {
        return false;
    }

    // Nothing to move out of an empty room
    if (room.occupants.every(_ => _ == null)) {
        return false;
    }

    // There's something to fix there
    return room.occupants.some(_ => _ !== room.roomType);
}

function clearHall(halls: Hall[], hall: Hall): Hall[] {
    return halls.map((h) => h === hall ? { ...h, occupant: undefined } : h);
}

function fillHall(halls: Hall[], hall: Hall, occupant: AmphipodType): Hall[] {
    return halls.map((h) => h === hall ? { ...h, occupant } : h);
}

function clearRoom(rooms: Room[], room: Room): [Room[], Cost] {
    let occupantIndex: number = 0;
    const nextRooms = rooms.map((r) => {
        if (r !== room) {
            return r;
        }

        occupantIndex = r.occupants.findIndex(_ => _ != null);

        return {
            ...r,
            occupants: r.occupants.map((o, i) => i === occupantIndex ? undefined : o),
        }
    });

    return [nextRooms, occupantIndex + 1];
}

function fillRoom(rooms: Room[], room: Room, occupant: AmphipodType): [Room[], Cost] {
    let nullIndex = 0;
    const nextRooms = rooms.map((r) => {
        if (r !== room) {
            return r;
        }

        const reverseNullIndex = [...r.occupants].reverse().findIndex(_ => _ == null);
        nullIndex = r.occupants.length - reverseNullIndex - 1;
        return {
            ...r,
            occupants: r.occupants.map((o, i) => i === nullIndex ? occupant : o),
        };
    });

    return [nextRooms, nullIndex + 1];
}

function hallToRoom(state: State, hall: Hall, room: Room): [State, Cost] {
    const occupant = hall.occupant!;
    const halls = clearHall(state.halls, hall);
    const [rooms, entryMoves] = fillRoom(state.rooms, room, occupant);
    const cost = (Math.abs(room.x - hall.x) + entryMoves) * costPerMove[occupant];

    return [
        { halls, rooms},
        cost,
    ];
}

function roomToHall(state: State, room: Room, hall: Hall): [State, Cost] {
    const occupant = room.occupants.find(_ => _ != null)!;
    const [rooms, exitMoves] = clearRoom(state.rooms, room);
    const halls = fillHall(state.halls, hall, occupant);
    const cost = (Math.abs(room.x - hall.x) + exitMoves) * costPerMove[occupant];

    return [
        { halls, rooms},
        cost,
    ];
}

function getHallwayToRoomMoves(state: State): Array<[State, number]> {
    const moves: Array<[State, number]> = [];

    // Going from any hallway to any room
    const occupiedHallways = state.halls.filter((h) => h.occupant != null);

    for (const hall of occupiedHallways) {    
        const room = state.rooms.find((r) => r.roomType === hall.occupant!)!;

        if (!isValidRoomToMoveInto(room)) {
            continue;
        }

        if (isMoveBlocked(state, hall.x, room.x)) {
            continue;
        }

        moves.push(hallToRoom(state, hall, room));
    }

    return moves;
}

function getRoomToHallwayMoves(state: State): Array<[State, number]> {
    const moves: Array<[State, number]> = [];

    const validRooms = state.rooms.filter(isValidRoomToMoveOutOf);

    for (const room of validRooms) {
        // going to a free hallway
        const freeHalls = state.halls.filter((h) => h.occupant == null);

        for (const hall of freeHalls) {
            // We can't go to any hall that is blocked
            if (isMoveBlocked(state, room.x, hall.x)) {
                continue;
            }

            moves.push(roomToHall(state, room, hall));
        }
    }

    return moves;
}

function getNextMoves(state: State): Array<[State, number]> {
    const moves: Array<[State, number]> = [];

    moves.push(...getHallwayToRoomMoves(state));
    moves.push(...getRoomToHallwayMoves(state));

    return moves;
}

function findSolution(initialState: State): number {
    const queue: Array<[State, number]> = [];
    let minCost: number = Infinity;
    const costMap = new Map<string, number>();

    queue.push([
        initialState,
        0,
    ]);

    costMap.set(serialize(initialState), 0);

    while (queue.length > 0) {
        const [curr, currCost] = queue.pop()!;

        if (currCost > minCost) {
            continue;
        }

        if (isDone(curr)) {
            if (currCost < minCost) {
                console.log('update', currCost);
                minCost = currCost;
            }
            continue;
        }

        const moves = getNextMoves(curr);

        for (const [next, c] of moves) {
            const cost = currCost + c;

            // dead end, ignore this
            if (cost > minCost) {
                continue;
            }

            const snext = serialize(next);

            if (costMap.has(snext) && costMap.get(snext)! < cost) {
                continue;
            } else {
                costMap.set(snext, cost);
            }

            queue.push([next, cost]);
        }
    }

    return minCost;
}

function part1(rows: string[]) {
    const state = parseState(rows);
    return findSolution(state);
}

function part2(rows: string[]) {
    const state = parseState(rows);
    const insert: AmphipodType[][] = [
        ['D', 'D'],
        ['C', 'B'],
        ['B', 'A'],
        ['A', 'C'],
    ];
    const initialState = {
        ...state,
        rooms: state.rooms.map((r, i) => ({
            ...r,
            occupants: [r.occupants[0], ...insert[i], r.occupants[1]],
        })),
    };
    return findSolution(initialState);
}

export default Solution.lines({
    part1,
    part2,
});