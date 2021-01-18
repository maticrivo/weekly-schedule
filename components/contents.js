import "quill/dist/quill.bubble.css";

import clsx from "clsx";
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
    <div className={clsx(styles.quillWrapper, styles.quillPreview)}>
      <div ref={quillRef} />
    </div>
  );
};

export default Contents;
