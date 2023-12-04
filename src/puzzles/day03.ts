import { fixLineBreaks } from './helpers';
import { Solution, Nullable } from '../types';

interface Component {
    partNumber: string;
    yIndex: number;
    xIndex?: number;
    isPart: boolean;
}

interface EngagedComponents {
    component1: Component;
    component2: Component;
    ratio: number;
}
interface Gear {
    yIndex: number;
    xIndex?: number;
    engaged: boolean | EngagedComponents;
}

let engagedSum: number = 0;
const isPart = (component: Component, data: Array<string>): boolean => {
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

        if (
            component.xIndex + component.partNumber.length <
            data[component.yIndex].length
        ) {
            // check if character before is a non-number
            const after: string =
                data[component.yIndex][
                    component.xIndex + component.partNumber.length
                ];
            if (after.match(prodSymbols)) {
                rVal = true;
            }
        }

        if (component.yIndex !== 0) {
            // calculate substring of line above
            let start: number = component.xIndex;
            let end: number =
                component.xIndex + component.partNumber.length - 1;

            if (start > 0) {
                start -= 1;
            }
            if (end < data[component.yIndex].length - 1) {
                end += 2;
            }
            const above: string = data[component.yIndex - 1].substring(
                start,
                end,
            );

            if (above.match(prodSymbols)) {
                rVal = true;
            }
        }

        if (component.yIndex < data.length - 1) {
            // calculate substring of line above
            let start: number = component.xIndex;
            let end: number =
                component.xIndex + component.partNumber.length - 1;

            if (start > 0) {
                start -= 1;
            }
            if (end < data[component.yIndex].length - 1) {
                end += 2;
            }
            const below: string = data[component.yIndex + 1].substring(
                start,
                end,
            );

            if (below.match(prodSymbols)) {
                rVal = true;
            }
        }
    }

    return rVal;
};

const findGears = (
    data: Array<string>,
    components: Array<Component>,
): Array<Gear> => {
    const gears: Array<Gear> = [];
    const gearRegEx: RegExp = new RegExp(/\*/g);

    data.map((line: string, yIndex: number) => {
        let possibleGears: Nullable<RegExpMatchArray> = null;
        while ((possibleGears = gearRegEx.exec(line)) !== null) {
            const tempGear: Gear = {
                yIndex: yIndex,
                xIndex: possibleGears.index,
                engaged: false,
            };
            tempGear.engaged = isEngaged(tempGear, components);
            gears.push(tempGear);
        }
    });

    return gears;
};

const isEngaged = (
    gear: Gear,
    components: Array<Component>,
): EngagedComponents | boolean => {
    const rVal: boolean | EngagedComponents = false;
    if (gear.xIndex !== undefined) {
        //get nearby components
        const nearbyComponents: Array<Component> = components.filter(
            (component: Component) => {
                return (
                    component.yIndex >= gear.yIndex - 1 &&
                    component.yIndex <= gear.yIndex + 1
                );
            },
        );

        const adjacentComponents: Array<Component> = nearbyComponents.filter(
            (nearby: Component) => {
                if (nearby.xIndex !== undefined && gear.xIndex !== undefined) {
                    if (nearby.yIndex === gear.yIndex) {
                        if (
                            nearby.xIndex + nearby.partNumber.length ===
                                gear.xIndex ||
                            nearby.xIndex - 1 === gear.xIndex
                        )
                            return true;
                    }

                    const rangeStart = nearby.xIndex - 1;
                    const rangeEnd = nearby.xIndex + nearby.partNumber.length;

                    if (
                        nearby.yIndex !== gear.yIndex &&
                        gear.xIndex >= rangeStart &&
                        gear.xIndex <= rangeEnd
                    ) {
                        return true;
                    }
                }
                return false;
            },
        );
        if (adjacentComponents.length === 2) {
            const ratio =
                parseInt(adjacentComponents[0].partNumber) *
                parseInt(adjacentComponents[1].partNumber);
            engagedSum += ratio;
            return {
                component1: adjacentComponents[0],
                component2: adjacentComponents[1],
                ratio: ratio,
            };
        }
    }

    return false;
};

export default (dataSet: string): Solution => {
    dataSet = fixLineBreaks(dataSet);
    // RegEx to find strings of numbers of unknow length
    const prodRegEx: RegExp = new RegExp(/([\d]+)/g);
    let partsSum: number = 0;

    const data: Array<string> = dataSet.split('\n');
    const components: Array<Component> = [];
    data.map((line: string, yIndex: number) => {
        let possibleParts: Nullable<RegExpMatchArray> = null;
        while ((possibleParts = prodRegEx.exec(line)) !== null) {
            const tempComponent: Component = {
                partNumber: possibleParts[0],
                yIndex: yIndex,
                xIndex: possibleParts.index,
                isPart: false,
            };
            if (isPart(tempComponent, data)) {
                tempComponent.isPart = true;
                partsSum += parseInt(tempComponent.partNumber);
            }
            components.push(tempComponent);
        }
    });

    const gears: Array<Gear> = findGears(data, components);

    // console.log(components, partsSum);
    return { puzzle1: partsSum, puzzle2: engagedSum };
};
