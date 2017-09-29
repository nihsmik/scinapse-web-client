jest.unmock("../feedItem");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import FeedItem, { IFeedItemProps } from "../feedItem";
import { RECORD } from "../../../../__mocks__/";

describe("<FeedItem /> component", () => {
  let feedItemWrapper: ShallowWrapper<IFeedItemProps>;

  beforeEach(() => {
    feedItemWrapper = shallow(<FeedItem article={RECORD.ARTICLE} />);
  });

  it("should match snapshot", () => {
    expect(feedItemWrapper.html()).toMatchSnapshot();
  });
});