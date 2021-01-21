import {
  AnchorButton,
  Button,
  Card,
  Code,
  Divider,
  H5,
  H6,
  Intent,
  Position,
  Tooltip,
} from "@blueprintjs/core";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Fragment } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useWatch } from "react-hook-form";

const Contents = dynamic(() => import("./contents"), { ssr: false });

const Preview = ({ control }) => {
  const title = useWatch({
    control,
    name: "title",
    defaultValue: "",
  });
  const contents = useWatch({
    control,
    name: "contents",
    defaultValue: {},
  });
  const zooms = useWatch({
    control,
    name: "zooms",
    defaultValue: [],
  });

  const onCopy = (message, result) => {
    if (result) {
      AppToasterSuccess.show({ message: "הועתק בהצלחה" });
    } else {
      AppToasterFail.show({ message: "העתקה נכשלה" });
    }
  };

  return (
    <div>
      <H5>תצוגה מקדימה</H5>
      <Card>
        <H5>{title}</H5>
        <Contents contents={contents} />
        {zooms.length > 0 ? (
          <>
            {zooms.map((zoom, zdx) => (
              <Fragment key={`zoom-${zdx}`}>
                <div>
                  <H6>פגישת זום:</H6>
                  {zoom.contents ? (
                    <>
                      <Contents contents={zoom.contents} />
                      <br />
                    </>
                  ) : null}
                  <p>בשעה: {dayjs(zoom.time).format("HH:mm")}</p>
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
    </div>
  );
};

export default Preview;
