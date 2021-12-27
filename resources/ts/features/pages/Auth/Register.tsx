import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
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
} from "./authSlice";


// const authUrl = process.env.REACT_APP_DEV_API_URL;

const Register: React.FC = () => {
  let navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  const registerSubmit = (name: string, email: string, password: string) => {
    const data= {
      name: name,
      email: email,
      password: password,
    }
    axios.get(`/sanctum/csrf-cookie`).then(response => {
       axios.post(`/api/register`, data).then(res => {
         if(res.data.status === 200)
         {
            Swal.fire({
              icon: 'success',
              title: "登録に成功しました",
              showConfirmButton: false,
              timer: 1500
            })
            console.log(res.data.message)
            navigate("/auth/login")
         }
         else{
          Swal.fire({
            icon: 'error',
            title: "登録に失敗しました",
            showConfirmButton: false,
            timer: 1500
          })
          console.log(res.data.message)
         }
       })

    })
  }
  
  return (
    <Formik
      initialErrors={{ email: "required" }}
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        dispatch(fetchCredStart());
        registerSubmit(values.name, values.email, values.password)
        dispatch(fetchCredEnd());
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("ユーザー名は必須です。")
          .max(191, "191文字以内で入力してください。"),
          // .min(8, "8文字以上で入力してください。"),
        email: Yup.string()
          .email("有効なメールアドレスではありません。")
          .max(191, "191文字以内で入力してください。")
          .required("メールアドレスは必須です。"),
        password: Yup.string()
          .required("パスワードは必須です。")
          .min(8, "8文字以上で入力してください。"),
        confirmPassword: Yup.string()
          .required("パスワード確認は必須です。")
          .oneOf([Yup.ref('password')] , "パスワードと同じ内容を入力してください。"),
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
              <h1 className="auth_title">アカウント作成</h1>
              <div className="auth_progress">
                {isLoadingAuth && <CircularProgress />}
              </div>
              <br />

              <TextField
                label="ユーザー名"
                type="input"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                fullWidth
              />
              {touched.name && errors.name ? (
                <div className="auth_error">{errors.name}</div>
              ) : null}
              <br />
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
                id="standard-basic" label="パスワード"
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
              <TextField
                label="パスワード確認"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                fullWidth
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <div className="auth_error">{errors.confirmPassword}</div>
              ) : null}
              <br />

              <div className="auth_button">
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!isValid}
                  type="submit"
                  className="auth_button"
                >
                  登録
                </Button>
              </div>
              <br />
              <p className="auth_text">
                ログインは
                  <span
                  className="auth_span"
                  onClick={() => {
                    navigate("/auth/login")

                  }}
                >こちら
              </span>でしてください。</p>
            </div>
          </form>
        </div>
      )}
    </Formik>
  )
}

export default Register
