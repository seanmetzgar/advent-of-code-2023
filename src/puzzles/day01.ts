import data from '../data';
import { Solution, Nullable } from '../types';

const convertToNumber = (number: string): number => {
    if (!isNaN(parseInt(number))) return parseInt(number);

    switch (number) {
        case 'one':
            return 1;
        case 'two':
            return 2;
        case 'three':
            return 3;
        case 'four':
            return 4;
        case 'five':
            return 5;
        case 'six':
            return 6;
        case 'seven':
            return 7;
        case 'eight':
            return 8;
        case 'nine':
            return 9;
        case 'zero':
            return 0;
        default:
            return 0;
    }
};

function matchOverlap(str: string, regex: RegExp): Array<string> {
    const rVal: Array<string> = [];
    let matches: Nullable<RegExpMatchArray> = null;
    // Prevent infinite loops by ensuring the regex is setup to match globally
    if (!regex.global)
        regex = new RegExp(regex.source, (regex + '').split('/').pop() + 'g');
    while ((matches = regex.exec(str))) {
        regex.lastIndex -= matches[0].length - 1;
        rVal.push(matches[0]);
    }
    return rVal;
}

const getSolution = (dataSet: string, day: number = 1): number => {
    let digits: Nullable<RegExpMatchArray | string[]> = null;
    const data: Array<number> = dataSet.split('\n').map((line: string) => {
        const puzzle1Regex: RegExp = new RegExp(/\d/g);
        const puzzle2Regex: RegExp = new RegExp(
            /(\d|one|two|three|four|five|six|seven|eight|nine)/g,
        );

        if (day === 2) {
            digits = matchOverlap(line, puzzle2Regex);
        } else digits = line.match(puzzle1Regex);

        if (digits && digits.length > 0) {
            return parseInt(
                '' +
                    convertToNumber(digits[0]) +
                    convertToNumber(digits[digits.length - 1]),
            );
        }
        return 0;
    });

    return data.reduce((a: number, b: number) => a + b, 0);
};

export default (dataSet: string): Solution => {
    return { puzzle1: getSolution(dataSet), puzzle2: getSolution(dataSet, 2) };
};
