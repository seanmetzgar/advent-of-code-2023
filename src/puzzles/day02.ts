import data from '../data';
import { Solution, Nullable } from '../types';

interface MaxValues {
    red: number;
    green: number;
    blue: number;
}
interface Set {
    red?: number;
    green?: number;
    blue?: number;
}
interface Game {
    id: number;
    sets: Array<Set>;
    possible: boolean;
    power: number;
    // rawSets: string;
}
export default (dataSet: string): Solution => {
    const maxValues: MaxValues = {
        red: 12,
        green: 13,
        blue: 14,
    };

    let possibleSum: number = 0;
    let powerSum: number = 0;

    const data: Game[] = dataSet
        .split('\n')
        .map((line: string, index: number) => {
            const id: number = index + 1;
            const rawSets: string[] = line
                .replace(/Game\s\d+:\s/, '')
                .split('; ');
            let possible: boolean = true;
            let currentMaxValues: MaxValues = { red: 0, green: 0, blue: 0 };

            const sets: Set[] = rawSets.map((rawSet: string) => {
                const clusters: { value: number; color: string }[] = rawSet
                    .split(', ')
                    .map((rawCluster: string) => {
                        const [value, color] = rawCluster.split(' ');
                        return { value: parseInt(value), color: color };
                    });
                const currentSet: Set = {};

                clusters.forEach(
                    (cluster: { value: number; color: string }) => {
                        if (cluster.value > maxValues[cluster.color])
                            possible = false;
                        if (cluster.value > currentMaxValues[cluster.color])
                            currentMaxValues[cluster.color] = cluster.value;
                        currentSet[cluster.color] = cluster.value;
                    },
                );
                return currentSet;
            });

            const power: number =
                currentMaxValues.red *
                currentMaxValues.green *
                currentMaxValues.blue;

            possibleSum += possible ? id : 0;
            powerSum += power;

            return { id, sets, possible, power };
        });

    return { puzzle1: possibleSum, puzzle2: powerSum };
};
