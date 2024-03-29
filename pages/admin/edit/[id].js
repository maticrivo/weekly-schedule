import { H2, Spinner } from "@blueprintjs/core";
import { useEffect, useState } from "react";

import ClassForm from "../../../components/class-form";
import Header from "../../../components/header";
import dayjs from "dayjs";
import { fetcher } from "../../../lib/fetcher";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { useSession } from "next-auth/client";
import { normalizeData } from "../../../lib/utils";

const EditClassPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mutate } = useSWRConfig();
  const { data, isValidating } = useSWR(
    () => router.query.id && `/api/classes/${router.query.id}`,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  useEffect(() => {
    if (data && !isValidating) {
      setInitialValues({
        title: data.title,
        contents: data.contents ? JSON.parse(data.contents) : null,
        date: dayjs(data.timestamp * 1000).toDate(),
        zooms: data.zooms.map((zoom) => ({
          id: zoom.id,
          time: dayjs(zoom.timestamp * 1000).toDate(),
          link: zoom.link,
          meetingId: zoom.meetingId,
          meetingPassword: zoom.meetingPassword,
          contents: zoom.contents ? JSON.parse(zoom.contents) : null,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isValidating]);

  const onSubmit = async (data) => {
    const normalizedData = normalizeData(data);
    setSubmitting(true);
    await fetcher(`/api/classes/${router.query.id}`, {
      method: "PUT",
      body: JSON.stringify(normalizedData),
    });
    await mutate(`/api/classes/${router.query.id}`);
    router.push("/admin");
  };

  const onDelete = async () => {
    setDeleting(true);
    await fetcher(`/api/classes/${router.query.id}`, {
      method: "DELETE",
    });
    router.push("/admin");
  };

  const onCancel = () => {
    router.push("/admin");
  };

  if (!user) {
    return null;
  }

  if (isValidating) {
    return <Spinner />;
  }

  return (
    <>
      <Header title="למידה מרחוק ד'3 - עריכת שיעור" />
      <div className="container">
        <H2>עריכת שיעור</H2>
        {initialValues ? (
          <ClassForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            onDelete={onDelete}
            submitting={submitting}
            deleting={deleting}
            initialValues={initialValues}
          />
        ) : null}
      </div>
    </>
  );
};

export default EditClassPage;
