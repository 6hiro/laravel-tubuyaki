import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// material UI
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';

import { AppDispatch } from '../../../app/store';
import {
    fetchAsyncGetProfrile,
    fetchAsyncGetFollowings,
    fetchAsyncGetFollowers,
    fetchAsyncFollowUnFollow,
    selectMyUser,
    selectProfile,
    selectProfiles,
    setOpenProfile,
    setOpenProfiles,
    setProfilesTitleFollowings,
    setProfilesTitleFollowers,
} from "../Auth/authSlice";
import { 
    fetchAsyncGetUserPosts,
    fetchAsyncGetLikedPosts,
    selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import EditProfile from "../../components/profile/EditProfile";
import GetMorePost from '../../components/post/GetMorePost';


const Profile: React.FC = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectMyUser);
    const profile = useSelector(selectProfile);
    const profiles = useSelector(selectProfiles);
    const posts = useSelector(selectPosts);

    const handlerFollowed = async () => {
        const result = await dispatch(fetchAsyncFollowUnFollow(profile.id));  
    };

    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetProfrile(id));
            await dispatch(fetchAsyncGetUserPosts(id));
            handleIsUserPosts();
          };
          func();
    }, [dispatch, id])

    // 表示されている投稿一覧が、ユーザーの投稿かユーザーがいいねをした投稿一覧かの状態を管理
    const [isUserPosts, setIsUserPosts] = useState<boolean>(true);
    const handleIsUserPosts = () => {
        setIsUserPosts(true);
    }
    const handleIsFavoritePosts = () => {
        setIsUserPosts(false);
    }

    const getFavoritePosts = async () => {
        const result = await dispatch(fetchAsyncGetLikedPosts(id));
        handleIsFavoritePosts();
      };
      const getUserPosts = async () => {
        const result = await dispatch(fetchAsyncGetUserPosts(id))
        handleIsUserPosts();
    };

    return (
        <div className="profile">
          {/* アバター・ニックネーム */}
          <div className="profile_header">
            {/* <Avatar src={profile.img} /> */}
            <div>
                <Avatar>{profile.name.slice(0, 1)}</Avatar>
            </div>
            <div className="nick_name">{profile.name}</div>
          </div>
          
          <>
            {profile.id!==user.id ? (
              <div className="follow_button">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      icon={<PersonOutlineIcon />}
                      checkedIcon={<PersonIcon />}
                      checked={profile.isFollowed}
                      // checked={ profile.followers.some((follow) => follow === user.id)}
                      onChange={handlerFollowed}
                      name="checked" 
                    />
                  }
                  label = {profile.isFollowed ? "フォローを外す" : "フォローする"}
                />       
              </div>
            ):(
              <>
                <div
                  className="edit_profile"
                  onClick={() => {
                    dispatch(setOpenProfile());
                  }}
                >
                  プロフィールを編集
                </div>
              </>
            )}
          </>
          
          {/* フォロー数・フォロワー数 */}
          <div className="follow">
            <span 
              className="following"
              onClick={async() => {
                  if(profile.following>0){
                    await dispatch(fetchAsyncGetFollowings(profile.id));
                    dispatch(setOpenProfiles());
                    dispatch(setProfilesTitleFollowings());
                  }
              }}
            >
              {Number(profile.following).toLocaleString()} フォロー
            </span>

            <span 
              className="follower"
              onClick={async() => {
                if(profile.followers>0){
                  await dispatch(fetchAsyncGetFollowers(profile.id));
                  dispatch(setOpenProfiles());
                  dispatch(setProfilesTitleFollowers());
                }
              }}
            >
               {Number(profile.followers).toLocaleString()} フォロワー
            </span>
          </div>
          <hr/>

          {/* ナビゲーション */}
          <div className="navigation">
            <div
              className={isUserPosts ? `user_posts is_user_post`: `user_posts`}
              onClick={getUserPosts}
            >
              投稿
            </div>
            <div
              className={!isUserPosts ? `favorite_posts is_user_post`: `favorite_posts`}
              onClick={getFavoritePosts}
            >
              お気に入り
            </div>
          </div>

          {/* 投稿一覧 */}
          <div className="posts">
            {
                posts
                .map((post, index) => ( 
                    <div key={index} >
                    <Post post={post} />
                    </div>
                ))
            }
            <GetMorePost />
          </div>

          <EditProfile />
        </div>
    )
}

export default Profile