import { Alignment, Navbar } from "@blueprintjs/core";

import Head from "next/head";
import styles from "./header.module.css";

const Header = ({ children, title = "למידה מרחוק ד'3" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={styles.header}>
        <Navbar fixedToTop>
          <div className="container">
            <Navbar.Group align={Alignment.RIGHT}>
              <Navbar.Heading>{title}</Navbar.Heading>
            </Navbar.Group>
            {children}
          </div>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
