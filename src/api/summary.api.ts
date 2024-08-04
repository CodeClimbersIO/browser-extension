import type { SummariesPayload } from '@src/types/summaries'
import { apiRequest } from '@src/utils/apiRequest'
import { formatDate, getDateUTC } from '@src/utils/dates'
import { getEnv } from '@src/utils/getEnv'
import { useBetterQuery } from '.'

export const useTotalTime = () => {
  const queryFn = async () => {
    const today = formatDate(getDateUTC())

    const res = await apiRequest<SummariesPayload>({
      url: getEnv().summariesApiEndPoint + `?end=${today}&start=${today}`,
    })

    if (!res?.data?.length)
      return Promise.reject(new Error('Error fetching data'))

    const [{ grand_total: grandTotal }] = res.data

    return grandTotal
  }

  return useBetterQuery({
    queryFn,
    queryKey: ['TotalTime'],
    staleTime: 60,
    throwOnError: false,
  })
}
