import { AnchorButton, Callout, H2, Intent, NonIdealState, ProgressBar } from "@blueprintjs/core";

import Header from "../../components/header";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/client";

const AdminPage = () => {
  const router = useRouter();
  const [user, loading] = useSession();
  const { data, isValidating, error } = useSWR("/api/tasks");
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
