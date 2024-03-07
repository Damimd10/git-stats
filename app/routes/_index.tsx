import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Octokit } from "@octokit/core";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Response } from "~/types";
import getContributionsByMonth from "~/utils/getContributionsByMotnh";

const GITHUB_ACCESS_TOKEN =
  "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";

const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });

export async function loader() {
  const response: Response = await octokit.graphql(
    `
      query getUserInfo($login: String!){
        user(login: $login) {
          contributionsCollection(from: "${new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
          ).toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `,
    {
      login: "wesbos",
    }
  );

  const weeks =
    response.user.contributionsCollection.contributionCalendar.weeks;

  const contributionsByMonth = getContributionsByMonth(weeks);

  return json({ contributionsByMonth });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { contributionsByMonth } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div>
        Contributions Chart
        <LineChart width={600} height={300} data={contributionsByMonth}>
          <XAxis dataKey="month" />
          <YAxis tickCount={50}/>
          <Line
            type="monotone"
            dataKey="contributions"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </div>
  );
}
