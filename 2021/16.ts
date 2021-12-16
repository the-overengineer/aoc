import { Solution } from '@core/DaySolution';
import { BinaryString, binaryStringToNumber, product, sum } from '@core/utilityBelt';

interface Reader {
    bits: BinaryString;
    index: number;
}

interface BasePacket {
    version: number;
    id: number;
}

interface LiteralValuePacket extends BasePacket {
    id: 4;
    value: number;
}

interface OperatorPacket extends BasePacket {
    subPackets: Packet[];
}

type Packet = LiteralValuePacket | OperatorPacket;

function isLiteralValue(packet: Packet): packet is LiteralValuePacket {
    return packet.id === 4;
}

function hex2bin(hex: string, width: number): string {
    return (parseInt(hex, 16).toString(2)).padStart(width, '0');
}

function hexString2bin(hex: string, width: number): string {
    return hex.split('').map((h) => hex2bin(h, width)).join('');
}

function readRaw(reader: Reader, characters: number): BinaryString {
    const bstr = reader.bits.slice(reader.index, reader.index + characters);
    reader.index += characters;
    return bstr;
}

function read(reader: Reader, characters: number): number {
    return binaryStringToNumber(readRaw(reader, characters));
}

function readLiteralValue(reader: Reader): number {
    let repr: string = '';

    while (true) {
        const chunk = readRaw(reader, 5);
        const prefix = chunk[0];
        const bstr = chunk.slice(1);
        repr += bstr;

        if (prefix === '0') {
            return binaryStringToNumber(repr);
        }
    }
}

function parsePacket(reader: Reader): Packet {
    const version = read(reader, 3);
    const id = read(reader, 3);

    if (id === 4) {
        const literalValue = readLiteralValue(reader);

        return {
            version,
            id,
            value: literalValue,
        };
    } else {
        const lengthTypeId = read(reader, 1);
        const subPackets: Packet[] = [];
        
        if (lengthTypeId === 0) {
            const subpacketLengthInBits = read(reader, 15);
            const startingIndex = reader.index;
            const expectedEnd = startingIndex + subpacketLengthInBits;

            while (reader.index < expectedEnd) {
                subPackets.push(parsePacket(reader));
            }
        } else {
            const subpacketCount = read(reader, 11);

            for (let i = 0; i < subpacketCount; i++) {
                subPackets.push(parsePacket(reader));
            }
        }

        return {
            version,
            id,
            subPackets,
        };
    }
}

function evaluate(packet: Packet): number {
    if (isLiteralValue(packet)) {
        return packet.value;
    }

    const subValues = packet.subPackets.map((sp) => evaluate(sp));

    switch (packet.id) {
        case 0: return sum(subValues);
        case 1: return product(subValues);
        case 2: return Math.min(...subValues);
        case 3: return Math.max(...subValues);
        case 5: return subValues[0] > subValues[1] ? 1 : 0;
        case 6: return subValues[0] < subValues[1] ? 1 : 0;
        case 7: return subValues[0] === subValues[1] ? 1 : 0;
        default: throw new Error(`Invalid packet id: ${packet.id}`);
    }
}

function sumUpVersions(packet: Packet): number {
    if (isLiteralValue(packet)) {
        return packet.version;
    } else {
        return sum([packet.version, ...packet.subPackets.map((sp) => sumUpVersions(sp))]);
    }
}

function part1(input: string) {
    const binaryString: BinaryString = hexString2bin(input, 4);
    const packet = parsePacket({
        bits: binaryString,
        index: 0,
    });
    const versionSum = sumUpVersions(packet);
    return versionSum;
}

function part2(input: string) {
    const binaryString: BinaryString = hexString2bin(input, 4);
    const packet = parsePacket({
        bits: binaryString,
        index: 0,
    });

    return evaluate(packet);
}

export default Solution.raw({
    part1,
    part2,
});