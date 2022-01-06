import {
  Button,
  Callout,
  FormGroup,
  H1,
  InputGroup,
  Intent,
  NonIdealState,
} from "@blueprintjs/core";
import { signIn, useSession } from "next-auth/client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";

const SigninPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = ({ username, password }) => {
    signIn("credentials", { username, password });
  };

  return (
    <NonIdealState icon="lock">
      <H1>כניסה לממשק ניהול</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup label="שם משתמש" labelFor="username">
          <Controller
            name="username"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <InputGroup
                id="username"
                placeholder=""
                intent={fieldState.error ? Intent.DANGER : null}
                {...field}
              />
            )}
          />
        </FormGroup>
        <FormGroup label="סיסמה" labelFor="password">
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <InputGroup
                id="password"
                type="password"
                placeholder=""
                intent={fieldState.error ? Intent.DANGER : null}
                {...field}
              />
            )}
          />
        </FormGroup>
        <Button type="submit" intent={Intent.PRIMARY}>
          כניסה
        </Button>
      </form>
      {router?.query?.error ? (
        <Callout icon={null} intent={Intent.DANGER}>
          שם משתמש או סיסמא שגויים
        </Callout>
      ) : null}
    </NonIdealState>
  );
};

export default SigninPage;
