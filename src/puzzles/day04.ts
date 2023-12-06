import { fixLineBreaks } from './helpers';
import { Solution, Nullable } from '../types';

interface Card {
    id: number;
    winningNumbers?: number[];
    myNumbers?: number[];
    matches?: number[];
    matchesTotal: number;
    score?: number;
}

let sumScore: number = 0;

const cardMultipliers: number[] = []
const getCardId = (line: string): number => {
    const id = line.match(/(?!Card\s+)(\d+)/);
    if (id) {
        return parseInt(id[0]);
    }
    else return 0;
};

const extractNumbers = (rawNumbers: string): number[] => {
    const numberRegex = new RegExp(/\d+/g);
    const numbers: number[] = [];
    let match: Nullable<RegExpMatchArray> = null;
    while ((match = numberRegex.exec(rawNumbers)) !== null) {
        numbers.push(parseInt(match[0]));
    }
    return numbers;
}

const recursiveCardCreation = (cards: Card[], index: number) => {
    let subTotal: number = 1;
    const matches: number = cards[index].matchesTotal;
    for (let a = 0; a < matches; a++){
        subTotal += recursiveCardCreation(cards, index + 1 + a)
    }
    return subTotal;
};

const doPart2 = (cards: Card[]) => {
    let total: number = 0;

    for (let a = 0; a < cards.length; a++) {
        total += recursiveCardCreation(cards, a);
    }

    return total;
}

const parseData = (dataSet: string) => {
    
    const cards: Card[] = dataSet.split('\n').map((line) => {
        let splitCard = line.split(':');
        const id = getCardId(splitCard[0]);
        splitCard = splitCard[1].split('|');
        const winningNumbers: number[] = extractNumbers(splitCard[0].trim());
        const myNumbers: number[] = extractNumbers(splitCard[1].trim());
        const matches: number[] = myNumbers.filter(e => winningNumbers.indexOf(e) !== -1);
        const matchesTotal: number = matches.length;
        const score: number = matches.length > 0 ? 2 ** (matches.length - 1) : 0;
        sumScore += score;

        return {
            id,
            winningNumbers,
            myNumbers,
            matches,
            matchesTotal,
            score
        }
    });
    return cards;
};

export default (dataSet: string): Solution => {
    dataSet = fixLineBreaks(dataSet);
    const cards = parseData(dataSet);

    return { puzzle1: sumScore, puzzle2: doPart2(cards) };
};
