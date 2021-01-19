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
        {zooms.length > 0 && (
          <>
            <H6>פגישות זום:</H6>
            {zooms.map((zoom, zdx) => (
              <>
                <div key={`zoom-${zdx}`}>
                  <p>בשעה: {dayjs(zoom.time).format("HH:mm")}</p>
                  {console.log("AAAAA", zoom.contents)}
                  {zoom.contents && (
                    <>
                      <Contents contents={zoom.contents} />
                      <br />
                    </>
                  )}
                  <AnchorButton
                    outlined
                    intent={Intent.PRIMARY}
                    href={zoom.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    לחצו כאן
                  </AnchorButton>
                  {zoom?.meetingId && (
                    <p>
                      <strong>ID ישיבה:</strong> <Code>{zoom.meetingId}</Code>{" "}
                      <Tooltip content="העתק" position={Position.TOP}>
                        <CopyToClipboard text={zoom.meetingId} onCopy={onCopy}>
                          <Button icon="duplicate" small minimal />
                        </CopyToClipboard>
                      </Tooltip>
                      <br />
                      {zoom.meetingPassword && (
                        <>
                          <strong>סיסמה:</strong> <Code>{zoom.meetingPassword}</Code>{" "}
                          <Tooltip content="העתק" position={Position.TOP}>
                            <CopyToClipboard text={zoom.meetingPassword} onCopy={onCopy}>
                              <Button icon="duplicate" small minimal />
                            </CopyToClipboard>
                          </Tooltip>
                        </>
                      )}
                    </p>
                  )}
                </div>
                {zdx < zooms.length - 1 && <Divider />}
              </>
            ))}
          </>
        )}
      </Card>
    </div>
  );
};

export default Preview;
