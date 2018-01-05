import * as React from "react";
// import { trackAndOpenLink } from "../../../../helpers/handleGA";
import { IAuthorsProps } from "./authors";

import Authors from "./authors";

const styles = require("./publishInfoList.scss");

export interface IPublishInfoListProps extends IAuthorsProps {
  journalName: string;
  journalIF: number;
  year: number;
}

const PublishInfoList = (props: IPublishInfoListProps) => {
  return (
    <div className={styles.publishInfoList}>
      {props.journalName ? (
        <a
          // onClick={() => {
          //   trackAndOpenLink("https://medium.com/pluto-network", "searchItemJournal");
          // }}
          className={styles.underline}
        >
          {props.journalName}
        </a>
      ) : null}
      {props.journalIF ? <span className={styles.bold}>{`[IF: ${props.journalIF}]`}</span> : null}
      {props.journalName ? <div className={styles.separatorLine} /> : null}
      {props.year ? <span className={styles.bold}>{props.year}</span> : null}
      {props.year ? <div className={styles.separatorLine} /> : null}
      <Authors authors={props.authors} isAuthorsOpen={props.isAuthorsOpen} toggleAuthors={props.toggleAuthors} />
    </div>
  );
};

export default PublishInfoList;
