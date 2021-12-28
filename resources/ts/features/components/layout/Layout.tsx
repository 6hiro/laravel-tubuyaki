import React, { useState, useEffect }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

import { AppDispatch } from '../../../app/store';
import {
    selectMyUser,
    logOut,
    fetchAsyncGetAccount,
} from "../../pages/Auth/authSlice";

const Layout: React.FC = () => {
    let navigate = useNavigate();
    const [isActive, setActive] = useState<boolean>(false);
    const user = useSelector(selectMyUser);
    const dispatch: AppDispatch = useDispatch();
    const [keyword, setKeyword] = useState("");

    const ToSearchPostPage = () =>{
        navigate(`/search/${keyword}/`)
    }

    const Logout = () => {
          axios.post(`/logout`).then(res => {
             if(res.status === 200)
             {
                //  userの情報をクリアする
                dispatch(logOut());
                Swal.fire({
                  // position: 'top-end',
                  icon: 'success',
                  title: "ログアウトに完了しました",
                  showConfirmButton: false,
                  timer: 1500
                });
                navigate("/auth/login");
             }
             else{
              Swal.fire({
                icon: 'error',
                title: "ログアウトに失敗しました",
                showConfirmButton: false,
                timer: 1500
              });
             }
           })
      }
    useEffect(()=>{
        // ログイン済みかどうか検証
        const func = async () => {
          const result = await dispatch(fetchAsyncGetAccount());
          if(fetchAsyncGetAccount.rejected.match(result)){
            navigate("/auth/login");
          }
        };
        func();
    }, [])
    return (
        <>
            {/* HEADER */}
            <header className="header">
                <div className="header__container">
                    {/* <img src="assets/img/perfil.jpg" alt="" className={styles.header__img} /> */}
                    <div className="header__img"></div>
                    {/* <Link to={"/"} className={styles.header__logo}>ComPass</Link> */}
                    <div className="header__logo"></div>
        
                    <form 
                        className="header__search" 
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                if(keyword.length>0){
                                    ToSearchPostPage();
                                }
                            }
                        }
                    >
                        <input 
                            type="text" 
                            placeholder="キーワード検索" 
                            className="header__input" 
                            value={keyword}
                            // minLength={1}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <i className="bx bx-search header__icon"></i>
                    </form>
        
                    <div className="header__toggle">
                        {/* <i className='bx bx-menu' id="header-toggle"></i> */}
                        <div
                            className={`
                                toggle__btn 
                                ${isActive && "active__toggle"}
                            `}
                            onClick={() => {
                                setActive(!isActive);
                            }}
                            >
                            <span className="border"></span>
                            <span className="border"></span>
                            <span className="border"></span>
                        </div>
                    </div>
                </div>
            </header>

            {/* SIDEBAR */}
            <div 
                className={`nav ${isActive && "show_menu"}`} 
                id="navbar"
                onClick={() => setActive(false)}
            >
                <nav className="nav__container">
                    <div>
                        <Link to="/" className="nav__link nav__logo">
                            <i className='bx bx-message-square'></i>
                            <span className="nav__logo_name">TubuYaki</span>
                        </Link>
        
                        <div className="nav__list">
                            <div className="nav__items">
                                <Link to="/" className="nav__link">
                                    <i className="bx bx-home nav__icon" ></i>
                                    <span className="nav__name">ホーム</span>
                                </Link>
                                <Link to={`/prof/${user.id}/`} className="nav__link">
                                    <i className="bx bx-user nav__icon" ></i>
                                    <span className="nav__name">プロフィール</span>
                                </Link>

                                <Link to="/settings/" className="nav__link">
                                    <i className="bx bx-cog nav__icon" ></i>
                                    <span className="nav__name">設定</span>
                                </Link>

                                <div className="nav__dropdown">
                                    <span className="nav__link">
                                        <i className="bx bx-message-detail nav__icon" ></i>
                                        <span className="nav__name">投稿</span>
                                        <i className="bx bx-chevron-down nav__icon nav__dropdown_icon"></i>
                                    </span>

                                    <div className="nav__dropdown_collapse">
                                        <div className="nav__dropdown_content">
                                            <Link to="/post/list/" className="nav__dropdown_item">一覧</Link>
                                            <Link to={`/post/user/${user.id}/like`} className="nav__dropdown_item">お気に入り</Link>
                                            <Link to="/post/add/" className="nav__dropdown_item">追加</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="nav__dropdown">
                                    <span className="nav__link">
                                        <i className="bx bx-spreadsheet nav__icon"></i>
                                        <span className="nav__name">学習計画</span>
                                        <i className="bx bx-chevron-down nav__icon nav__dropdown_icon"></i>
                                    </span>

                                    <div className="nav__dropdown_collapse">
                                        <div className="nav__dropdown_content">
                                            <a href="#" className="nav__dropdown_item">リスト</a>
                                            <a href="#" className="nav__dropdown_item">ブックマーク</a>
                                            <a href="#" className="nav__dropdown_item">追加</a>
                                        </div>
                                    </div>
                                </div> */}
                                
                                {user.id === 0 ?
                                    // ログイン前
                                    <>
                                    <Link to="/auth/register/" className="nav__link">
                                        <i className="bx bx-user-plus nav__icon" ></i>
                                        <span className="nav__name">ユーザー登録</span>
                                    </Link>
                                    <Link to="/auth/login/" className="nav__link">
                                    <i className="bx bx-log-in-circle nav__icon"></i>
                                        <span className="nav__name">ログイン</span>
                                    </Link>
                                    </>
                                :
                                    // ログイン後
                                    <span 
                                        className="nav__link nav__logout"
                                        onClick={Logout}
                                    >
                                        <i className="bx bx-log-out-circle nav__icon" ></i>
                                        <span className="nav__name">ログアウト</span>
                                    </span>
                                }
                                
                            </div>
                        </div>
                    </div>


                </nav>
            </div>
        </>
    )
}

export default Layout
