export interface ILinesDaySolution<T> {
    lines: true;
    part1(lines: string[]): T;
    part2?(lines: string[]): T;
}

export interface IRawDaySolution<T> {
    lines: false;
    part1(text: string): T;
    part2?(text: string): T;
}

export type DaySolution<T> =
    | ILinesDaySolution<T>
    | IRawDaySolution<T>
    ;

function raw<T>(spec: Omit<IRawDaySolution<T>, 'lines'>): IRawDaySolution<T> {
    return {
        lines: false,
        ...spec,
    };
}

function lines<T>(spec: Omit<ILinesDaySolution<T>, 'lines'>): ILinesDaySolution<T> {
    return {
        lines: true,
        ...spec,
    };
}

export const Solution = {
    raw,
    lines,
};
