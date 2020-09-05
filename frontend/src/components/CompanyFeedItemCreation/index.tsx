import React, { useState, useEffect, FC } from 'react';
import apiClient from "../../helpers/apiClient";
import { connect, ConnectedProps } from 'react-redux';
import { Image, Icon, Button, Header } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import {
  loadCompanyFeedItemRoutine,
  saveCompanyFeedItemRoutine,
  createCompanyFeedItemRoutine
} from '../../sagas/companyFeed/routines';
import { toastr } from 'react-redux-toastr';
import { ICompanyFeedItem } from '../../models/companyFeed/ICompanyFeedItem';
import { IAppState } from "../../models/IAppState";

import styles from './styles.module.sass';

const CompanyFeedItemCreation: FC<ConnectedFeedCreationProps & { match }> = ({
  match,
  feedItem,
  loadFeedItem,
  createFeedItem,
  saveFeedItem
}) => {
  const history = useHistory();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [item, setItem] = useState<ICompanyFeedItem>(undefined);
  const [image, setImage] = useState<string>(undefined);

  useEffect(() => {
    const id = match.params.id;
    if (id === 'new') {
      loadFeedItem();
      return;
    }
    loadFeedItem(id);
  }, [loadFeedItem, match.params.id]);

  const handleSubmit = () => {
    // here we send new item to backend
    if (item.id) {
      saveFeedItem(item);
    } else {
      console.log(item);
      const newItem = {
        title: item.title,
        body: item.body,
        type: item.type,
        imageId: item.imageId
      };
      console.log({ newItem });
      createFeedItem(newItem);
    }
    history.push('/company');
  };

  useEffect(() => {
    setItem(feedItem);
    setImage(feedItem?.imageId);
  }, [feedItem]);

  const uploadFile = file => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/api/image', formData).then(res => {
      console.log(res.data);
      setImage(res.data.link);
      return res.data.id;
    });
  };

  const handleUploadPhoto = async files => {
    const file = files[0];
    setIsUploading(true);
    try {
      if (!file.type.startsWith('image')) {
        return;
      }
      const imageId = await uploadFile(file);
      setIsUploading(false);
      console.log(imageId);
      setItem({ ...item, imageId: imageId });
    } catch (error) {
      toastr.error('Unable to upload images');
      setItem({ ...item, imageId: null });
    }
    setIsUploading(false);
  };

  return (
    <div className={styles.new_feed_wrapper}>
    <div className={styles.new_feed_item_page}>
      <Header as="h3">Create a new feed item</Header>
      <input placeholder="Title" type="text"
             value={item?.title || ''}
             className={styles.feed_item_input}
             onChange={e => setItem({ ...item, title: e.target.value })} />
      <textarea placeholder="What's up?"
                value={item?.body || ''}
                className={styles.feed_item_textarea}
                onChange={e => setItem({ ...item, body: e.target.value })} />
      {image && (
          <Image src={image} size='small' alt="image" bordered />
      )}
      <Button color="teal" icon labelPosition="left" as="label"
              loading={isUploading} disabled={isUploading} className={styles.button}>
        <Icon name="image" />
        Attach image
        <input name="image" type="file" multiple
               onChange={e => handleUploadPhoto(e.target.files)} hidden />
      </Button>
      <Button type="submit" onClick={handleSubmit} className={styles.submit_button}>
        Submit
      </Button>
    </div>
    </div>
  );
};

const mapStateToProps = (rootState: IAppState) => ({
    feedItem: rootState.companyFeed.current
});

const mapDispatchToProps = {
    loadFeedItem: loadCompanyFeedItemRoutine,
    saveFeedItem: saveCompanyFeedItemRoutine,
    createFeedItem: createCompanyFeedItemRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectedFeedCreationProps = ConnectedProps<typeof connector>;

export default connector(CompanyFeedItemCreation);
