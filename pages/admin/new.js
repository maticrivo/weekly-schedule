import { Button, FormGroup, H2, H4, InputGroup, Intent, TextArea } from "@blueprintjs/core";

import Header from "../../components/header";
import styles from "./new.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const NewTaskPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const { register, handleSubmit, errors } = useForm();
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = (data) => {
    console.log({ data });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג׳3 - משימה חדשה" />
      <div className="container">
        <H2>משימה חדשה</H2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <H4>מידע בסיסי</H4>
          <FormGroup label="כותרת" labelFor="title">
            <InputGroup
              id="title"
              name="title"
              inputRef={register({ required: true })}
              intent={errors?.title ? Intent.DANGER : null}
            />
          </FormGroup>
          <FormGroup label="תוכן" labelFor="description">
            <TextArea
              id="description"
              name="description"
              inputRef={register()}
              intent={errors?.description ? Intent.DANGER : null}
              fill
              growVertically
            />
          </FormGroup>
          <H4>ZOOM</H4>
          <FormGroup>
            <Button type="submit" intent={Intent.PRIMARY} className={styles.submit}>
              שמירה
            </Button>
            <Button type="reset" onClick={router.back}>
              ביטול
            </Button>
          </FormGroup>
        </form>
      </div>
    </>
  );
};

export default NewTaskPage;
