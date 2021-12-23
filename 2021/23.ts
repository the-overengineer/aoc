import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { move } from './21';

type AmphipodType = 'A' | 'B' | 'C' | 'D';

interface Hall {
    occupant?: AmphipodType;
    x: number;
}

interface Room {
    x: number;
    roomType: AmphipodType;
    topOccupant?: AmphipodType;
    bottomOccupant?: AmphipodType;
}

interface State {
    halls: Hall[];
    rooms: Room[];
}

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
                halls.push({ x });
            } else if (/[A-D]/.test(rows[y][x])) {
                const topOccupant = rows[y][x] as AmphipodType;
                const bottomOccupant = rows[y + 1][x] as AmphipodType;
                rooms.push({
                    x,
                    topOccupant,
                    bottomOccupant,
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
    return state.rooms.every(isRoomOk);
}

function isBetween(x: number, x1: number, x2: number) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);

    return x > minX && x < maxX;
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

function painted(state: State): string {
    const roomTopAt = (x: number) => state.rooms.find((r) => r.x === x)!.topOccupant ?? '.';
    const roomBotAt = (x: number) => state.rooms.find((r) => r.x === x)!.bottomOccupant ?? '.';
    const hallAt = (x: number) => state.halls.find((h) => h.x === x)!.occupant ?? '.';

    return `#############
#${hallAt(1)}${hallAt(2)}.${hallAt(4)}.${hallAt(6)}.${hallAt(8)}.${hallAt(10)}${hallAt(11)}#
###${roomTopAt(3)}#${roomTopAt(5)}#${roomTopAt(7)}#${roomTopAt(9)}###
  #${roomBotAt(3)}#${roomBotAt(5)}#${roomBotAt(7)}#${roomTopAt(7)}#
  #########`;
}

type Move = [State, number];

function isRoomFree(room: Room) {
    return room.bottomOccupant == null
        || room.topOccupant == null && room.bottomOccupant === room.roomType;
}

function isRoomOk(room: Room) {
    return room.bottomOccupant === room.topOccupant && room.topOccupant === room.roomType;
}

function isRoom(a: any): a is Room {
    return a.roomType != null;
}

function isHallway(a: any): a is Hall {
    return a.roomType == null;
}

function canMoveBetween(state: State, pod: AmphipodType, room: Room, hallway: Hall): boolean;
function canMoveBetween(state: State, pod: AmphipodType, hallway: Hall, room: Room): boolean;
function canMoveBetween(state: State, pod: AmphipodType, room: Room, room2: Room): boolean
function canMoveBetween(state: State, pod: AmphipodType, a: Room | Hall, b: Room | Hall): boolean {
    const canMoveThrough = !state.halls.some((h) => h !== b && h !== a && h.occupant != null && isBetween(h.x, a.x, b.x));
    const canMoveOutOf = isHallway(a) ? a.occupant != null : (a.topOccupant === pod || a.topOccupant == null && a.bottomOccupant === pod);
    const canMoveInto = isHallway(b) ? b.occupant == null : (b.topOccupant == null && (b.bottomOccupant == null || b.bottomOccupant === b.roomType));

    return canMoveOutOf && canMoveThrough && canMoveInto;
}

function moveHallwayToRoom(state: State, hallway: Hall, room: Room): Move {
    const occupant = hallway.occupant!;
    const halls: Hall[] = state.halls.map((h) => h === hallway ? { ...h, occupant: undefined } : h);
    const rooms: Room[] = state.rooms.map((r) => {
        if (r !== room) {
            return r;
        }

        return r.bottomOccupant != null
            ? { ...r, topOccupant: occupant! }
            : { ...r, bottomOccupant: occupant! };
    });

    const cost = room.bottomOccupant == null
        ? (Math.abs(room.x - hallway.x) + 2) * costPerMove[occupant]
        : (Math.abs(room.x - hallway.x) + 1) * costPerMove[occupant];

    return [
        { halls, rooms },
        cost,
    ];
}

function moveRoomToHallway(state: State, room: Room, hallway: Hall): Move {
    if (room.topOccupant != null) {
        const rooms = state.rooms.map((r) => r === room ? { ...r, topOccupant: undefined }: r);
        const halls = state.halls.map((h) => h === hallway ? { ...h, occupant: room.topOccupant } : h);
        const cost = (Math.abs(room.x - hallway.x) + 1) * costPerMove[room.topOccupant];

        return [
            { rooms, halls},
            cost,
        ];
    } else if (room.bottomOccupant != null) {
        const rooms = state.rooms.map((r) => r === room ? { ...r, bottomOccupant: undefined }: r);
        const halls = state.halls.map((h) => h === hallway ? { ...h, occupant: room.bottomOccupant } : h);
        const cost = (Math.abs(room.x - hallway.x) + 2) * costPerMove[room.bottomOccupant];

        return [
            { rooms, halls},
            cost,
        ];
    }

    throw new Error('never happens');
}

function moveRoomToRoom(state: State, room: Room, otherRoom: Room): Move {
    const outOfTop = room.topOccupant != null ? true : false;
    const outCost = outOfTop ? 1 : 2;
    const occupant = room.topOccupant ?? room.bottomOccupant!;
    const intoTop = otherRoom.bottomOccupant != null ? true : false;
    const inCost = intoTop ? 1 : 2;
    const totalCost = (Math.abs(room.x - otherRoom.x) + inCost + outCost) * costPerMove[occupant];
    const rooms = state.rooms.map((r): Room => {
        if (r === room) {
            return outOfTop ? { ...r, topOccupant: undefined } : { ...r, bottomOccupant: undefined };
        } else if (r === otherRoom) {
            return intoTop ? { ...r, topOccupant: occupant } : { ...r, bottomOccupant: occupant };
        } else {
            return r;
        }
    });

    return [
        { halls: state.halls, rooms },
        totalCost,
    ];
}

function getNextMoves(state: State): Array<[State, number]> {
    const moves: Array<[State, number]> = [];

    const occupiedHallways = state.halls.filter(_ => _.occupant != null);
    const unoccupiedHallways = state.halls.filter(_ => _.occupant == null);
    const unsortedRooms = state.rooms.filter(_ => !isRoomOk(_));
    const relevantRoom = (a: AmphipodType) => unsortedRooms.find((r) => r.roomType === a);

    occupiedHallways.forEach((hall) => {
        const room = relevantRoom(hall.occupant!);
        if (room != null && canMoveBetween(state, hall.occupant!, hall, room)) {
            moves.push(moveHallwayToRoom(state, hall, room));
        }
    });

    unsortedRooms.forEach((room) => {
        if (room.topOccupant == null && room.bottomOccupant == null) {
            return;
        }

        const occupant = room.topOccupant ?? room.bottomOccupant!;
        const targetRoom = relevantRoom(occupant);

        if (targetRoom != null && canMoveBetween(state, occupant, room, targetRoom)) {
            moves.push(moveRoomToRoom(state, room, targetRoom));
        }
    
        unoccupiedHallways.forEach((hall) => {
            if (canMoveBetween(state, occupant, room, hall)) {
                moves.push(moveRoomToHallway(state, room, hall));
            }
        });
    });

    return moves;
}

function findSolution(initialState: State): number {
    const queue: Array<Move> = [];
    let minCost: number = Infinity;

    queue.push([
        initialState,
        0,
        // new Set([serialize(initialState)]),
    ]);

    while (queue.length > 0) {
        const [curr, currCost] = queue.pop()!;

        if (isDone(curr)) {
            if (currCost < minCost) {
                console.log('next best', currCost);
                minCost = currCost;
            }
            continue;
        } else if (currCost > minCost) {
            // dead end, nothing to find there
            continue;
        }

        const moves = getNextMoves(curr);

        for (const [next, moveCost] of moves) {
            if (moveCost + currCost > minCost) {
                // it's worse than we we already have, give up!
                continue;
            }

            // const copy = new Set([...visited]);
            // const nextVisited = copy.add(snext);

            queue.push([next, moveCost + currCost]);
        }
    }

    return minCost;
}

function part1(rows: string[]) {
    const state = parseState(rows);
    return findSolution(state);
}

export default Solution.lines({
    part1,
});