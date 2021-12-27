import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

import { AppDispatch } from "../../../app/store";
import {
  resetOpenProfiles,
  selectOpenProfiles,
  selectProfiles,
  selectProfilesTitle,
} from '../../pages/Auth/authSlice' 

const customStyles = {
    overlay: {
      backgroundColor: "rgba(1, 111, 233, 0.5)",
      // backdropFilter: "blur(5px)",
      zIndex: 100,
    },
    content: {
      top: "50%",
      left: "50%",
      width: 300,
      height: 500,
      padding: "20px",
      transform: "translate(-50%, -50%)",
    },
  };

const Profiles: React.FC = () => {
    Modal.setAppElement("#app");
    const dispatch: AppDispatch = useDispatch();
    const openProfiles = useSelector(selectOpenProfiles);
    const profiles = useSelector(selectProfiles);
    const profilesTitle = useSelector(selectProfilesTitle);

    return (
        <Modal
            isOpen={openProfiles}
            onRequestClose={ () => {
                dispatch(resetOpenProfiles());
            }}
            style={customStyles}
        >
            <div className="profiles">
              <div className="profiles_title">{profilesTitle}</div>
                {profiles
                  .map((prof, index) => ( 
                    <div key={index} >
                      <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${prof.id}/`}
                        onClick={() => {dispatch(resetOpenProfiles());}}
                      > 
                          <div className="profile_link">
                            <Avatar>{prof.name.slice(0, 1)}</Avatar>
                            <div className="nick_name">{prof.name}</div>
                          </div>
                      </Link>
                      <hr/>
                    </div>
                  ))
                }
            </div>
        </Modal>
    )
};

export default Profiles;