import * as React from "react";
import { Step, StepButton } from "material-ui/Stepper";
const Stepper = require("material-ui/Stepper").Stepper;
import { ARTICLE_REVIEW_STEP, IArticleShowStateRecord } from "../../records";

const styles = require("./review.scss");

export interface IReviewStepProps {
  articleShow: IArticleShowStateRecord;
}

const stepStyle: React.CSSProperties = {
  flex: 1,
};

const stepButtonStyle: React.CSSProperties = {
  width: "175px",
  padding: 0,
};

const activeStepButtonStyle: React.CSSProperties = {
  ...stepButtonStyle,
  ...{
    backgroundColor: "#f5f7fb",
  },
};

const ReviewStep = (props: IReviewStepProps) => {
  const { currentStep } = props.articleShow;

  return (
    <div className={styles.stepWrapper}>
      <Stepper linear={true} connector={null}>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_REVIEW_STEP.FIRST}
          active={currentStep === ARTICLE_REVIEW_STEP.FIRST}
        >
          <StepButton
            style={currentStep >= ARTICLE_REVIEW_STEP.FIRST ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
          >
            <div
              className={
                currentStep >= ARTICLE_REVIEW_STEP.FIRST
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepTitle}>Originality</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_REVIEW_STEP.SECOND}
          active={currentStep === ARTICLE_REVIEW_STEP.SECOND}
        >
          <StepButton
            style={currentStep >= ARTICLE_REVIEW_STEP.SECOND ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
          >
            <div
              className={
                currentStep >= ARTICLE_REVIEW_STEP.SECOND
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepTitle}>Significance</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_REVIEW_STEP.THIRD}
          active={currentStep === ARTICLE_REVIEW_STEP.THIRD}
        >
          <StepButton
            style={currentStep >= ARTICLE_REVIEW_STEP.THIRD ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
          >
            <div
              className={
                currentStep >= ARTICLE_REVIEW_STEP.THIRD
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepTitle}>Validity</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_REVIEW_STEP.FOURTH}
          active={currentStep === ARTICLE_REVIEW_STEP.FOURTH}
        >
          <StepButton
            style={currentStep >= ARTICLE_REVIEW_STEP.FOURTH ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
          >
            <div
              className={
                currentStep >= ARTICLE_REVIEW_STEP.FOURTH
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepTitle}>Organization</div>
            </div>
          </StepButton>
        </Step>
      </Stepper>
    </div>
  );
};

export default ReviewStep;