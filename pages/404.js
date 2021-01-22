import { Button, Intent, NonIdealState } from "@blueprintjs/core";

import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <NonIdealState
      icon="virus"
      title="עמוד לא נמצא"
      action={
        <Button intent={Intent.PRIMARY} onClick={router.back}>
          חזרה
        </Button>
      }
    />
  );
};

export default NotFoundPage;
