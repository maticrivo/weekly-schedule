import { useEffect, useState } from "react";

import ClassForm from "../../components/class-form";
import { H2 } from "@blueprintjs/core";
import Header from "../../components/header";
import { fetcher } from "../../lib/fetcher";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { normalizeData } from "../../lib/utils";

const NewClassPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = async (data) => {
    const normalizedData = normalizeData(data);
    setSubmitting(true);
    await fetcher("/api/classes", { method: "POST", body: JSON.stringify(normalizedData) });
    router.push("/admin");
  };

  const onCancel = () => {
    router.push("/admin");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג'3 - הוספת שיעור חדש" />
      <div className="container">
        <H2>שיעור חדש</H2>
        <ClassForm onSubmit={onSubmit} onCancel={onCancel} submitting={submitting} />
      </div>
    </>
  );
};

export default NewClassPage;
