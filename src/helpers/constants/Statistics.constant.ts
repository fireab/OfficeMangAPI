import { Rate, Employee } from '../database/Sequelize'; // Adjust import path based on your project structure

// Define types for Rate and Result
interface RateAttributes {
  EmployeeId: number;
  CustomerService: string;
  StandardService: string;
  FairService: string;
  ResponseForCompliment: string;
  ServiceRate: string;
}

interface Result {
  EmployeeId: number;
  averageScore: number;
}

const calculateScore = (rate: RateAttributes): number => {
  const scoreMap: Record<string, number> = {
    Excellent: 4,
    VeryGood: 3,
    Intermediate: 2,
    Good: 1,
    Bad: -1,
  };

  const scores = [
    scoreMap[rate.CustomerService] || 0,
    scoreMap[rate.StandardService] || 0,
    scoreMap[rate.FairService] || 0,
    scoreMap[rate.ResponseForCompliment] || 0,
    scoreMap[rate.ServiceRate] || 0,
  ];

  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

export const fetchAndProcessRates = async (rates:Rate[]): Promise<Result[]> => {
  // Fetch all rates with their associated employees
  // Group and calculate scores
  const groupedScores = rates.reduce<Record<number, { totalScore: number; count: number }>>(
    (acc, rate) => {
      const rateData = rate.toJSON() as RateAttributes;

      if (!acc[rateData.EmployeeId]) {
        acc[rateData.EmployeeId] = { totalScore: 0, count: 0 };
      }

      const avgScore = calculateScore(rateData);
      acc[rateData.EmployeeId].totalScore += avgScore;
      acc[rateData.EmployeeId].count += 1;

      return acc;
    },
    {}
  );

  // Map results
  const results: Result[] = Object.entries(groupedScores).map(([employeeId, data]) => ({
    EmployeeId: parseInt(employeeId, 10),
    averageScore: data.totalScore / data.count,
  }));

  // Sort results by average score and EmployeeId
  results.sort((a, b) => b.averageScore - a.averageScore || a.EmployeeId - b.EmployeeId);

  return results;
};