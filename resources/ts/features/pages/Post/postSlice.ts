import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../../app/store";
import { PROPS_COMMENT } from "../../types";

export const fetchAsyncGetPosts = createAsyncThunk(
  "posts/get", 
  async () => {
    const res = await axios.get('/api/post');
    return res.data;
  }
);
export const fetchAsyncGetMorePosts = createAsyncThunk(
  "morePosts/get", 
  async (link: string) => {
    const res = await axios.get(link);
    return res.data;
  }
);
export const fetchAsyncGetPost = createAsyncThunk(
  "postDetail/get", 
  async (id: string | undefined) => {
    const res = await axios.get(`/api/post/${id}`)
    return res.data;
  }
);
export const fetchAsyncGetUserPosts = createAsyncThunk(
  "userPosts/get", 
  async (userId: string | undefined) => {
    const res = await axios.get(`/api/post/user/${userId}`);
    return res.data;
  }
);
export const fetchAsyncGetSearchedPosts = createAsyncThunk(
  "searchedPosts/get", 
  async (word: string | undefined) => {
    const res = await axios.get(`/api/post/search/${word}`)
    return res.data;
  }
);
export const fetchAsyncGetHashtagPosts = createAsyncThunk(
  "hashtagPosts/get", 
  async (hashtagId: string | undefined) => {
    const res = await axios.get(`/api/post/hashtag/${hashtagId}`)
    return res.data;
  }
);
export const fetchAsyncGetFollowingsPosts = createAsyncThunk(
  "followingsPosts/get",
  async (userId: number) => {
    const res = await axios.get(`/api/followings/post`);
    return res.data;
  }
);
export const fetchAsyncGetLikedPosts = createAsyncThunk(
  "LikedPosts/get",
  async (userId: string | undefined) => {
    const res = await axios.get(`/api/post/user/${userId}/like`);
    return res.data;
  }
);
export const fetchAsyncUpdatePost = createAsyncThunk(
  "patch/post",
  async (post: {id: string | undefined, is_public: boolean}) => {
    const res = await axios.patch(`/api/post/${post.id}`, {is_public: post.is_public});
    return res.data;
  }
)
export const fetchAsyncLikeUnlikePost = createAsyncThunk(
  "like/post",
  async (postId: number) => {
    // await axios.get(`/sanctum/csrf-cookie`);
    const res = await axios.put(`/api/post/${postId}/like/`,{}, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);
export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(`/api/post/comment`, comment);
    return res.data;
  }
);
export const fetchAsyncDeleteComment = createAsyncThunk(
  "commentDelete/delete", 
  async (id: number) => {
    const  res  = await axios.delete(`/api/post/comment/${id}`);
    return res.data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openPost: false,
    nextPageLink: "",
    posts: [
      {
        id: 0,
        content: "",
        user: {id: 0, name: ""},
        img: "",
        created_at: "",
        is_public: true,
        is_liked: false,
        count_likes: 0,
        count_comments: 0,
        tags: [{
            id: "",
            name: "",
        }]
      },
    ],
    post: 
    {
        id: 0,
        content: "",
        user: {id: 0, name: ""},
        img: "",
        created_at: "",
        is_public: true,
        is_liked: false,
        count_likes: 0,
        count_comments: 0,
        tags: [{
            id: "",
            name: "",
        }]
    },
    comments: [
      {
        id: 0,
        content: "",
        user: {id: 0, name: ""},
        img: "",
        created_at: "",
      },
    ],
  },
  reducers: {
    setOpenPost(state) {
      state.openPost = true;
    },
    resetOpenPost(state) {
      state.openPost = false;
    },
    resetNextPageLink(state) {
      state.nextPageLink = ""
    },
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    fetchCommentDelete(state, action){
      state.comments = state.comments.filter((comment)=> comment.id !== action.payload)
    },
    fetchUpdateProf(state, action){
      // Profを編集したときに投稿の投稿者名を変更する処理
      state.posts.map((post) =>
          post.user.name = 
            post.user.id === action.payload.postedBy 
              ? action.payload.name 
              : post.user.name,
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetMorePosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: [...state.posts, ...action.payload.data],
      };
    });
    builder.addCase(fetchAsyncGetPost.fulfilled, (state, action) => {
      return {
        ...state,
        post: action.payload.post,
        comments: action.payload.post.comments
      };
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetSearchedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetHashtagPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetFollowingsPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetLikedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.links.next,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncUpdatePost.fulfilled, (state, action) => {
      state.post.is_public = action.payload.post.is_public;
    });
    builder.addCase(fetchAsyncLikeUnlikePost.fulfilled, (state, action) => {
      if(action.payload.result==='like'){
        // postのstateの変更
        state.post.count_likes = action.payload.count_likes
        state.post.is_liked = true
        // postsのstateの変更
        const add_like = (post:any) => {
          // 投稿のいいね数といいねをしたかどうかを変更
          post["count_likes"] = action.payload.count_likes
          post["is_liked"] = true;
          return post;
        }
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? add_like(post) : post,
       );
      }
      else if(action.payload.result==='unlike'){
        state.post.count_likes = action.payload.count_likes
        state.post.is_liked = false
        // postsのstateの変更
        const delete_like = (post:any) => {
          // 投稿のいいね数といいねをしたかどうかを変更
          post["count_likes"] = action.payload.count_likes
          post["is_liked"] = false;
          return post;
        }
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? delete_like(post) : post,
       );
      }
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [action.payload.comment, ...state.comments],
      };
    });

  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  fetchCommentDelete,
  setOpenPost,
  resetOpenPost,
  fetchUpdateProf,
} = postSlice.actions;

export const selectIsLoadingPost = (state: RootState) =>  state.post.isLoadingPost;
export const selectOpenPost = (state: RootState) => state.post.openPost;
export const selectNextPageLink = (state: RootState) => state.post.nextPageLink;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPost = (state: RootState) => state.post.post;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;