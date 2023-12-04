import { fixLineBreaks } from './helpers';
import { Solution, Nullable } from '../types';

interface Component {
    partNumber: string;
    yIndex: number;
    xIndex?: number;
    isPart: boolean;
}

function isPart(component: Component, data: Array<string>): boolean {
    // RegEx to find non-numbers, excluding . and whitespace
    let rVal: boolean = false;
    if (component.xIndex !== undefined) {
        const prodSymbols: RegExp = new RegExp(/([^\d\. ]+)/, 'g');

        if (component.xIndex !== 0) {
            // check if character before is a non-number
            const before: string = data[component.yIndex][component.xIndex - 1];
            
            if (before.match(prodSymbols)) {
               rVal = true;
            }
        }

        if (component.xIndex + component.partNumber.length < data[component.yIndex].length) {
            // check if character before is a non-number
            const after: string = data[component.yIndex][component.xIndex + component.partNumber.length];
            if (after.match(prodSymbols)) {
                rVal = true;
             }
        }

        if (component.yIndex !== 0) {
            // calculate substring of line above
            let start: number = component.xIndex;
            let end: number = component.xIndex + component.partNumber.length - 1;

            if (start > 0) {
                start -= 1;
            }
            if (end < data[component.yIndex].length - 1) {
                end += 2;
            }
            const above: string = data[component.yIndex - 1].substring(start, end);

            if (above.match(prodSymbols)) {
                rVal = true;
            }
        }

        if (component.yIndex < data.length - 1) {
            // calculate substring of line above
            let start: number = component.xIndex;
            let end: number = component.xIndex + component.partNumber.length - 1;

            if (start > 0) {
                start -= 1;
            }
            if (end < data[component.yIndex].length - 1) {
                end += 2;
            }
            const below: string = data[component.yIndex + 1].substring(start, end);

            if (below.match(prodSymbols)) {
                rVal = true;
            }
        }
    }
    
    return rVal;

}

export default (dataSet: string): Solution => {
    dataSet = fixLineBreaks(dataSet);
    // RegEx to find strings of numbers of unknow length
    const prodRegEx: RegExp = new RegExp(/([\d]+)/g);
    let partsSum: number = 0;

    const data: Array<string> = dataSet.split('\n');
    const components: Array<Component> = []
    data.map((line: string, yIndex: number) => {
        let possibleParts: Nullable<RegExpMatchArray> = null;
        while ((possibleParts = prodRegEx.exec(line)) !== null) {
            const tempComponent: Component = {
                partNumber: possibleParts[0],
                yIndex: yIndex,
                xIndex: possibleParts.index,
                isPart: false
            };
            if (isPart(tempComponent, data)) {
                tempComponent.isPart = true;
                partsSum += parseInt(tempComponent.partNumber);
            }
            components.push(tempComponent);
        }
    });

    // console.log(components, partsSum);
    return { puzzle1: partsSum, puzzle2: 0 };
};
