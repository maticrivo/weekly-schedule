import {
  AnchorButton,
  Button,
  Card,
  Code,
  Divider,
  H3,
  H4,
  Intent,
  Position,
  Tooltip,
} from "@blueprintjs/core";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Fragment } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import styles from "./class-card.module.css";

const Contents = dynamic(() => import("./contents"), { ssr: false });

const ClassCard = ({ title, contents, zooms }) => {
  const onCopy = (message, result) => {
    if (result) {
      AppToasterSuccess.show({ message: "הועתק בהצלחה" });
    } else {
      AppToasterFail.show({ message: "העתקה נכשלה" });
    }
  };

  return (
    <section className={styles.classWrapper}>
      <Card>
        <H3>{title}</H3>
        {contents ? <Contents contents={contents} /> : null}
        {zooms.length > 0 ? (
          <>
            {zooms.map((zoom, zdx) => (
              <Fragment key={`zoom-${zdx}`}>
                <div>
                  <H4>פגישת זום:</H4>
                  <p>בשעה: {dayjs(zoom.time).format("HH:mm")}</p>
                  {zoom.contents ? <Contents contents={zoom.contents} /> : null}
                  <AnchorButton
                    outlined
                    intent={Intent.PRIMARY}
                    href={zoom.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    לחצו כאן
                  </AnchorButton>
                  {zoom?.meetingId ? (
                    <p>
                      <strong>ID ישיבה:</strong> <Code>{zoom.meetingId}</Code>{" "}
                      <Tooltip content="העתק" position={Position.TOP}>
                        <CopyToClipboard text={zoom.meetingId} onCopy={onCopy}>
                          <Button icon="duplicate" small minimal />
                        </CopyToClipboard>
                      </Tooltip>
                      <br />
                      {zoom.meetingPassword ? (
                        <>
                          <strong>סיסמה:</strong> <Code>{zoom.meetingPassword}</Code>{" "}
                          <Tooltip content="העתק" position={Position.TOP}>
                            <CopyToClipboard text={zoom.meetingPassword} onCopy={onCopy}>
                              <Button icon="duplicate" small minimal />
                            </CopyToClipboard>
                          </Tooltip>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                {zdx < zooms.length - 1 ? <Divider /> : null}
              </Fragment>
            ))}
          </>
        ) : null}
      </Card>
    </section>
  );
};

export default ClassCard;
