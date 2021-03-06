import { Member } from "../model/member";
import { Comment } from "../model/comment";
import { Fos } from "../model/fos";
import { Journal } from "../model/journal";
import { Paper } from "../model/paper";
import { PaperSource } from "../model/paperSource";
import { PaperAuthor } from "../model/author";
import { CurrentUser } from "../model/currentUser";

export const RAW = {
  AUTHOR: require("./author.json") as PaperAuthor,
  COMMENT: require("./comment.json") as Comment,
  CURRENT_USER: require("./currentUser.json") as CurrentUser,
  FOS: require("./fos.json") as Fos,
  JOURNAL: require("./journal.json") as Journal,
  MEMBER: require("./member.json") as Member,
  PAPER: require("./paper.json") as Paper,
  PAPER_SOURCE: require("./paperSource.json") as PaperSource,
  COMMENTS_RESPONSE: require("./commentsResponse.json"),
  AGGREGATION_RESPONSE: require("./aggregation.json"),
  JOURNAL_PAPERS_RESPONSE: require("./journalPapersResponse.json"),
};
