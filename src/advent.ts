import Puzzles from './puzzles';
import Data from './data';

const lb = () => {
    console.log('\n');
};

// Loop through each day
for (let day = 1; day <= Object.keys(Puzzles).length; day++) {
    console.group('Day ' + day);
    const dayString = 'day' + ('00' + day).slice(-2);
    if (dayString in Data && dayString in Puzzles) {
        const data = Data[dayString];
        const puzzle = Puzzles[dayString](data);
        console.log('Results: ', puzzle);
    } else {
        console.warn('No data or puzzle for day ' + day);
    }
    console.groupEnd();
    lb();
}
