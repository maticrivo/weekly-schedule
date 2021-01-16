import {
  Button,
  Callout,
  FormGroup,
  H1,
  InputGroup,
  Intent,
  NonIdealState,
} from '@blueprintjs/core'
import { signIn, useSession } from 'next-auth/client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

const SigninPage = () => {
  const router = useRouter()
  const [user, loading] = useSession()
  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin')
    }
  }, [loading, user])

  const onSubmit = ({ username, password }) => {
    signIn('credentials', { username, password })
  }

  return (
    <NonIdealState icon="lock">
      <H1>כניסה לממשק ניהול</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup label="שם משתמש" labelFor="username">
          <InputGroup
            id="username"
            name="username"
            inputRef={register({ required: true })}
            placeholder=""
            intent={errors?.username ? Intent.DANGER : null}
          />
        </FormGroup>
        <FormGroup label="סיסמה" labelFor="password">
          <InputGroup
            id="password"
            type="password"
            name="password"
            inputRef={register({ required: true })}
            intent={errors?.password ? Intent.DANGER : null}
          />
        </FormGroup>
        <Button type="submit" intent={Intent.PRIMARY}>
          כניסה
        </Button>
      </form>
      {router?.query?.error && (
        <Callout icon={null} intent={Intent.DANGER}>
          שם משתמש או סיסמא שגויים
        </Callout>
      )}
    </NonIdealState>
  )
}

export default SigninPage
