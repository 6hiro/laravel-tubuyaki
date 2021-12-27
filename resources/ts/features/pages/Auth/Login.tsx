import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  setUser,
} from "./authSlice";

import axios from "axios";
import Swal from 'sweetalert2'

const Login: React.FC = () => {
    let navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const isLoadingAuth = useSelector(selectIsLoadingAuth);

    const LoginSubmit = (email: string, password: string) => {
      const data= {
        email: email,
        password: password,
      }
      axios.get('/sanctum/csrf-cookie').then(response => {
        axios.post(`/login`, data).then(res => {
           if(res.data.status === 200)
           {
            dispatch(setUser({id:res.data.user.id, name:res.data.user.name}))
              Swal.fire({
                icon: 'success',
                title: "ログインに成功しました",
                showConfirmButton: false,
                timer: 1500
              })
              navigate("/")
           }
           else{
            Swal.fire({
              icon: 'error',
              title: "ログインに失敗しました",
              showConfirmButton: false,
              timer: 1500
            })
           }
         })
  
      })
    }

    return (
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={ (values) => {
            dispatch(fetchCredStart());
            LoginSubmit(values.email, values.password);
            dispatch(fetchCredEnd());
          }}
          validationSchema={
            Yup.object().shape({
            email: Yup.string()
              .email("有効なメールアドレスではありません。")
              .required("メールアドレスは必須です。"),
            password: Yup.string()
              .required("パスワードは必須です。")
              .min(8, "8文字以上で入力してください。"),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit} className="auth_form">
                <div>
                  <h1 className="auth_title">ログイン</h1>
                  <div className="auth_progress">
                    {isLoadingAuth && <CircularProgress />}
                  </div>
                  <br />

                  <TextField
                    label="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    fullWidth
                  />

                  {touched.email && errors.email ? (
                    <div className="auth_error">{errors.email}</div>
                  ) : null}
                  <br />
                  <br />

                  <TextField
                    label="パスワード"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    fullWidth
                  />
                  {touched.password && errors.password ? (
                    <div className="auth_error">{errors.password}</div>
                  ) : null}
                  <br />
                  <br />

                  <div className="auth_button">
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      ログイン
                    </Button>
                  </div>
                  <br />
                  <p className="auth_text">
                    アカウントをお持ちでない方は
                    <span
                      className="auth_span"
                      onClick={() => {
                        navigate("/auth/register")
                      }}
                    >こちら
                    </span>からご登録ください。
                  </p>
                </div>
              </form>
            </div>
          )}
        </Formik>
    )
}

export default Login
