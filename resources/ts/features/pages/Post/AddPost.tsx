import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from 'sweetalert2'
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
} from "./postSlice";

const AddPost: React.FC= () => {
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    // Post追加の処理
    const postSubmit = (content: string, isPublic: string) => {
        const data= {
          content: content,
          is_public: isPublic==='public' ? true : false,
        }
        // axios.get(`/sanctum/csrf-cookie`).then(response => {
           axios.post(`/api/post`, data).then(res => {
             if(res.status === 201)
             {
                Swal.fire({
                    icon: 'success',
                    title: "投稿しました",
                    showConfirmButton: false,
                    timer: 1800
                })
                // console.log(res.data.message)
                navigate("/post/list")
             }
             else{
                Swal.fire({
                    icon: 'error',
                    title: "投稿に失敗しました",
                    showConfirmButton: false,
                    timer: 1800
              })
            //   console.log(res.data.message)
             }
           })
        // })
    }

    return (
        <div>
            <Formik
                initialErrors={{ content: "required" }}

                initialValues={{
                    content: "",
                    isPublic: "private",
                }}
                onSubmit={async (values) => {
                    dispatch(fetchPostStart());
                    await postSubmit(values.content, values.isPublic)
                    dispatch(fetchPostEnd());
                }}
                validationSchema={
                    Yup.object().shape({
                    content: Yup.string()
                        .required("この項目は必須です。")
                        .max(250, "250文字以内で入力してください。"),
                    isPublic: Yup.string()
                        .required("この項目は必須です。"),
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
                <h1 className="add_post_title">投稿</h1>
                <div className="add_post_progress">
                        {isLoadingPost && <CircularProgress />}
                </div>
                <form className="add_post_form" onSubmit={handleSubmit}>
                    <div>
                    <TextField
                        id="outlined-textarea"
                        label="文章"
                        style={{ marginTop: 10 }}
                        fullWidth
                        multiline
                        variant="outlined"
                        type="input"
                        name="content"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                    />
                    {touched.content && errors.content ? (
                        <div className="add_post_error">{errors.content}</div>
                    ) : null}
                    <br />
                    <div className="add_post_button">
                        <FormControl>
                            <Select
                                sx={{ height: 40, marginTop: 5, marginBottom: 5 }}
                                native
                                // style={{ margin: 10 }}
                                value={values.isPublic}
                                onChange={handleChange}
                                inputProps={{
                                name: 'isPublic',
                                id: 'age-native-simple',
                                }}
                            >
                                <option value={"public"}>公開</option>
                                <option value={"private"}>非公開</option>
                            </Select>
                        </FormControl>

                        {touched.isPublic && errors.isPublic ? (
                        <div className="add_post_error">{errors.isPublic}</div>
                        ) : null}

                        <br />
                        <div className="add_post_notes">
                        <p>※入力できる文字数は250字です。</p>
                        <p>※ハッシュタグは半角を使ってください。</p>
                        </div>
                        <br />
                        
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={!isValid}
                            type="submit"
                        >
                            投稿する
                        </Button >                    
                    </div>
                    </div>
                </form>
                </div>
            )}
            </Formik>  
        </div>
    )
}

export default AddPost