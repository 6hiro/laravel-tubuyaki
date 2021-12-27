import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";

export const fetchAsyncGetAccount = createAsyncThunk(
  "auth/account",
  async () => {
    const res = await axios.get('/api/user');
    return res.data;
  }
);
export const fetchAsyncUpdateAccountName = createAsyncThunk(
  "auth/patch",
  async (user: {name: string, id: number}) =>{
    const res = await axios.patch(`/api/user/${user.id}`, {name: user.name});
    return res.data;
  }
);
export const fetchAsyncDeleteAccount = createAsyncThunk(
  "commentDelete/delete", 
  async (id: number) => {
    const  res  = await axios.delete(`/api/user/${id}`);
    return res.data;
});
export const fetchAsyncGetProfrile = createAsyncThunk(
  "auth/profile",
  async (id: string | undefined) => {
    const res = await axios.get(`/api/user/${id}`);
    return res.data;
  }
);

export const fetchAsyncFollowUnFollow = createAsyncThunk(
  "like/post",
  async (userId: number) => {
    // await axios.get(`/sanctum/csrf-cookie`);
    const res = await axios.put(`/api/user/${userId}/follow`,{});
    return res.data;
  }
);
export const fetchAsyncGetFollowings = createAsyncThunk(
  "followings/get",
  async (userId: number) =>{
    const res =  await axios.get(`/api/user/${userId}/followings`);
    return res.data;
  }
);
export const fetchAsyncGetFollowers = createAsyncThunk(
  "followers/get",
  async (userId: number) =>{
    const res =  await axios.get(`/api/user/${userId}/followers`);
    return res.data;
  }
);
export const fetchAsyncGetLikesUser = createAsyncThunk(
  "followers/get",
  async (postId: number) =>{
    const res =  await axios.get(`/api/user/${postId}/likes`);
    return res.data;
  }
);
export const authSlice = createSlice({
  // action typesで使われる名前 
  name: "auth",
  // Stateの初期状態
  initialState: {
    openUpdateProfile: false,
    openProfiles: false,
    isLoadingAuth: false,
    profilesTitle: "",
    user: {
      id: 0,
      name: "",
    },
    profile: {
      id: 0,
      name: "",
      isFollowed: false,
      followers: 0,
      following:  0,
    },
    profiles: [
      {
        id: 0,
        name: "",
        isFollowed: false,
        followers: 0,
        following:  0,
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenProfile(state) {
      state.openUpdateProfile = true;
    },
    resetOpenProfile(state) {
      state.openUpdateProfile = false;
    },
    setOpenProfiles(state) {
      state.openProfiles = true;
    },
    resetOpenProfiles(state) {
      state.openProfiles = false;
    },
    setProfilesTitleFollowings(state){
      state.profilesTitle = "フォロー"
    },
    setProfilesTitleFollowers(state){
      state.profilesTitle = "フォロワー"
    },
    setProfilesTitleLikes(state){
      state.profilesTitle = "いいね"
    },
    setUser(state, action){
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
    },
    editUserName(state, action){
      state.user.name = action.payload;
    },
    logOut(state) {
      state.user.id = 0
      state.user.name = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetAccount.fulfilled, (state, action) => {
      state.user.id = action.payload.user.id;
      state.user.name = action.payload.user.name;
    });
    builder.addCase(fetchAsyncUpdateAccountName.fulfilled, (state, action) => {
      state.user.name= action.payload.userName;
      state.profile.name = action.payload.userName;
    })
    builder.addCase(fetchAsyncGetProfrile.fulfilled, (state, action) => {
      state.profile.id = action.payload.data.id;
      state.profile.name = action.payload.data.name;
      state.profile.isFollowed = action.payload.data.isFollowedBy;
      state.profile.following = action.payload.data.count_followings;
      state.profile.followers = action.payload.data.count_followers;
    });
    builder.addCase(fetchAsyncGetFollowings.fulfilled, (state, action) => {
      state.profiles = action.payload.data;
    });
    builder.addCase(fetchAsyncGetFollowers.fulfilled, (state, action) => {
      state.profiles = action.payload.data;
    });
    builder.addCase(fetchAsyncFollowUnFollow.fulfilled, (state, action) => {
      if(action.payload.result==='follow'){
        state.profile.followers = action.payload.count_followers;
        state.profile.isFollowed = true;
      }
      else if(action.payload.result==='unfollow'){
        state.profile.followers = action.payload.count_followers;
        state.profile.isFollowed = false;
      }
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenProfile,
  resetOpenProfile,
  setOpenProfiles,
  resetOpenProfiles,
  setProfilesTitleFollowers,
  setProfilesTitleFollowings,
  setProfilesTitleLikes,
  setUser,
  editUserName,
  logOut,
} = authSlice.actions;

export const selectMyUser = (state: RootState) => state.auth.user;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectProfilesTitle = (state: RootState) => state.auth.profilesTitle;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenUpdateProfile= (state: RootState) => state.auth.openUpdateProfile;
export const selectOpenProfiles= (state: RootState) => state.auth.openProfiles;

export default authSlice.reducer;