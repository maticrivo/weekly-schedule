import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import { useController, useFormContext } from "react-hook-form";

import dayjs from "dayjs";

function formatDate(d) {
  return dayjs(d).format("DD/MM/YYYY HH:mm");
}

function parseDate(s) {
  return dayjs(s).toDate();
}

const DateTimePicker = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: new Date(),
  });

  return (
    <div className={"ltrWrapper"}>
      <DateInput
        formatDate={formatDate}
        parseDate={parseDate}
        canClearSelection={false}
        timePrecision={TimePrecision.MINUTE}
        timePickerProps={{
          showArrowButtons: true,
        }}
        onChange={onChange}
        value={value}
        popoverProps={{
          popoverClassName: "ltrWrapper",
        }}
        {...props}
      />
    </div>
  );
};

export default DateTimePicker;
