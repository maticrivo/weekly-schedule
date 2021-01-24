import "dayjs/locale/he";

import { Alignment, H3, Intent, NavbarGroup, NonIdealState, Spinner } from "@blueprintjs/core";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../lib/utils";

import ClassCard from "../components/class-card";
import { DateInput } from "@blueprintjs/datetime";
import Header from "../components/header";
import dayjs from "dayjs";
import styles from "./index.module.css";
import useSWR from "swr";
import { useState } from "react";

function formatDate(d) {
  return dayjs(d).format("DD/MM/YYYY");
}

function parseDate(s) {
  return dayjs(s).toDate();
}

const IndexPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { data, isValidating } = useSWR(() => {
    const start = selectedDate.startOf("day");
    const end = start.endOf("day");
    return `/api/classes/full?start=${start.unix()}&end=${end.unix()}`;
  });

  const onChangeSelectedDate = (d) => {
    setSelectedDate(dayjs(d));
  };

  return (
    <>
      <Header title="למידה מרחוק ג'3">
        <NavbarGroup align={Alignment.LEFT}>
          <DateInput
            inputProps={{
              leftIcon: "calendar",
            }}
            formatDate={formatDate}
            parseDate={parseDate}
            canClearSelection={false}
            onChange={onChangeSelectedDate}
            popoverProps={{
              popoverClassName: "ltrWrapper",
            }}
            value={selectedDate.toDate()}
            highlightCurrentDay
            dayPickerProps={{
              locale: "he",
              months: MONTHS,
              weekdaysLong: WEEKDAYS_LONG,
              weekdaysShort: WEEKDAYS_SHORT,
            }}
          />
        </NavbarGroup>
      </Header>
      <main className={styles.main}>
        <div className="container">
          {isValidating ? (
            <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE} />
          ) : (
            <>
              {data?.length > 0 ? (
                <>
                  <H3>
                    משימות ל
                    {selectedDate.startOf("day").unix() === dayjs().startOf("day").unix()
                      ? "היום"
                      : `יום ${selectedDate.locale("he").format("dddd DD בMMMM")}`}
                  </H3>

                  {data.map(({ id, title, contents, zooms }) => (
                    <ClassCard
                      key={`class-${id}`}
                      title={title}
                      contents={contents}
                      zooms={zooms}
                    />
                  ))}
                </>
              ) : (
                <NonIdealState
                  icon="clean"
                  title={
                    selectedDate.startOf("day").unix() === dayjs().startOf("day").unix()
                      ? "אין משימות להיום"
                      : `אין משימות ליום ${selectedDate.locale("he").format("dddd DD בMMMM")}`
                  }
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default IndexPage;
