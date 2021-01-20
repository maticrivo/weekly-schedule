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

import Header from "../../components/header";
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/client";

const AdminPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const { data, isValidating, error } = useSWR("/api/classes");
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="למידה מרחוק ג'3 - ממשק ניהול" />
      <div className="container">
        <H2>שיעורים</H2>
        <Link href="/admin/new" passHref>
          <AnchorButton icon="add" text="הוספת שיעור" small />
        </Link>
        {isValidating && <ProgressBar />}
        {!isValidating && !data?.length && (
          <NonIdealState
            icon="info-sign"
            title="אין שיעורים במערכת"
            action={
              <Link href="/admin/new" passHref>
                <AnchorButton text="שיעור חדש" intent={Intent.PRIMARY} />
              </Link>
            }
          />
        )}
        {!isValidating && data?.length && (
          <HTMLTable>
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
                      <Tooltip content="עריכה">
                        <Link href={`/admin/edit/${row.id}`} passHref>
                          <AnchorButton icon="edit" intent={Intent.PRIMARY} small />
                        </Link>
                      </Tooltip>
                      <Tooltip content="מחיקה">
                        <Button icon="trash" intent={Intent.DANGER} small />
                      </Tooltip>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        )}
        {error && (
          <Callout intent={Intent.DANGER} icon={null}>
            יש כרגע בעיה במערכת, נסו שוב מאוחר יותר או פנו למטיאס
          </Callout>
        )}
      </div>
    </>
  );
};

export default AdminPage;
