import { parse } from "qs";
import * as React from "react";
import { CancelTokenSource } from "axios";
import { connect } from "react-redux";
import { InputBox } from "../common/inputBox/inputBox";
import { ISearchItemsInfo } from "./records";
import Icon from "../../icons";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import SearchItem from "./components/searchItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
import FilterContainer from "./components/filterContainer";
import { IPapersRecord } from "../../model/paper";
import { trackAndOpenLink } from "../../helpers/handleGA";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter from "../../helpers/papersQueryFormatter";
import numberWithCommas from "../../helpers/numberWithCommas";
import { FetchSearchItemsParams } from "./types/actions";
import { fetchSearchItems } from "./actions";
import {
  SEARCH_FETCH_ITEM_MODE,
  IArticleSearchContainerProps,
  SEARCH_FILTER_MODE,
  IArticleSearchSearchParams,
} from "./types";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
    routing: state.routing,
    currentUserState: state.currentUser,
  };
}

class ArticleSearch extends React.Component<IArticleSearchContainerProps, {}> {
  private cancelTokenSource: CancelTokenSource = this.getAxiosCancelToken();

  private getAxiosCancelToken() {
    const axiosCancelTokenManager = new AxiosCancelTokenManager();
    return axiosCancelTokenManager.getCancelTokenSource();
  }

  private fetchSearchItems = async (params: FetchSearchItemsParams | null) => {
    const { dispatch, articleSearchState } = this.props;

    if (!!params && !articleSearchState.isLoading) {
      dispatch(fetchSearchItems(params, this.cancelTokenSource));
    }
  };

  private getCurrentSearchParamsString = () => {
    const { routing } = this.props;
    return routing.location.search;
  };

  private getParsedSearchParamsObject = (searchString: string): IArticleSearchSearchParams => {
    return parse(searchString, { ignoreQueryPrefix: true });
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  private getPathAddedFilter = (mode: SEARCH_FILTER_MODE, value: number): string => {
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    let yearFrom, yearTo, journalIFFrom, journalIFTo;

    switch (mode) {
      case SEARCH_FILTER_MODE.PUBLICATION_YEAR:
        if (!!value) {
          yearFrom = new Date().getFullYear() - value;
        }
        break;
      case SEARCH_FILTER_MODE.JOURNAL_IF:
        if (!!value) {
          journalIFFrom = value;
        }
        break;
      default:
        break;
    }

    if (!!searchParams.query) {
      const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);

      return `/search?query=${papersQueryFormatter.formatPapersQuery({
        text: searchQueryObj.text,
        yearFrom,
        yearTo,
        journalIFFrom,
        journalIFTo,
      })}&page=1`;
    }
  };

  private mapPaperNode = (papers: IPapersRecord, searchItemsInfo: ISearchItemsInfo, searchQueryText: string) => {
    const { currentUserState } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id}`}
          paper={paper}
          commentInput={searchItemsInfo.getIn([index, "commentInput"])}
          changeCommentInput={(comment: string) => {
            this.changeCommentInput(index, comment);
          }}
          isAbstractOpen={searchItemsInfo.getIn([index, "isAbstractOpen"])}
          toggleAbstract={() => {
            this.toggleAbstract(index);
          }}
          isCommentsOpen={searchItemsInfo.getIn([index, "isCommentsOpen"])}
          toggleComments={() => {
            this.toggleComments(index);
          }}
          isAuthorsOpen={searchItemsInfo.getIn([index, "isAuthorsOpen"])}
          toggleAuthors={() => {
            this.toggleAuthors(index);
          }}
          isTitleVisited={searchItemsInfo.getIn([index, "isTitleVisited"])}
          visitTitle={() => {
            this.visitTitle(index);
          }}
          handleCommentPost={() => {
            this.handleCommentPost(index, paper.id);
          }}
          isLoading={searchItemsInfo.getIn([index, "isLoading"])}
          searchQueryText={searchQueryText}
          isFirstOpen={searchItemsInfo.getIn([index, "isFirstOpen"])}
          closeFirstOpen={() => {
            this.closeFirstOpen(index);
          }}
          currentUser={currentUserState}
          deleteComment={(commentId: number) => {
            this.deleteComment(paper.id, commentId);
          }}
          getMoreComments={() => {
            this.getMoreComments(paper.id, searchItemsInfo.getIn([index, "page"]) + 1);
          }}
          isPageLoading={searchItemsInfo.getIn([index, "isPageLoading"])}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };

  private changeCommentInput = (index: number, comment: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeCommentInput(index, comment));
  };

  private toggleAbstract = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleAbstract(index));
  };

  private toggleComments = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleComments(index));
  };

  private toggleAuthors = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleAuthors(index));
  };

  private visitTitle = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.visitTitle(index));
  };

  private handleCommentPost = (index: number, paperId: number) => {
    const { dispatch, articleSearchState, currentUserState } = this.props;
    const comment = articleSearchState.searchItemsInfo.getIn([index, "commentInput"]);

    checkAuthDialog();
    if (currentUserState.isLoggedIn) {
      if (!currentUserState.oauthLoggedIn && !currentUserState.emailVerified) {
        dispatch(openVerificationNeeded());
      } else if (comment.length > 0) {
        dispatch(Actions.handleCommentPost({ paperId, comment }));
      }
    }
  };

  private closeFirstOpen = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.closeFirstOpen(index));
  };

  private deleteComment = (paperId: number, commentId: number) => {
    const { dispatch } = this.props;

    dispatch(
      Actions.deleteComment({
        paperId,
        commentId,
      }),
    );
  };

  private getInflowRoute = () => {
    const { articleSearchState } = this.props;
    const { targetPaper, totalElements } = articleSearchState;

    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    if (!targetPaper || (!searchReferences && !searchCited)) {
      return;
    }

    let inflowQueryResult;

    if (!!searchReferences) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {numberWithCommas(totalElements)} References papers
        </div>
      );
    } else if (!!searchCited) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          {numberWithCommas(totalElements)} Cited Papers
        </div>
      );
    } else {
      return null;
    }

    return (
      <div className={styles.inflowRouteContainer}>
        {inflowQueryResult}
        <div className={styles.inflowArticleInfo}>of {targetPaper.title}</div>
        <div className={styles.separatorLine} />
      </div>
    );
  };

  // private handleChangeSorting = (sorting: SEARCH_SORTING) => {
  //   const { dispatch } = this.props;

  //   dispatch(Actions.changeSorting(sorting));
  // };

  private getMoreComments = (paperId: number, page: number) => {
    const { dispatch } = this.props;

    dispatch(
      Actions.getMoreComments({
        paperId,
        page,
        cancelTokenSource: this.cancelTokenSource,
      }),
    );
  };

  // private getSortingContent = (sorting: SEARCH_SORTING) => {
  //   switch (sorting) {
  //     case SEARCH_SORTING.RELEVANCE:
  //       return "Relevance";
  //     case SEARCH_SORTING.LATEST:
  //       return "Latest";
  //     default:
  //       break;
  //   }
  // };

  private restoreBrowserScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  private makeSearchQueryFromParamsObject = (searchParams: IArticleSearchSearchParams) => {
    const searchPage = parseInt(searchParams.page, 10) - 1 || 0;

    const searchQuery = searchParams.query;
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    const hasSearchQueryOnly = searchQuery && !searchReferences && !searchCited;
    const hasSearchQueryWithRef = searchQuery && searchReferences;
    const hasSearchQueryWithCite = searchQuery && searchCited;

    if (hasSearchQueryOnly) {
      return {
        query: searchQuery,
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.QUERY,
      };
    } else if (hasSearchQueryWithRef) {
      return {
        paperId: parseInt(searchReferences, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.REFERENCES,
      };
    } else if (hasSearchQueryWithCite) {
      return {
        paperId: parseInt(searchCited, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.CITED,
      };
    } else {
      return null;
    }
  };

  private setOrClearSearchInput = (searchParams: IArticleSearchSearchParams) => {
    if (searchParams.query) {
      const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);
      this.changeSearchInput(searchQueryObj.text || "");
    } else {
      this.changeSearchInput("");
    }
  };

  public componentWillUpdate(nextProps: IArticleSearchContainerProps) {
    const beforeSearch = this.props.routing.location.search;
    const afterSearch = nextProps.routing.location.search;

    if (beforeSearch !== afterSearch) {
      const searchParams: IArticleSearchSearchParams = this.getParsedSearchParamsObject(afterSearch);
      const searchQueryObject = this.makeSearchQueryFromParamsObject(searchParams);

      this.restoreBrowserScrollToTop();
      this.fetchSearchItems(searchQueryObject);
      this.setOrClearSearchInput(searchParams);
    }
  }

  public componentDidMount() {
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchQueryObject = this.makeSearchQueryFromParamsObject(searchParams);

    this.restoreBrowserScrollToTop();
    this.setOrClearSearchInput(searchParams);
    this.fetchSearchItems(searchQueryObject);
  }

  public render() {
    const { articleSearchState } = this.props;
    const {
      searchInput,
      isLoading,
      totalElements,
      totalPages,
      searchItemsToShow,
      searchItemsInfo,
    } = articleSearchState;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchPage = parseInt(searchParams.page, 10) - 1;
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;
    const searchQuery = searchParams.query;
    let searchQueryObj;

    if (!!searchQuery) {
      searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);
    }

    const hasSearchQueryOnly = searchQuery && !searchReferences && !searchCited;
    const hasSearchQueryWithRef = searchQuery && searchReferences;
    const hasSearchQueryWithCite = searchQuery && searchCited;
    const hasSearchQueryWithAnyCase = hasSearchQueryOnly || hasSearchQueryWithRef || hasSearchQueryWithCite;
    const hasNoSearchResult = articleSearchState.searchItemsToShow.isEmpty();

    if (isLoading) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
            <div className={styles.loadingContent}>Loading paper information</div>
          </div>
        </div>
      );
    } else if (!hasSearchQueryWithAnyCase) {
      return (
        <div className={styles.articleSearchFormContainer}>
          <div className={styles.searchFormBackground} />
          <div className={styles.searchFormInnerContainer}>
            <div className={styles.searchFormContainer}>
              <div className={styles.searchTitle}>Search Adaptive Paper at a Glance </div>
              <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  this.handleSearchPush();
                }}
              >
                <InputBox
                  onChangeFunc={this.changeSearchInput}
                  defaultValue={searchInput}
                  placeHolder="Search papers"
                  type="search"
                  className={styles.inputBox}
                  onClickFunc={this.handleSearchPush}
                />
              </form>
              <div className={styles.searchSubTitle}>
                {`Papers is a free, nonprofit, academic discovery service of `}
                <a
                  href="https://pluto.network"
                  target="_blank"
                  onClick={() => {
                    trackAndOpenLink("articleSearchSubTitle");
                  }}
                  className={styles.plutoNetwork}
                >
                  Pluto Network.
                </a>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoBox}>
                  <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
                  <div className={styles.infoContent}>
                    <div className={styles.title}>Intuitive Feed</div>
                    <div className={styles.content}>
                      Quickly skim through the search results with major indices on the authors and the article.
                    </div>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
                  <div className={styles.infoContent}>
                    <div className={styles.title}>Powered by community</div>
                    <div className={styles.content}>
                      Comments on the paper make it easy to find meaningful papers that can be applied to my research
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (hasNoSearchResult) {
      let noResultContent;

      if (!!searchQueryObj && !searchReferences && !searchCited) {
        noResultContent = `[${searchQueryObj.text}]`;
      } else if (!!searchReferences) {
        if (!!articleSearchState.targetPaper) {
          noResultContent = `References of article [${articleSearchState.targetPaper.title}]`;
        } else {
          noResultContent = `References of article [${searchReferences}]`;
        }
      } else if (!!searchCited) {
        if (!!articleSearchState.targetPaper) {
          noResultContent = `Cited of article [${articleSearchState.targetPaper.title}]`;
        } else {
          noResultContent = `Cited of article [${searchCited}]`;
        }
      }

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.noPapersContainer}>
            <div className={styles.noPapersTitle}>No Papers Found :(</div>
            <div className={styles.noPapersContent}>
              Sorry, there are no results for <span className={styles.keyword}>{noResultContent}.</span>
            </div>
          </div>
        </div>
      );
    } else {
      // hasSearchQueryWithAnyCase && hasSearchResult
      const currentPageIndex: number = searchPage || 0;
      let publicationYearFilterValue;
      if (!!searchQueryObj.yearFrom) {
        publicationYearFilterValue = new Date().getFullYear() - searchQueryObj.yearFrom;
      }

      return (
        <div className={styles.articleSearchContainer}>
          <FilterContainer
            getPathAddedFilter={this.getPathAddedFilter}
            publicationYearFilterValue={publicationYearFilterValue}
            journalIFFilterValue={searchQueryObj.journalIFFrom}
          />
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{numberWithCommas(totalElements)} results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPageIndex + 1} of {numberWithCommas(totalPages)} pages
              </span>
              {/* <div className={styles.sortingBox}>
                <span className={styles.sortingContent}>Sort : </span>
                <select
                  className={styles.sortingSelect}
                  onChange={e => {
                    this.handleChangeSorting(
                      parseInt(e.currentTarget.value, 10)
                    );
                  }}
                >
                  <option value={SEARCH_SORTING.RELEVANCE}>
                    {this.getSortingContent(SEARCH_SORTING.RELEVANCE)}
                  </option>
                  <option value={SEARCH_SORTING.LATEST}>
                    {this.getSortingContent(SEARCH_SORTING.LATEST)}
                  </option>
                </select>
              </div>
              <Icon className={styles.sortingIconWrapper} icon="OPEN_SORTING" /> */}
            </div>

            {this.mapPaperNode(searchItemsToShow, searchItemsInfo, searchQueryObj.text)}
            <Pagination totalPageCount={totalPages} currentPageIndex={currentPageIndex} searchQuery={searchQuery} />
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
