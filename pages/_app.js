import "modern-normalize/modern-normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "quill/dist/quill.bubble.css";
import "../styles.css";

import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";
import { fetcher } from "../lib/fetcher";

const App = ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <SWRConfig
        value={{
          fetcher,
          refreshInterval: 0,
          revalidateOnFocus: true,
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </Provider>
  );
};

export default App;
