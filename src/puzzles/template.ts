import { fixLineBreaks } from './helpers';
import { Solution, Nullable } from '../types';

export default (dataSet: string): Solution => {
    dataSet = fixLineBreaks(dataSet);

    // Start Code

    return { puzzle1: 0, puzzle2: 0 };
};
