// For example: let's rearrange 3 tables with 4 people each, into 4 tables of 3 people each.
// The purpose of this code is to create large number of rearrangements and calculate the probability to get rearrangement that will contain at least
// one new table which all 3 people in this table would come from same original table of 4.
// let's say we have 3 tables of 4 people while all 12 people are marked by numbers between 1-12:
// table A: 1,2,3,4
// table B: 5,6,7,8
// table C: 9,10,11,12
// let's rearrange the 12 people in 4 new tables:
// Rearrangement for example that fit the requirements: (1,2,4) (3,5,9) (6,7,10) (8,11,12)
// Rearrangement for example that does not fit the requirements: (1,5,9) (2,6,10) (3,7,11) (4,8,12)

class TablesRearrangement {

    rearrangePeopleInNewTablesSize(numOfOriginalTables, numOfPeopleInEachOriginalTable, totalRearrangements, numOfNewTables = numOfPeopleInEachOriginalTable, numOfPeopleInEachNewTable = numOfOriginalTables){
        const totalPeople = numOfOriginalTables * numOfPeopleInEachOriginalTable;
        if (numOfNewTables * numOfPeopleInEachNewTable > totalPeople){
            console.log(`\nYou chose to rearrange ${numOfNewTables * numOfPeopleInEachNewTable} people and it exceeds total number of people (${totalPeople})\n`);
            return 0;
        }
        if (numOfPeopleInEachNewTable > numOfPeopleInEachOriginalTable){
            console.log(`\nYou chose in new table size (${numOfPeopleInEachNewTable}) that is bigger than original table size (${numOfPeopleInEachOriginalTable})\n`);
            return 0;
        }
        const originalPeopleArray = prepareArrayOfConsecutiveNumbers(totalPeople);
        const originalTablesArray = prepareArrayOfSubArrays(originalPeopleArray, numOfPeopleInEachOriginalTable, numOfOriginalTables);
        const startTime = new Date().getTime();
        console.log(`Original tables:\n`);
        for (let i = 0; i < originalTablesArray.length; i++){
            console.log(`${originalTablesArray[i]}`);
        }
        let rearrangementsResults = Array.from({ length: numOfNewTables + 1 }, () => 0);
        let numOfSuccessfulRearrangements = 0;
        for (let rearrangementAttempt = 1; rearrangementAttempt <= totalRearrangements; rearrangementAttempt++){
            const newPeopleArray = shuffleArray(originalPeopleArray);
            const newTablesArray = prepareArrayOfSubArrays(newPeopleArray, numOfPeopleInEachNewTable, numOfNewTables);
            const numOfSmallTablesContainedInBigTables = checkIfSubArraysOfArrayContainedInSubArraysOfOtherArray(newTablesArray, originalTablesArray);
            if (numOfSmallTablesContainedInBigTables > 0){
                numOfSuccessfulRearrangements++;
            }
            rearrangementsResults[numOfSmallTablesContainedInBigTables]++;
            
            let newTablesInOneString = `New tables after rearrangement number ${rearrangementAttempt}: `;
            for (let newTableIndex = 0; newTableIndex < newTablesArray.length; newTableIndex++){
                newTablesInOneString = `${newTablesInOneString}  [${newTablesArray[newTableIndex]}]`;
            }
            console.log(`${newTablesInOneString} ---> ${numOfSmallTablesContainedInBigTables} tables contained in original tables`);
        }
        const endTime = new Date().getTime();
        printFinalResults(totalRearrangements, numOfSuccessfulRearrangements);
        printTimeDuration(startTime, endTime);
        for (let i = 0; i < rearrangementsResults.length; i++){
            console.log(`Total rearrangements with exactly ${i} tables contain people who sat together in original table: ${rearrangementsResults[i]}`);
        }
    }
}

const tablesRearrangement = new TablesRearrangement();
tablesRearrangement.rearrangePeopleInNewTablesSize(3, 4, 100);
export default tablesRearrangement;





function prepareArrayOfConsecutiveNumbers(numOfConsecutiveNumbers){
    let array = [];
    for (let i = 1; i <= numOfConsecutiveNumbers; i++) {
        array.push(i);
    }
    return array;
}

function prepareArrayOfSubArrays(array, numOfElementsInEachSubArray, numOfSubArrays){
    let newArrayOfSubArrays = [];
    let tempArray = [];
    for (let i = 0; i < numOfElementsInEachSubArray * numOfSubArrays; i++) {
        tempArray.push(array[i]);
        if (tempArray.length === numOfElementsInEachSubArray){
            newArrayOfSubArrays.push(tempArray);
            tempArray = [];
        }
    }
    return newArrayOfSubArrays;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkIfSubArraysOfArrayContainedInSubArraysOfOtherArray(arrayA, arrayB){
    let numOfTimesThatSubArraysOfArrayAAreIncludedInSubArraysOfArrayB = 0;
    for (let arrayAIndex = 0; arrayAIndex < arrayA.length; arrayAIndex++){
        for (let arrayBIndex = 0; arrayBIndex < arrayB.length; arrayBIndex++){
            if (areArrayElementsIncludedInOtherArray(arrayA[arrayAIndex], arrayB[arrayBIndex])){
                numOfTimesThatSubArraysOfArrayAAreIncludedInSubArraysOfArrayB++;
                break;
            }
        }
    }
    return numOfTimesThatSubArraysOfArrayAAreIncludedInSubArraysOfArrayB;
}

function areArrayElementsIncludedInOtherArray(arrayA, arrayB) {
    // Check if every element in array 'arrayA' is included in array 'arrayB'
    return arrayA.every(element => arrayB.includes(element));
}

function printFinalResults(totalRearrangements, numOfSuccessfulRearrangements){
    const fractionOfSuccessfulRearrangements = (numOfSuccessfulRearrangements / totalRearrangements).toFixed(5);
    const percentageOfSuccessfulRearrangements = ((numOfSuccessfulRearrangements / totalRearrangements) * 100).toFixed(5);
    console.log(`\nSummary:\n`);
    console.log(`Total successful rearrangements: ${numOfSuccessfulRearrangements}`);
    console.log(`Total rearrangements: ${totalRearrangements}`);
    console.log(`Probability to get successful rearrangement: ${fractionOfSuccessfulRearrangements}`);
    console.log(`Percentage of successful rearrangements: ${percentageOfSuccessfulRearrangements} %`);
}

function printTimeDuration(startTime, endTime){
    const totalDurationInSeconds = Math.round((endTime - startTime) / 1000);
    const totalDurationInMinutes = ((endTime - startTime) / 60000).toFixed(1);
    console.log(`Total duration: ${totalDurationInSeconds} seconds (${totalDurationInMinutes} minutes)\n`);
}



