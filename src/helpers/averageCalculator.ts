import _ from "lodash";

export function calculateAverageRating(data:any) {
    console.log("Data Id ",data.EmployeeId)
    const weights = {
        Excellent: 4,
        VeryGood: 3,
        Good: 2,
        Bad: 1
    };

    let totalScore = 0;
    let totalCount = 0;

    for (let key in data) {
        if (data[key] !== "0") {
            if (key.includes("Excellent")) {
                totalScore += weights.Excellent*_.toNumber(data[key]);
            } else if (key.includes("VeryGood")) {
                totalScore += weights.VeryGood*_.toNumber(data[key]);
            } else if (key.includes("Good")) {
                totalScore += weights.Good*_.toNumber(data[key]);
            } else if (key.includes("Bad")) {
                totalScore += weights.Bad*_.toNumber(data[key]);
            }
            totalCount++;
        }
    }

    return totalCount === 0 ? 0 : totalScore / totalCount;
}
export function getTop10ByAverage(data:any):{EmplyeeId:number,average:number,amharic_name:string}[] {
    // Sort the array in descending order based on the 'average' property
    const sortedData = data.sort((a:any, b:any) => b.average - a.average);

    // Get the top 10 entries
    const top10 = sortedData.slice(0, 10);

    return top10;
}
