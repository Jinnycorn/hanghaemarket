import React from "react";
import styled from "styled-components";
import Post from "../components/Post";

import {useSelector,useDispatch} from "react-redux";
import {actionCreators as postActions} from "../redux/modules/post";

const PostList=(props)=>{
    
    const dispatch=useDispatch();
    const post_list=useSelector((state)=>state.post.list);
    console.log(post_list); //안나옴
    
    return(
        <React.Fragment>
            <PostListContainer>
                <h2>오늘의 상품 추천!</h2>     
                <WrapProducts>           
                    {/* <Post/> */}
                    {post_list.map((p,idx)=>{
                        return <Post key={p.id} {...p}/>
                    })}
                </WrapProducts>
            </PostListContainer>
        </React.Fragment>
    )
}


const PostListMainContainer = styled.div`
  padding-top: 90px; 
  display: flex;
  flex-direction: column;

`;

const PostListContainer=styled.div`
margin:auto;
background:#fff;
height:100vh;
width:1000px;


`;

const Title=styled.h2`

`;

const WrapProducts=styled.div`
// display:flex;
// flex-direction:row;
// flex-wrap:wrap;
// justify-content:space-evenly;
`;

export default PostList;