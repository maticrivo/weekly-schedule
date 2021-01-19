import styles from "./editor.module.css";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useQuill } from "react-quilljs";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

const formats = ["bold", "italic", "underline", "list", "bullet", "link", "color", "background"];

const Editor = ({ name, placeholder = "התחל לכתוב כאן את תוכן השיעור...", disabled = false }) => {
  const { setValue, register } = useFormContext();
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
  }, [name, quill, setValue]);
  useEffect(() => {
    if (quill) {
      quill.enable(!disabled);
    }
  }, [quill, disabled]);

  return (
    <div className={styles.quillWrapper}>
      <div ref={quillRef} />
    </div>
  );
};

export default Editor;
