import React,  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import {
  fetchAsyncGetSearchedPosts,
  selectPosts, 
} from '../Post/postSlice';

import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';



const PostSearch: React.FC = () => {
  const { word } = useParams();
  const posts = useSelector(selectPosts);

  const dispatch: AppDispatch = useDispatch();
  
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetSearchedPosts(word));
    }
    func();
  }, [dispatch, word])

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

export default PostSearch;