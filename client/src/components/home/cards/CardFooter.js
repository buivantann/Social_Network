import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LikeButton from '../../common/LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import ShareModal from '../../common/ShareModal';
import { BASE_URL } from '../../../utils/config';

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const [isShare, setIsShare] = useState(false);

  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  // Likes
  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user._id]);

  const handleLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  // Saved
  useEffect(() => {
    if (auth.user.saved.find((id) => id === post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user.saved, post._id]);

  const handleSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  return (
    <div className="card_footer">
      <div
        className="d-flex justify-content-between "
        style={{ borderBottom: '0.5px solid rgb(216,216,216)' }}
      >
        <h6 style={{ padding: '5px 15px', cursor: 'pointer' }}>{post.likes.length} Thích</h6>

        {saved ? (
          <i
            className="fas fa-bookmark "
            style={{
              padding: '5px 15px',
              cursor: 'pointer',
              color: '#002F77',
              fontSize: '25px',
              marginLeft: '25px',
            }}
            onClick={handleUnSavePost}
          />
        ) : (
          <i
            className="far fa-bookmark"
            style={{
              padding: '5px 15px',
              cursor: 'pointer',
              color: '#002F77',
              fontSize: '25px',
              marginLeft: '25px',
            }}
            onClick={handleSavePost}
          />
        )}

        <h6 style={{ padding: '5px 15px', cursor: 'pointer' }}>{post.comments.length} Bình luận</h6>
      </div>
      <div className="card_icon_menu" style={{ borderBottom: '0.5px solid rgb(216,216,216) ' }}>
        <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />

        <div className="post_bottom_action_item">
          <Link to={`/post/${post._id}`} className="post_bottom_action_item-Text text-dark">
            Bình luận
          </Link>
        </div>
        <div className="post_bottom_action_item">
          <span className="post_bottom_action_item-Text" onClick={() => setIsShare(!isShare)}>
            Chia sẻ
          </span>
        </div>
      </div>

      {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}
    </div>
  );
};

export default CardFooter;