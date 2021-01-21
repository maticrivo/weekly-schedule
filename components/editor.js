import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useQuill } from "react-quilljs";

const modules = {
  toolbar: [
    [{ header: [5, 6, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "color",
  "background",
];

const Editor = ({
  name,
  initial = null,
  placeholder = "התחל לכתוב כאן את תוכן השיעור...",
  disabled = false,
}) => {
  const { setValue, getValues, register } = useFormContext();
  const { quill, quillRef } = useQuill({
    modules,
    formats,
    theme: "bubble",
    placeholder,
  });
  useEffect(() => {
    register(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setValue(name, quill.getContents());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, quill]);
  useEffect(() => {
    if (quill) {
      quill.enable(!disabled);
      quill.setContents(initial);
    }
  }, [quill, disabled, initial]);
  useEffect(() => {
    if (quill) {
      quill.setContents(getValues(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, name]);

  return (
    <div className="ltrWrapper">
      <div ref={quillRef} />
    </div>
  );
};

export default Editor;
