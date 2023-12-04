export type Nullable<T> = T | null;

export interface Data {
    [key: string]: string;
}

export interface Puzzles {
    [key: string]: (data: string) => Solution;
}

export interface Solution {
    puzzle1?: number | string;
    puzzle2?: number | string;
}
