import { Card, H5 } from "@blueprintjs/core";

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

  return (
    <div>
      <H5>תצוגה מקדימה</H5>
      <Card>
        <H5>{title}</H5>
        <Contents contents={contents} />
      </Card>
    </div>
  );
};

export default Preview;
