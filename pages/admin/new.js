import {
  Button,
  Card,
  Divider,
  FormGroup,
  H2,
  H4,
  InputGroup,
  Intent,
  Tooltip,
} from "@blueprintjs/core";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import DateTimePicker from "../../components/date-time-picker";
import Header from "../../components/header";
import Preview from "../../components/preview";
import { TimePicker } from "@blueprintjs/datetime";
import dynamic from "next/dynamic";
import { fetcher } from "../../lib/fetcher";
import styles from "./new.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const Editor = dynamic(() => import("../../components/editor"), { ssr: false });

const NewTaskPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const [submitting, setSubmitting] = useState(false);
  const methods = useForm();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "zooms",
  });
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    await fetcher("/api/classes", { method: "POST", body: JSON.stringify(data) });
    setSubmitting(false);
    router.push("/admin");
  };

  const onNewZoom = () => {
    append({ time: "", description: "", link: "" });
  };

  const onCancel = () => {
    router.push("/admin");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג'3 - הוספת שיעור חדש" />
      <div className="container">
        <H2>שיעור חדש</H2>
        <div className={styles.wrapper}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <H4>מידע בסיסי</H4>
              <FormGroup label="כותרת" labelFor="title">
                <InputGroup
                  id="title"
                  name="title"
                  inputRef={methods.register({ required: true })}
                  intent={methods?.errors?.title ? Intent.DANGER : null}
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup label="תאריך" labelFor="date">
                <DateTimePicker name="date" disabled={submitting} />
              </FormGroup>
              <FormGroup label="תוכן" labelFor="contents">
                <Editor name="contents" disabled={submitting} />
              </FormGroup>
              <Divider />
              <H4>
                זומים{" "}
                <Button icon="add" small minimal onClick={onNewZoom} disabled={submitting}>
                  הוספת זום
                </Button>
              </H4>
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <FormGroup label="שעה" labelFor={`zooms-${field.id}-time`}>
                    <div className="ltrWrapper">
                      <Controller
                        control={methods.control}
                        name={`zooms[${index}].time`}
                        defaultValue={methods.getValues("date")}
                        rules={{ required: true }}
                        render={({ onChange, value }) => (
                          <TimePicker onChange={onChange} value={value} disabled={submitting} />
                        )}
                      />
                    </div>
                  </FormGroup>
                  <FormGroup label="קישור" labelFor={`zooms-${field.id}-link`}>
                    <InputGroup
                      id={`zooms-${field.id}-link`}
                      name={`zooms[${index}].link`}
                      inputRef={methods.register({ required: true })}
                      intent={methods?.errors?.zooms?.[index]?.link ? Intent.DANGER : null}
                      defaultValue=""
                      disabled={submitting}
                    />
                  </FormGroup>
                  <FormGroup label="ID ישיבה" labelFor={`zooms-${field.id}-meetingId`}>
                    <InputGroup
                      id={`zooms-${field.id}-meetingId`}
                      name={`zooms[${index}].meetingId`}
                      inputRef={methods.register()}
                      intent={methods?.errors?.zooms?.[index]?.meetingId ? Intent.DANGER : null}
                      defaultValue=""
                      disabled={submitting}
                    />
                  </FormGroup>
                  <FormGroup label="סיסמה" labelFor={`zooms-${field.id}-meetingPassword`}>
                    <InputGroup
                      id={`zooms-${field.id}-meetingPassword`}
                      name={`zooms[${index}].meetingPassword`}
                      inputRef={methods.register()}
                      intent={
                        methods?.errors?.zooms?.[index]?.meetingPassword ? Intent.DANGER : null
                      }
                      defaultValue=""
                      disabled={submitting}
                    />
                  </FormGroup>
                  <FormGroup label="תוכן" labelFor={`zooms-${field.id}-contents`}>
                    <Editor
                      name={`zooms[${index}].contents`}
                      disabled={submitting}
                      placeholder="התחל לכתוב כאן את תוכן הזום..."
                    />
                  </FormGroup>
                  <Tooltip content="מחיקת פגישת זום">
                    <Button
                      icon="trash"
                      small
                      outlined
                      intent={Intent.DANGER}
                      onClick={() => remove(index)}
                      disabled={submitting}
                    />
                  </Tooltip>
                </Card>
              ))}
              <Divider />
              <FormGroup>
                <Button
                  type="submit"
                  intent={Intent.PRIMARY}
                  className={styles.submit}
                  loading={submitting}
                >
                  שמור
                </Button>
                <Button type="reset" onClick={onCancel} disabled={submitting}>
                  ביטול
                </Button>
              </FormGroup>
            </form>
          </FormProvider>
          <Preview control={methods.control} />
        </div>
      </div>
    </>
  );
};

export default NewTaskPage;
