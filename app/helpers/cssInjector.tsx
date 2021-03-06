import * as React from "react";
import * as PropTypes from "prop-types";
import EnvChecker from "./envChecker";

export const css = new Set(); // CSS for all rendered React components
class CssInjector extends React.PureComponent<CssInjector, any> {
  public static childContextTypes = {
    insertCss: PropTypes.func,
  };

  public getChildContext() {
    return {
      insertCss(...styles: any[]) {
        if (styles.length === 1 && Object.getOwnPropertyNames(styles[0]).length === 0) {
          return [{}];
        }
        styles.forEach(style => {
          if (EnvChecker.isOnServer()) {
            css.add(style._getCss());
          } else {
            style._insertCss();
          }
        });
      },
    };
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}

export default CssInjector as React.ComponentClass<any>;
