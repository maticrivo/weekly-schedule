import {
  AnchorButton,
  Button,
  ButtonGroup,
  Callout,
  H2,
  HTMLTable,
  Intent,
  NonIdealState,
  ProgressBar,
  Tooltip,
} from "@blueprintjs/core";
import { useEffect, useState } from "react";

import Header from "../../components/header";
import Link from "next/link";
import dayjs from "dayjs";
import { fetcher } from "../../lib/fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/client";

const AdminPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const [deleting, setDeleting] = useState(null);
  const [duplicating, setDuplicating] = useState(null);
  const { data, isValidating, error, mutate } = useSWR("/api/classes");
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onDelete = async (evt) => {
    const id = Number(evt.currentTarget.dataset.id);
    setDeleting(id);
    await fetcher(`/api/classes/${id}`, { method: "DELETE" });
    mutate(data.filter((d) => d.id !== id));
    setDeleting(false);
  };

  const onDuplicate = async (evt) => {
    const id = Number(evt.currentTarget.dataset.id);
    setDuplicating(id);
    const res = await fetcher(`/api/classes/${id}`, { method: "POST" });
    router.push(`/admin/edit/${res.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג'3 - ממשק ניהול" />
      <div className="container">
        {error ? (
          <Callout intent={Intent.DANGER} icon={null}>
            יש כרגע בעיה במערכת, נסו שוב מאוחר יותר או פנו למטיאס
          </Callout>
        ) : (
          <>
            <H2>שיעורים</H2>
            <Link href="/admin/new" passHref>
              <AnchorButton icon="add" text="הוספת שיעור" small />
            </Link>
            {isValidating ? <ProgressBar /> : null}
            {!isValidating && !data?.length ? (
              <NonIdealState
                icon="info-sign"
                title="אין שיעורים במערכת"
                action={
                  <Link href="/admin/new" passHref>
                    <AnchorButton text="שיעור חדש" intent={Intent.PRIMARY} />
                  </Link>
                }
              />
            ) : null}
            {!isValidating && data?.length ? (
              <HTMLTable interactive striped>
                <thead>
                  <tr>
                    <th>שיעור</th>
                    <th>תאריך ושעה</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{dayjs(row.timestamp * 1000).format("DD/MM/YYYY HH:mm")}</td>
                      <td>
                        <ButtonGroup minimal>
                          <Tooltip content="ערוך" disabled={deleting || duplicating}>
                            <Link href={`/admin/edit/${row.id}`} passHref>
                              <AnchorButton
                                icon="edit"
                                intent={Intent.PRIMARY}
                                small
                                disabled={deleting || duplicating}
                              />
                            </Link>
                          </Tooltip>
                          <Tooltip content="העתק" disabled={deleting || duplicating}>
                            <Button
                              icon="duplicate"
                              intent={Intent.SUCCESS}
                              onClick={onDuplicate}
                              small
                              data-id={row.id}
                              disabled={deleting || duplicating}
                              loading={duplicating === row.id}
                            />
                          </Tooltip>
                          <Tooltip content="מחק" disabled={deleting || duplicating}>
                            <Button
                              icon="trash"
                              intent={Intent.DANGER}
                              onClick={onDelete}
                              small
                              data-id={row.id}
                              disabled={deleting || duplicating}
                              loading={deleting === row.id}
                            />
                          </Tooltip>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default AdminPage;
