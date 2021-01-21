import "dayjs/locale/he";

import { Alignment, H3, Intent, NavbarGroup, NonIdealState, Spinner } from "@blueprintjs/core";

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
                    // <Card key={`task-${idx}`}>
                    //   <H5>{task.title}</H5>
                    //   {task.description && renderDescription(task.description)}
                    //   {task.zoom && (
                    //     <>
                    //       <H6>פגישת זום:</H6>
                    //       {task.zoom.map((zoom, zdx) => (
                    //         <>
                    //           <div key={`task-${idx}-zoom-${zdx}`}>
                    //             {zoom.description}
                    //             <br />
                    //             בשעה: {zoom.time}
                    //             <br />
                    //             <AnchorButton
                    //               outlined
                    //               intent={Intent.PRIMARY}
                    //               href={zoom.link}
                    //               target="_blank"
                    //               rel="noopener noreferrer"
                    //             >
                    //               לחצו כאן
                    //             </AnchorButton>
                    //             {zoom?.meeting?.id && (
                    //               <p>
                    //                 <strong>ID ישיבה:</strong> <Code>{zoom.meeting.id}</Code>{" "}
                    //                 <Tooltip content="העתק" position={Position.TOP}>
                    //                   <CopyToClipboard text={zoom.meeting.id} onCopy={onCopy}>
                    //                     <Button icon="duplicate" small minimal />
                    //                   </CopyToClipboard>
                    //                 </Tooltip>
                    //                 <br />
                    //                 {zoom.meeting.password && (
                    //                   <>
                    //                     <strong>סיסמה:</strong> <Code>{zoom.meeting.password}</Code>{" "}
                    //                     <Tooltip content="העתק" position={Position.TOP}>
                    //                       <CopyToClipboard
                    //                         text={zoom.meeting.password}
                    //                         onCopy={onCopy}
                    //                       >
                    //                         <Button icon="duplicate" small minimal />
                    //                       </CopyToClipboard>
                    //                     </Tooltip>
                    //                   </>
                    //                 )}
                    //               </p>
                    //             )}
                    //           </div>
                    //         </>
                    //       ))}
                    //     </>
                    //   )}
                    //   {task?.assignments && (
                    //     <>
                    //       <H6>משימות:</H6>
                    //       <ul>
                    //         {task.assignments.map((assignment, jdx) => (
                    //           <TaskAssignment
                    //             key={`task-${idx}-assignment-${jdx}`}
                    //             assignment={assignment}
                    //           />
                    //         ))}
                    //       </ul>
                    //     </>
                    //   )}
                    // </Card>
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
