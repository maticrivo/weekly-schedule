import ClassCard from "./class-card";
import { H5 } from "@blueprintjs/core";
import { useWatch } from "react-hook-form";

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

  return (
    <div>
      <H5>תצוגה מקדימה</H5>
      <ClassCard title={title} contents={contents} zooms={zooms} />
    </div>
  );
};

export default Preview;
