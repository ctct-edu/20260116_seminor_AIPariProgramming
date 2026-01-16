import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api'
import { queryKeys } from '../lib/queryKeys'

export function useMeQuery() {
  // TODO: 認証有効時は useAuth().getToken() を使用
  // const { getToken } = useAuth()

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      // const token = await getToken()
      return getMe(null)
    },
  })
}
