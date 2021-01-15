import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import useSWR from 'swr'
import {
  AnchorButton,
  Callout,
  H2,
  Intent,
  NonIdealState,
  ProgressBar,
} from '@blueprintjs/core'

import Header from '../../components/header'

const Admin = () => {
  const router = useRouter()
  const [user, loading] = useSession()
  const { data, isValidating, error } = useSWR('/api/tasks')
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin')
    }
  }, [loading, user])

  if (!user) {
    return null
  }

  return (
    <>
      <Header title="למידה מרחוק ג׳3 - ממשק ניהול" />
      <div className="container">
        <H2>משימות</H2>
        {isValidating && <ProgressBar />}
        {!isValidating && !data?.length && (
          <NonIdealState
            icon="info-sign"
            title="אין משימות במערכת"
            action={
              <Link href="/admin/new" passHref>
                <AnchorButton text="משימה חדשה" intent={Intent.PRIMARY} />
              </Link>
            }
          />
        )}
        {error && (
          <Callout intent={Intent.DANGER} icon={null}>
            יש כרגע בעיה במערכת, נסו שוב מאוחר יותר או פנו למטיאס
          </Callout>
        )}
      </div>
    </>
  )
}

export default Admin
