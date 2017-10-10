import * as React from "react";
const styles = require("./inputBox.scss");

interface IInputBoxParams {
  onChangeFunc: (value: string) => void;
  validateFunc?: (value: string) => void;
  type: string;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
}

export type INPUT_BOX_TYPE = "normal" | "textarea";

export const InputBox = (params: IInputBoxParams) => {
  const className: string = `${params.type}InputWrapper`;
  switch (params.type) {
    case "normal":
      return (
        <div className={params.hasError ? `${styles.hasError} ${styles[className]}` : styles[className]}>
          <input
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
              if (params.validateFunc !== undefined) {
                params.validateFunc(e.currentTarget.value);
              }
            }}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox} ${styles.hasError}`}
            value={params.defaultValue}
            type="text"
          />
        </div>
      );

    case "textarea":
      return (
        <div className={params.hasError ? `${styles.hasError} ${styles[className]}` : styles[className]}>
          <textarea
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
              if (params.validateFunc !== undefined) {
                params.validateFunc(e.currentTarget.value);
              }
            }}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox} ${styles.hasError}`}
            value={params.defaultValue}
          />
        </div>
      );
  }
};