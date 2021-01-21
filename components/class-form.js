import {
  Button,
  Card,
  Divider,
  FormGroup,
  H4,
  InputGroup,
  Intent,
  Tooltip,
} from "@blueprintjs/core";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";

import DateTimePicker from "./date-time-picker";
import Preview from "./preview";
import { TimePicker } from "@blueprintjs/datetime";
import dynamic from "next/dynamic";
import styles from "./class-form.module.css";

const Editor = dynamic(() => import("./editor"), { ssr: false });

const ClassForm = ({
  onSubmit,
  onCancel,
  onDelete,
  submitting = false,
  deleting = false,
  initialValues = {},
}) => {
  const methods = useForm({ defaultValues: initialValues });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "zooms",
    keyName: "key",
  });

  const onNewZoom = () => {
    append({ id: -1, time: "", link: "", meetingId: "", meetingPassword: "", contents: {} });
  };

  return (
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
            <Card key={field.key}>
              <input
                type="hidden"
                name={`zooms[${index}].id`}
                ref={methods.register()}
                value={field.id || -1}
              />
              <FormGroup label="שעה" labelFor={`zooms-${field.id}-time`}>
                <div className="ltrWrapper">
                  <Controller
                    control={methods.control}
                    name={`zooms[${index}].time`}
                    defaultValue={field.time || methods.getValues("date")}
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
                  defaultValue={field.link || ""}
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup label="ID ישיבה" labelFor={`zooms-${field.id}-meetingId`}>
                <InputGroup
                  id={`zooms-${field.id}-meetingId`}
                  name={`zooms[${index}].meetingId`}
                  inputRef={methods.register()}
                  intent={methods?.errors?.zooms?.[index]?.meetingId ? Intent.DANGER : null}
                  defaultValue={field.meetingId || ""}
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup label="סיסמה" labelFor={`zooms-${field.id}-meetingPassword`}>
                <InputGroup
                  id={`zooms-${field.id}-meetingPassword`}
                  name={`zooms[${index}].meetingPassword`}
                  inputRef={methods.register()}
                  intent={methods?.errors?.zooms?.[index]?.meetingPassword ? Intent.DANGER : null}
                  defaultValue={field.meetingPassword || ""}
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup label="תוכן" labelFor={`zooms-${field.id}-contents`}>
                <Editor
                  name={`zooms[${index}].contents`}
                  initial={field.contents}
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
          <FormGroup className={styles.buttonWrapper}>
            <Button type="submit" intent={Intent.PRIMARY} disabled={deleting} loading={submitting}>
              שמירה
            </Button>
            {onDelete ? (
              <Button
                type="button"
                intent={Intent.DANGER}
                onClick={onDelete}
                disabled={submitting}
                loading={deleting}
              >
                מחיקה
              </Button>
            ) : null}
            <Button type="reset" onClick={onCancel} disabled={submitting || deleting}>
              ביטול
            </Button>
          </FormGroup>
        </form>
      </FormProvider>
      <Preview control={methods.control} />
    </div>
  );
};

export default ClassForm;
