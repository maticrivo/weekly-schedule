import { Card, H5 } from "@blueprintjs/core";
import { useWatch } from "react-hook-form";

const Preview = ({ control }) => {
  const title = useWatch({
    control,
    name: "title",
    defaultValue: "",
  });

  return (
    <Card>
      <H5>תצוגה מקדימה</H5>
      <div>{title}</div>
    </Card>
  );
};

export default Preview;
