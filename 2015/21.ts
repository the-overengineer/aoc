import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { fst, pairings, snd, sum } from '@core/utilityBelt';

interface Item {
    cost: number;
    damage: number;
    armor: number;
}

interface Character {
    hp: number;
    damage: number;
    armor: number;
}

type Cost = number;

const weaponOptions: Item[] = [
    { cost: 8, damage: 4, armor: 0 },
    { cost: 10, damage: 5, armor: 0 },
    { cost: 25, damage: 6, armor: 0 },
    { cost: 40, damage: 7, armor: 0 },
    { cost: 74, damage: 8, armor: 0 },
];

const armorOptions: Array<Item | undefined> = [
    undefined,
    { cost: 13, damage: 0, armor: 1 },
    { cost: 31, damage: 0, armor: 2 },
    { cost: 53, damage: 0, armor: 3 },
    { cost: 75, damage: 0, armor: 4 },
    { cost: 102, damage: 0, armor: 5 },
];

const ringOptions: [Item | undefined, Item | undefined][] = pairings([
    undefined,
    undefined,
    { cost: 25, damage: 1, armor: 0 },
    { cost: 50, damage: 2, armor: 0 },
    { cost: 100, damage: 3, armor: 0 },
    { cost: 20, damage: 0, armor: 1 },
    { cost: 40, damage: 0, armor: 2 },
    { cost: 80, damage: 0, armor: 3 },
]);

function getEquipmentOptions(): Item[][] {
    const options: Item[][] = [];

    for (const weapon of weaponOptions) {
        for (const armor of armorOptions) {
            for (const rings of ringOptions) {
                options.push([weapon, armor, ...rings].filter((it) => it != null) as Item[]);
            }
        }
    }

    return options;
}

function createCharacter(items: Array<Item>): [Character, Cost] {
    const cost = sum(items.map((i) => i.cost));
    const armor = sum(items.map((i) => i.armor));
    const damage = sum(items.map((i) => i.damage));

    return [
        { hp: 100, armor, damage},
        cost,
    ];
}

function damage(attacker: Character, defender: Character): void {
    defender.hp -= Math.max(1, attacker.damage - defender.armor);
}

function playOut(player: Character, monster: Character): boolean {
    let currentPlayer = { ...player };
    let currentMonster = { ...monster };
    
    while (true) {
        damage(currentPlayer, currentMonster);
        if (currentMonster.hp <= 0) {
            return true;
        }
        damage(currentMonster, currentPlayer);
        if (currentPlayer.hp <= 0) {
            return false;
        }
    }
}

function parseBoss(lines: string[]): Character {
    const hp = lines[0].split(': ')[1]!.toInt();
    const damage = lines[1].split(': ')[1]!.toInt();
    const armor = lines[2].split(': ')[1]!.toInt();

    return { hp, damage, armor };
}

function part1(lines: string[]) {
    const boss = parseBoss(lines);
    const characters = getEquipmentOptions()
        .map((equipment) => createCharacter(equipment))
        .sort((a, b) => snd(a) - snd(b));

    for (const [character, cost] of characters) {
        if (playOut(character, boss)) {
            return cost;
        }
    }
}

function part2(lines: string[]) {
    const boss = parseBoss(lines);
    const characters = getEquipmentOptions()
        .map((equipment) => createCharacter(equipment))
        .sort((a, b) => snd(b) - snd(a));

    for (const [character, cost] of characters) {
        if (!playOut(character, boss)) {
            return cost;
        }
    }
}

export default Solution.lines({
    part1,
    part2,
});
