import clsx from "clsx";
import styles from "./contents.module.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";

const Contents = ({ contents }) => {
  const { quill, quillRef } = useQuill({ theme: "bubble" });
  useEffect(() => {
    if (quill) {
      quill.enable(false);
      quill.setContents(contents);
    }
  }, [contents, quill]);

  return (
    <div className={clsx("ltrWrapper", styles.wrapper)}>
      <div ref={quillRef} />
    </div>
  );
};

export default Contents;
