import styles from "./editor.module.css";
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
    <div className={styles.quillWrapper}>
      <div ref={quillRef} />
    </div>
  );
};

export default Contents;
