import React from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { AppDispatch } from "../../../app/store";

import {
  selectMyUser,
  selectOpenUpdateProfile,
  editUserName,
  resetOpenProfile,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateAccountName,
} from "../../pages/Auth/authSlice";
import {
  fetchUpdateProf,
} from "../../pages//Post/postSlice"

const customStyles = {
  overlay: {
    backgroundColor: "rgba(230, 230, 230, 0.6)", 
    // backdropFilter: "blur(5px)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 200,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenUpdateProfile);
  const account = useSelector(selectMyUser);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  // 投稿のUpdateの処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet =  { 
      name: account.name, 
      id: account.id, 
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateAccountName(packet));
    if(fetchAsyncUpdateAccountName.fulfilled.match(result)){
        dispatch(fetchCredEnd());
        dispatch(fetchUpdateProf({postedBy: account.id, name: account.name}));
        dispatch(resetOpenProfile());
    }

  }

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
            dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <div className="edit_prof">
          <div className="edit_prof_title">プロフィール編集</div>
        
          <div className="edit_progress">
            {isLoadingAuth && <CircularProgress />}
          </div>

          <form className="edit_prof_form">
            <TextField
              id="standard-basic" label="ユーザーネーム（８文字以内）"
              type="text"
              fullWidth
              inputProps={{maxLength: 8}}
              value={account?.name}
              onChange={(e) => dispatch(editUserName(e.target.value))}
            />
            <div className="edit_prof_button">
              <Button
                disabled={!account?.name}
                // variant="contained"
                variant="outlined"
                color="primary"
                type="submit"
                onClick={updateProfile}
              >
                ユーザーネームを変更
              </Button>
            </div>
          </form>        
        </div>
      </Modal>
    </>
  );
};

export default EditProfile;