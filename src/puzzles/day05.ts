import { fixLineBreaks } from './helpers';
import { Solution, Nullable } from '../types';
import { get } from 'http';

interface Planting {
    seed: number;
    soil?: number;
    fert?: number;
    water?: number;
    light?: number;
    temp?: number;
    humid?: number;
    loc?: number;
}

interface Map {
    startDest: number;
    startSrc: number;
    range: number;
}

interface Data {
    plantings: Planting[];
    seed_to_soil: Map[];
    soil_to_fert: Map[];
    fert_to_water: Map[];
    water_to_light: Map[];
    light_to_temp: Map[];
    temp_to_humid: Map[];
    humid_to_loc: Map[];
}

const getMap = (mapString: string): Map[] => {
    return mapString.split(':\n')[1].split('\n').map((set) => {
        const values = set.split(' ');
        return { startDest: parseInt(values[0]), startSrc: parseInt(values[1]), range: parseInt(values[2]) };
    });
}

const parseData = (dataSet: string, puzzle: number = 1): Data => {
    const startTime = performance.now();
    const data: Data = {
        plantings: [],
        seed_to_soil: [],
        soil_to_fert: [],
        fert_to_water: [],
        water_to_light: [],
        light_to_temp: [],
        temp_to_humid: [],
        humid_to_loc: []
    };

    const sets = dataSet.split('\n\n');

    if (puzzle === 2) {
        const tempPlantingsRanges = sets[0].split(':')[1].trim().split(' ').map(value => parseInt(value));

        for (let a = 0; a < tempPlantingsRanges.length; a += 2) {
            data.plantings = data.plantings.concat(calculatePlantings(tempPlantingsRanges[a], tempPlantingsRanges[a + 1]));
        }
    } else {
        data.plantings = sets[0].split(':')[1].trim().split(' ').map(value => { return {seed: parseInt(value) }; });
    }

    data.seed_to_soil = getMap(sets[1]);
    data.soil_to_fert = getMap(sets[2]);
    data.fert_to_water = getMap(sets[3]);
    data.water_to_light = getMap(sets[4]);
    data.light_to_temp = getMap(sets[5]);
    data.temp_to_humid = getMap(sets[6]);
    data.humid_to_loc = getMap(sets[7]);

    console.log("parseData: " + (performance.now() - startTime) + "ms");
    return data;
}

const calculatePlantings = (start: number, range: number): Planting[] => {
    const plantings: Planting[] = [];
    for (let a = start; a < start + range; a++) {
        plantings.push({ seed: a });
    }
    return plantings;
};

const inRange = (value, start, range): boolean => {
    return value >= start && value < start + range;
}
const handleRangeCalculation = (aVal: number, maps: Map[]): number => {
    let rVal = aVal;

    maps.forEach(map => {
        if (inRange(aVal, map.startSrc, map.range)) {
            rVal = map.startDest + (aVal - map.startSrc);
            return false;
        }
    });

    return rVal;
}

const getSeedValues = (planting: Planting, data: Data): void => {
    const startTime = performance.now();

    planting.soil = handleRangeCalculation(planting.seed, data.seed_to_soil);
    planting.fert = handleRangeCalculation(planting.soil, data.soil_to_fert);
    planting.water = handleRangeCalculation(planting.fert, data.fert_to_water);
    planting.light = handleRangeCalculation(planting.water, data.water_to_light);
    planting.temp = handleRangeCalculation(planting.light, data.light_to_temp);
    planting.humid = handleRangeCalculation(planting.temp, data.temp_to_humid);
    planting.loc = handleRangeCalculation(planting.humid, data.humid_to_loc);
    
    console.log("getSeedValues: " + (performance.now() - startTime) + "ms");
}

const getLowestLoc = (plantings: Planting[]): number => {
    const startTime = performance.now();
    let lowestLoc = -1;
    plantings.forEach(planting => {
        if (planting.loc !== undefined) {
            if (lowestLoc === -1 || planting.loc < lowestLoc) {
                lowestLoc = planting.loc;
            }
        }
    });
    console.log("getLowestLoc: " + (performance.now() - startTime) + "ms");
    return lowestLoc;
}

export default (dataSet: string): Solution => {
    dataSet = fixLineBreaks(dataSet);
    const data = parseData(dataSet);
    data.plantings.forEach(planting => { getSeedValues(planting, data); });
    const puzzle1: number = getLowestLoc(data.plantings);

    const data2 = parseData(dataSet, 2);
    // data2.plantings.forEach(planting => { getSeedValues(planting, data2); });
    // const puzzle2: number = getLowestLoc(data2.plantings);
    return { puzzle1: puzzle1, puzzle2: data2.plantings.length };
};
