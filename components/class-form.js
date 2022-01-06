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
    append({
      id: -1,
      time: methods.getValues().date,
      link: "",
      meetingId: "",
      meetingPassword: "",
      contents: {},
    });
  };

  return (
    <div className={styles.wrapper}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <H4>מידע בסיסי</H4>
          <FormGroup label="כותרת" labelFor="title">
            <Controller
              name="title"
              control={methods.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <InputGroup
                  id="title"
                  intent={fieldState.error ? Intent.DANGER : null}
                  disabled={submitting}
                  {...field}
                />
              )}
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
          {fields.map((f, idx) => (
            <Card key={f.key}>
              <input
                type="hidden"
                name={`zooms[${idx}].id`}
                value={f.id || -1}
                {...methods.register(`zooms[${idx}].id`)}
              />
              <FormGroup label="שעה" labelFor={`zooms-${f.id}-time`}>
                <div className="ltrWrapper inline-block">
                  <Controller
                    control={methods.control}
                    name={`zooms[${idx}].time`}
                    rules={{ required: true }}
                    render={({ field }) => <TimePicker disabled={submitting} {...field} />}
                  />
                </div>
              </FormGroup>
              <FormGroup label="קישור" labelFor={`zooms-${f.id}-link`}>
                <Controller
                  name={`zooms[${idx}].link`}
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      id={`zooms-${field.id}-link`}
                      intent={fieldState.error ? Intent.DANGER : null}
                      disabled={submitting}
                      {...field}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup label="ID ישיבה" labelFor={`zooms-${f.id}-meetingId`}>
                <Controller
                  name={`zooms[${idx}].meetingId`}
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      id={`zooms-${field.id}-meetingId`}
                      intent={fieldState.error ? Intent.DANGER : null}
                      disabled={submitting}
                      {...field}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup label="סיסמה" labelFor={`zooms-${f.id}-meetingPassword`}>
                <Controller
                  name={`zooms[${idx}].meetingPassword`}
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      id={`zooms-${field.id}-meetingPassword`}
                      intent={fieldState.error ? Intent.DANGER : null}
                      disabled={submitting}
                      {...field}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup label="תוכן" labelFor={`zooms-${f.id}-contents`}>
                <Editor
                  name={`zooms[${idx}].contents`}
                  initial={f.contents}
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
                  onClick={() => remove(idx)}
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
