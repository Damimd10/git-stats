import { Week } from "~/types";

export default function getContributionsByMonth(weeks: Week[]) {
  const contributionsByMonth = weeks
    .flatMap((week) =>
      week.contributionDays.map((day) => ({
        month: new Date(day.date).toLocaleString("default", { month: "long" }),
        contributions: day.contributionCount,
      }))
    )
    .reduce((acc, { month, contributions }) => {
      acc[month] = (acc[month] || 0) + contributions;
      return acc;
    }, {} as Record<string, number>);

  const parsedContributionsByMonth = Object.entries(contributionsByMonth).map(
    ([month, contributions]) => ({ month, contributions })
  );

  return parsedContributionsByMonth;
}
