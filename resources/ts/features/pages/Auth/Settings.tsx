import React, { useState }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import { AppDispatch } from "../../../app/store";
import {
  selectMyUser,
  fetchAsyncDeleteAccount,
  logOut,
} from "../../pages/Auth/authSlice";

const Settings: React.FC = () => {
    let navigate = useNavigate();
    const account = useSelector(selectMyUser);
    const dispatch: AppDispatch = useDispatch();

    // Account削除の確認画面の表示の処理
    const [deleteAccountOpen, setDeleteAccountOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
        setDeleteAccountOpen(true);
    };
    const handleClose = () => {
        setDeleteAccountOpen(false);
    };

    // Account削除の処理
    const UserDelete = async() => {
        const result = await dispatch(fetchAsyncDeleteAccount(account.id))
        if(fetchAsyncDeleteAccount.fulfilled.match(result)){
            dispatch(logOut());
            navigate("/auth/login")
        }
        handleClose();
    }
    
    return (
        <div
            className="settings"
        >
            <div
                className="settings_title"
            >
                設定
            </div>
            <br />
            # アカウントの削除
            <div
                className="delete_account_button"
                onClick={handleClickOpen}
            >
                アカウントを削除する
            </div>


            {/* Account削除の確認画面 */}
            <Dialog
                open={deleteAccountOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    本当にアカウントを削除しますか？
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                    onClick={UserDelete} 
                    variant="outlined"
                    color="primary"
                >
                    はい
                </Button>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    color="primary" 
                    autoFocus
                >
                    いいえ
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Settings
