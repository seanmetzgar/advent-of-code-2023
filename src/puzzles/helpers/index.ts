export const fixLineBreaks = (dataSet: string): string => {
    return dataSet.replace(/\r\n/g, '\n');
}
