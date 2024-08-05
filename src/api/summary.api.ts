import type { Datum } from "@src/types/summaries";
import { apiRequest } from "@src/utils/apiRequest";
import { formatDate, getDateUTC } from "@src/utils/dates";
import { getEnv } from "@src/utils/getEnv";
import { useBetterQuery } from ".";

export const useTotalTime = () => {
  const queryFn = async () => {
    const today = formatDate(getDateUTC());

    const res = await apiRequest<Datum>({
      url: getEnv().summariesApiEndPoint + `?end=${today}&start=${today}`,
    }).catch((e) => {
      return Promise.reject(
        new Error(`Error connecting to endpoint - ${e.message} `),
      );
    });

    if (!res?.grand_total)
      return Promise.reject(new Error("Error retrieving total time"));

    return res.grand_total;
  };

  return useBetterQuery({
    queryFn,
    queryKey: ["TotalTime"],
    staleTime: 60,
    throwOnError: false,
  });
};
