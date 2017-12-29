import { Dispatch } from "redux";
import axios from "axios";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SEARCH_SORTING } from "./records";
import {
  IGetPapersParams,
  IGetPapersResult,
  IPostPaperCommentParams,
  IGetCitedPapersParams,
  IDeletePaperCommentParams,
  IDeletePaperCommentResult,
  IGetPaperCommentsParams,
  IGetPaperCommentsResult,
} from "../../api/article";
import ArticleAPI from "../../api/article";
import { IPaperCommentRecord } from "../../model/paperComment";
import { IPaperRecord } from "../../model/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import papersQueryFormatter from "../../helpers/papersQueryFormatter";

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return async (dispatch: Dispatch<any>) => {
    if (searchInput.length < 2) {
      alert("Search query length has to be over 2.");
    } else {
      dispatch(push(`/search?query=${papersQueryFormatter.formatPapersQuery({ text: searchInput })}&page=1`));
    }
  };
}

export function addFilter({ text, yearFrom, yearTo }: { text: string; yearFrom?: number; yearTo?: number }) {
  return push(`/search?query=${papersQueryFormatter.formatPapersQuery({ text, yearFrom, yearTo })}&page=1`);
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}

export function getPapers(params: IGetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const papersData: IGetPapersResult = await ArticleAPI.getPapers({
        page: params.page,
        query: params.query,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function getCitedPapers(params: IGetCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS });

    try {
      const papersData: IGetPapersResult = await ArticleAPI.getCitedPapers({
        page: params.page,
        paperId: params.paperId,
        cancelTokenSource: params.cancelTokenSource,
      });

      const targetPaper: IPaperRecord = await ArticleAPI.getPaper(params.paperId, params.cancelTokenSource);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_CITED_GET_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
          targetPaper,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS });
      }
    }
  };
}

export function getReferencesPapers(params: IGetCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS });

    try {
      const papersData: IGetPapersResult = await ArticleAPI.getReferencesPapers({
        page: params.page,
        paperId: params.paperId,
        cancelTokenSource: params.cancelTokenSource,
      });

      const targetPaper: IPaperRecord = await ArticleAPI.getPaper(params.paperId, params.cancelTokenSource);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_CITED_GET_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
          targetPaper,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS });
      }
    }
  };
}

export function getMoreComments(params: IGetPaperCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS,
      payload: {
        paperId: params.paperId,
      },
    });

    try {
      const commentsData: IGetPaperCommentsResult = await ArticleAPI.getPaperComments({
        page: params.page,
        paperId: params.paperId,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS,
        payload: {
          paperId: params.paperId,
          comments: commentsData.comments,
          nextPage: params.page + 1,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get More comments! ${err}`);

        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: params.paperId,
          },
        });
      }
    }
  };
}

export function changeCommentInput(index: number, comment: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
    payload: {
      index,
      comment,
    },
  };
}

export function toggleAbstract(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT,
    payload: {
      index,
    },
  };
}

export function toggleComments(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS,
    payload: {
      index,
    },
  };
}

export function toggleAuthors(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS,
    payload: {
      index,
    },
  };
}

export function visitTitle(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_VISIT_TITLE,
    payload: {
      index,
    },
  };
}

export function handleCommentPost({ paperId, comment }: IPostPaperCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_COMMENT_POST,
      payload: {
        paperId,
      },
    });

    try {
      const recordifiedComment: IPaperCommentRecord = await ArticleAPI.postPaperComment({
        paperId,
        comment,
      });
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_COMMENT_POST,
        payload: {
          comment: recordifiedComment,
          paperId,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_COMMENT_POST,
        payload: {
          paperId,
        },
      });
      console.error(err);
    }
  };
}

export function closeFirstOpen(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
    payload: {
      index,
    },
  };
}

export function deleteComment(params: IDeletePaperCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_DELETE_COMMENT,
    });

    try {
      const deletePaperCommentResult: IDeletePaperCommentResult = await ArticleAPI.deletePaperComment(params);

      if (!deletePaperCommentResult.success) throw new Error("Failed");

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: params.paperId,
          commentId: params.commentId,
        },
      });
      alertToast({
        type: "success",
        message: "Succeeded to delete Your comment!!",
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_DELETE_COMMENT,
      });

      alert(`Failed to delete Review! ${err}`);
    }
  };
}