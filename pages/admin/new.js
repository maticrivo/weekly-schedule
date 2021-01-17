import {
  Button,
  Card,
  Divider,
  FormGroup,
  H2,
  H4,
  InputGroup,
  Intent,
  TextArea,
  Tooltip,
} from "@blueprintjs/core";
import { useFieldArray, useForm } from "react-hook-form";

import Header from "../../components/header";
import Preview from "../../components/preview";
import styles from "./new.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const NewTaskPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const { control, register, handleSubmit, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "zoom",
  });
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = (data) => {
    console.log({ data });
  };

  const onNewZoom = () => {
    append({ time: "", description: "", link: "" });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג'3 - שיעור חדש" />
      <div className="container">
        <H2>שיעור חדש</H2>
        <div className={styles.wrapper}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                inputRef={register}
                fill
                growVertically
              />
            </FormGroup>
            <Divider />
            <H4>
              ZOOM{" "}
              <Button icon="add" small minimal onClick={onNewZoom}>
                הוספת זום
              </Button>
            </H4>
            {fields.map((field, index) => (
              <Card key={field.id}>
                <FormGroup label="שעה" labelFor={`zoom-${field.id}-time`}>
                  <InputGroup
                    id={`zoom-${field.id}-time`}
                    name={`zoom[${index}].time`}
                    inputRef={register({ required: true })}
                    intent={errors?.zoom?.[index]?.time ? Intent.DANGER : null}
                    defaultValue={field.value}
                  />
                </FormGroup>
                <FormGroup label="קישור" labelFor={`zoom-${field.id}-link`}>
                  <InputGroup
                    id={`zoom-${field.id}-link`}
                    name={`zoom[${index}].link`}
                    inputRef={register({ required: true })}
                    intent={errors?.zoom?.[index]?.link ? Intent.DANGER : null}
                    defaultValue={field.value}
                  />
                </FormGroup>
                <FormGroup label="תוכן" labelFor={`zoom-${field.id}-description`}>
                  <TextArea
                    id={`zoom-${field.id}-description`}
                    name={`zoom[${index}].description`}
                    inputRef={register()}
                    fill
                    growVertically
                    defaultValue={field.value}
                  />
                </FormGroup>
                <Tooltip content="מחיקת פגישת זום">
                  <Button
                    icon="trash"
                    small
                    outlined
                    intent={Intent.DANGER}
                    onClick={() => remove(index)}
                  />
                </Tooltip>
              </Card>
            ))}
            <Divider />
            <FormGroup>
              <Button type="submit" intent={Intent.PRIMARY} className={styles.submit}>
                שמור
              </Button>
              <Button type="reset" onClick={router.back}>
                ביטול
              </Button>
            </FormGroup>
          </form>
          <Preview control={control} />
        </div>
      </div>
    </>
  );
};

export default NewTaskPage;
