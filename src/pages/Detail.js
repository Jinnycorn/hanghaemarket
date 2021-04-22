import React,{useState,useEffect} from 'react';

import styled from 'styled-components';
import img from "../shared/watch6.jpg";

import ChatModal from "../components/ChatModal";

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatIcon from '@material-ui/icons/Chat';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ProductInfoTab from '../elements/ProductInfoTab';

import { history } from "../redux/configureStore";
import { useDispatch, useSelector } from "react-redux"; 
import { actionCreators as userActions } from "../redux/modules/user"
import { actionCreators as postActions } from "../redux/modules/post"
// import { actionCreators as chatActions} from "../redux/modules/chat"

const Detail =(props)=>{

  
    //여기에 클릭했을 때 getPostAPI 해온 정보들 가져오고싶음
    
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);
    const [ chat, setChats ] = useState();
    const [ is_chatmodal, setChatModal ] = useState();
    const [ btnChange, setBtnChange ] = useState(false);

    const BoardId=props.id;
    const detail_id = props.match.params.ids;  // 참고 사이트 : https://velopert.com/3417
    const is_me = useSelector((state) => state.user.user.username);  // 지금 로그인한 바로 나!
    const user_info = useSelector((state) => state.user.user);  // 
    // const chat_list = useSelector((state) => state.chat.list[props.id]);  // 채팅리스트를 가져온다
    // const is_chat = chat_list ? true : false;  // 채팅리스트가 있는가?
    // console.log(is_me);
    // console.log(user_info);
    // console.log(detail_id);
    // dispatch(postActions.getPostAPI(detail_id));

    React.useEffect(() => {
      dispatch(postActions.getPostAPI(detail_id));
    }, []);

    const post_list = useSelector((state) => {
      // console.log(state)
      // window.alert('')
      return state.post.detail_list
    });

    //console.log(post_list);
    const target_idx = post_list.findIndex((p) => p.id == detail_id);
    //console.log(target_idx);
    const post_target = post_list[target_idx]
    //console.log(post_target);

    // const post_list = useSelector((state) => state.post.list)
    // console.log(post_list);
    // const target_idx = post_list.findIndex((p) => p.id == detail_id);
    // console.log(target_idx);
    // const post_target = post_list[target_idx]
    // console.log(post_target);

    const changeHeart = () => {
      setBtnChange(!btnChange);
    };

    const openChatModal = () => {
      setChatModal(true);
    };

    const closeChatModal = () => {
      setChatModal(false);
    };

    const likeSubmit = () => {
      let post = {//입력하는거
        like_check:false
      }
      //console.log(post) //작은 포스트 안에 라이크cnt있음
      dispatch(postActions.getHeartAPI(BoardId));//라이크서브밋함수에서 입력 받아서 editlikeax 미들웨어로 보내주기

    }
    
    
    // React.useEffect(() => {
    //   dispatch(chatActions.getChatAPI.())
    // }, [])

    // 채팅모달창을 제어하는 함수들
    // const selectChat = (e) => {
    //   console.log(e.target.value);
    //   setChats(e.target.value);
    // };

    return ( 
      <>
      {post_target && 
    <React.Fragment> 
      
        <DetailMainContainer>
        <SellInfo>
            <ImgBox><img src={post_target.image_url} width="400px" height="400px"></img></ImgBox>
            <InfoBox>
                <ProductContentsBox>
                    
                    <div><h2>{post_target.title}</h2></div>
                    <PriceBox><p><span>{post_target.price}</span> 원</p></PriceBox>
                    <IconsBox>
                        <FavoriteIcon style={{ fontSize: 20,  margin: "5px 10px", color:"#CCCCCC" }}/>    
                        <VisibilityIcon style={{ fontSize: 25,  margin: "5px 10px", color:"#CCCCCC" }}/>
                    </IconsBox>
                    <p>상품상태: 사용감 있음</p>
                    <p>배송비: 배송비 별도</p>
                    <p>거래지역: 분당, 판교, 강남</p>    
                </ProductContentsBox>            
                <ButtonBox>
                  
                    <LikeButton
                      // onClick={likeSubmit}
                      onClick={(e)=>{
                        if(btnChange===false)
                        {
                          changeHeart();
                          e.preventDefault();
                          e.stopPropagation();
                        }else{
                          changeHeart();
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      >
                    {btnChange===false? <FavoriteBorderIcon style={{ fontSize: 15, margin: "0 10px" }}/>:<FavoriteIcon style={{ fontSize: 15 }}/>}
                        {/* <HeartStyle>
                            <FavoriteBorderIcon style={{ fontSize: 15 }}/>
                        </HeartStyle> */}
                      찜
                    </LikeButton>

                    <ChatButton 
                      onClick={openChatModal}
                      detail_id={detail_id}
                      // is_chat={is_chat}
                      // chat_list={chat_list}
                      // is_me={is_me}
                      // // user_info={user_info} 
                      >
                        <ChatStyle>
                            <ChatIcon style={{ fontSize: 15,  margin: "0 10px" }}></ChatIcon>
                        </ChatStyle>
                        채팅하기
                    </ChatButton>
                </ButtonBox>            
            </InfoBox>
        </SellInfo>
        
        {/* <WrapTab>
            <ProductInfoTab {...props}/>
        </WrapTab> */}
        
        <WrapInfo>
            <SelectInfoBar>
                <ProductInfoButton><h3>상품정보</h3></ProductInfoButton>           
            </SelectInfoBar>
            
            <WrapSelectInfo>
                <ProductInfo>
                    <div><h3>상품정보</h3></div>
                    <div>{post_target.content}</div>
                    
                    <div><h3>상품문의</h3></div>
                    <QuestionInput/>
                  <QuestionButton>등록</QuestionButton>

                </ProductInfo>
                <StoreInfo>

                </StoreInfo>
            </WrapSelectInfo>
        </WrapInfo>
      </DetailMainContainer>
        {is_chatmodal ? 
          <ChatModal
            close={closeChatModal}
            {...props}
            detail_id={detail_id}
            // chat_list={chat_list}
            // is_chat={is_chat}
            // is_me={is_me}
            // user_info={user_info}
          />
          : null}
    </React.Fragment>
      }
      </>
    );
}

Detail.defaultProps = {

};

const DetailMainContainer= styled.div`
  padding-top: 90px; 
`;

const SellInfo=styled.div`
display: flex;
padding: 30px 0px;
justify-content:center;
margin:auto;
width:1020px;
padding-bottom: 20px;

`;

const TitleBox=styled.div`
`;
const ImgBox=styled.div`
margin-top: 10px;
margin-right: 150px;
flex-shrink: 0;
`;

const InfoBox = styled.div`
margin-top: 10px;
width:500px;
height: 400px;
display: flex;
flex-direction: column;
-webkit-box-pack: justify;
justify-content: space-between;
align-items:center;
margin-right: 50px;

`;

const ProductContentsBox=styled.div`
padding-right: 100px;
margin: 0px;
border: 0px;
font: inherit;
vertical-align: baseline;

p > span{
    font-weight: bold;
    font-size:40px;
}

`;

const PriceBox=styled.div`
padding-bottom: 3px;
border-bottom: 1px solid rgb(238, 238, 238);
`;

const IconsBox=styled.div`

display: flex;
-webkit-box-align: center;
align-items: center;
`;

const ButtonBox=styled.div`
display: flex;
-webkit-box-pack: justify;
justify-content: space-between;
`;


const LikeButton=styled.button`
margin-right:30px;
padding: 8px 24px;
background-color:#6fa1f6;
border-radius:30px;
margin:8px;
border:1px solid #6fa1f6;
width:11vw;
font-size:15px;
color:#fff;
cursor: pointer;
`;

const HeartStyle=styled.div`
margin-bottom: 2px;
`;

const ChatButton=styled.button`

padding: 8px 24px;
background-color:#6fa1f6;
border-radius:30px;
margin:8px;
border:1px solid #6fa1f6;
width:11vw;
font-size:15px;
color:#fff;
cursor: pointer;

`;

const ChatStyle=styled.div`
margin-bottom: 2px;
`;

const WrapTab=styled.div`
padding-top: 30px; 
width: 1000px;
margin: auto;

`;
const WrapInfo=styled.div`
justify-content:center;
width:1020px;
margin:auto;

`;
const SelectInfoBar=styled.div`
display: flex;
height: 70px;
margin-top: 30px;

`;

const ProductInfoButton=styled.button`

flex: 1 1 0%;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    border-color: white;
    background-color: #ebf2f5;
`;

const StoreInfoButton=styled.button`
// padding: 8px 24px;
// background-color:#adaeaf;
// border-radius:10px;
// margin:8px;
// border:1px solid #adaeaf;
// width:15vw;
// height:5vh;

// & h3 {
//     margin-top: 0px;
//     margin-bottom: 0px;
// }

flex: 1 1 0%;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
display: flex;
border-top: 1px solid rgb(238, 238, 238);
border-right: 1px solid rgb(238, 238, 238);
border-bottom: 1px solid rgb(33, 33, 33);
background: rgb(250, 250, 250);
color: rgb(136, 136, 136);

`;

const WrapSelectInfo=styled.div`
padding-right: 30px;
border-right: 1px solid rgb(238, 238, 238);
height: calc(100% - 50px);

`;

const ProductInfo=styled.div`
margin-left: 100px;
`;
const StoreInfo=styled.div`

`;

const QuestionInput = styled.input`
  padding: 9px 0px 7px 8px;
  background-color: #FAFAFA;
  font-size: 13px;
  line-height: 18px;
  width: 500px;
  color: #262626;
  border: 1px solid #DBDBDB;
  outline: none;
  border-radius: 5px;
  height: 30px;
  margin-bottom: 12px;
`;

const QuestionButton=styled.button`
margin-left: 15px;
padding: 8px 24px;
background-color:#6fa1f6;
border-radius:50px;
margin:8px;
border:1px solid #6fa1f6;
width:5vw;
font-size:15px;
color:#fff;
cursor:point;
`;

export default Detail;