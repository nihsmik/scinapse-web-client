import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router";
import { IArticleSearchStateRecord } from "../records";
import { IPapersRecord } from "../../../model/paper";
import { ICurrentUserRecord } from "../../../model/currentUser";

export enum SEARCH_FETCH_ITEM_MODE {
  QUERY,
  REFERENCES,
  CITED,
}

export enum SEARCH_FILTER_MODE {
  PUBLICATION_YEAR,
  JOURNAL_IF,
}

export interface IArticleSearchContainerProps extends DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

export interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

export interface IArticleSearchSearchParams {
  query?: string;
  page?: string;
  references?: string;
  cited?: string;
}