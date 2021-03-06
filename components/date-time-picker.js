import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../lib/utils";
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
    <div className="ltrWrapper inline-block">
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
        dayPickerProps={{
          locale: "he",
          months: MONTHS,
          weekdaysLong: WEEKDAYS_LONG,
          weekdaysShort: WEEKDAYS_SHORT,
        }}
        {...props}
      />
    </div>
  );
};

export default DateTimePicker;
