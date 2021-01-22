import { NonIdealState, Spinner } from "@blueprintjs/core";

import { useSession } from "next-auth/client";

const Layout = ({ children }) => {
  const [, loading] = useSession();

  if (loading) {
    return (
      <NonIdealState>
        <Spinner />
      </NonIdealState>
    );
  }
  return children;
};

export default Layout;
