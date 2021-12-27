import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';

import { AppDispatch } from '../../../app/store';
import { 
  fetchAsyncGetLikedPosts, 
  selectPosts, 
} from './postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';

const FavoritePost: React.FC = () => {
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
    
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetLikedPosts(id));
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

export default FavoritePost