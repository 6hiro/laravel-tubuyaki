import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import {
    selectMyUser,
} from '../../pages/Auth/authSlice' 
import { 
  fetchAsyncGetFollowingsPosts, 
  selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const user = useSelector(selectMyUser);
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetFollowingsPosts(user.id));
    }
    func();
  }, [dispatch])


  return (
    <div className="posts_list_container">
      <div className="posts">
        {
          posts
            .map((post, index) => ( 
              <div key={index} >
                <Post post={post} />
              </div>
            ))
        }
      </div>

      <GetMorePost />
    </div>       
  )
  
}

export default Home