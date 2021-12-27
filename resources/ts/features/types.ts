// javascript でデータ型が定義されている
// export interface File extends Blob {
//   readonly lastModified: number;
//   readonly name: string;
// }

/*authSlice.ts*/
export interface PROPS_REGISTER {
    name: string;
    email: string;
    password: string;
  }
  export interface PROPS_AUTHEN {
    email: string;
    password: string;
  }
  export interface PROPS_UPDATE_PROFILE {
    nickName: string;
    // img: File | null;
    user:string ;
  }  

  export interface PROPS_NEWPOST {
    post: string;
    isPublic: string;
  
  }
  export interface PROPS_LIKED {
    id: string;
    post: string;
    isPublic: string,
    current: string[];
    new: string;
  }
  export interface PROPS_UPDATE_POST {
    id: string;
    // post: string;
    // postedBy: string;
    isPublic: string;
    // liked: string[];
  }
  export interface PROPS_COMMENT {
    content: string;
    post_id: number | undefined;
  }


export interface PROPS_POST {
    id: number;
    content: string;
    user: {id: string; name: string};
    img: string;
    created_at: string;
    // updatedAt: string;
    is_public: boolean;
    is_liked: boolean;
    count_likes: number;
    tags: {
        id: string;
        name: string;
    }[];
}