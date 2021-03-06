import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../../model/currentUser";
import { Collection } from "../../../../model/collection";
import { UpdateCollectionParams } from "../../../../api/collection";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
const styles = require("./editCollection.scss");

interface CollectionEditDialogProps {
  currentUser: CurrentUser;
  collection: Collection;
  handleDeleteCollection: (collectionId: number) => Promise<void>;
  handleCloseDialogRequest: () => void;
  handleUpdateCollection: (params: UpdateCollectionParams) => Promise<void>;
}

interface CollectionEditDialogStates {
  title: string;
  description: string;
}

@withStyles<typeof CollectionEditDialog>(styles)
class CollectionEditDialog extends React.PureComponent<CollectionEditDialogProps, CollectionEditDialogStates> {
  public constructor(props: CollectionEditDialogProps) {
    super(props);

    this.state = {
      title: props.collection.title,
      description: props.collection.description || "",
    };
  }

  public render() {
    const { handleCloseDialogRequest } = this.props;
    const { title, description } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.header}>Edit collection</div>
        <div className={styles.contentWrapper}>
          <div className={styles.editForm}>
            <div className={styles.formControl}>
              <label>{`Name (${title.length}) / 100`}</label>
              <input
                value={title}
                onChange={this.handleTitleChange}
                placeholder="Original Collection Name"
                type="text"
              />
            </div>
            <div className={styles.formControl}>
              <label>{`Description(optional) ${description.length} / 500`}</label>
              <textarea
                value={description}
                onChange={this.handleDescriptionChange}
                placeholder="Original Collection Description"
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={this.handleClickDeleteBtn} className={styles.deleteButton}>
            Delete Collection
          </button>

          <div className={styles.rightBox}>
            <button onClick={handleCloseDialogRequest} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={this.handleClickSaveBtn} className={styles.saveBtn}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  private handleClickSaveBtn = async () => {
    const { handleUpdateCollection, collection, handleCloseDialogRequest } = this.props;
    const { title, description } = this.state;

    try {
      await handleUpdateCollection({ collectionId: collection.id, title, description });
      handleCloseDialogRequest();
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };

  private handleClickDeleteBtn = async () => {
    const { handleDeleteCollection, collection, handleCloseDialogRequest } = this.props;

    const c = confirm("Do you really want to DELETE your collection?");

    if (c) {
      await handleDeleteCollection(collection.id);
      handleCloseDialogRequest();
    }
  };

  private handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;

    this.setState({
      title: text,
    });
  };

  private handleDescriptionChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;

    this.setState({
      description: text,
    });
  };
}
export default CollectionEditDialog;
