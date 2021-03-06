// 상세페이지의 채팅 버튼을 누르면 갑툭튀하는 채팅창이 뜨게 하는 모달
// Detail.js (부모 컴포넌트) => ChatModal.js (자식 컴포넌트)
import React, {useState} from "react";

import styled from "styled-components";
import CloseIcon from '@material-ui/icons/Close';

// 소켓 통신
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import StompJS from '@stomp/stompjs';

import { actionCreators as chatActions } from "../redux/modules/chat"
import { actionCreators as userActions } from "../redux/modules/user"; 
import { useDispatch, useSelector } from "react-redux";

const ChatModal = (props) => {
  // 소켓 통신 객체
  const sock = new SockJS("http://localhost:8080/chatting");  // 소켓 연결 하는 url
  const ws = Stomp.over(sock);

  // 방 제목 가져오기 
  const roomName = useSelector((state) => state.chat.currentChat.roomName);
  const roomId = useSelector((state) => state.chat.currentChat.roomId);
  
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  // const [chats, setChats] = useState();

  // 토큰
  const dispatch = useDispatch();
  const token = localStorage.getItem('Authorization'); 

  // 보낼 메시지 텍스트
  const messageText = useSelector((state) => state.chat.messageText);


  const is_me = useSelector((state) => state.user.user.uid);
  const user_info = useSelector((state) => state.user.user);
  const chat_list = useSelector((state) => state.comment.list[props.id]);
  const is_chat = chat_list ? true : false;

  console.log(is_login)
  
  const ok_submit = chats? true: false;
  console.log(props)

  // 입력된 데이터를 채팅글귀용 데이터로 설정하는 함수
  const selectChat = (e) => {
    console.log(e.target.value);
    setChats(e.target.value);
  }

  
  // 채팅글귀 데이터를 전송하는 함수
  const addChat = () => {
    // if(!contents) {
    //   return;
    // }
    let chat = {
      chat: chats,  // 입력한 채팅메시지
      username: user_info.username,
      useremail: user_info.email,
      // profileUrl: user_info.
    }
    console.log(chat);
    dispatch(chatActions.addChatAPI(chat))
  }

  // 시간을 설정해주는 함수.
  const timeForToday = (value) => {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
        return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
    
  }

  // 채팅창은 크게 헤더+바디로 구성
  return( 
    <React.Fragment>
      {/* 모달 외부 */}
      <Component onclick={props.close}/>
      <ExitContainer>
        <ExitBtn onClick={props.close}>
          <CloseIcon fontsize="large"/>
        </ExitBtn>
      </ExitContainer>
      {/* 모달 본체 : 헤더 + 바디 + 맨 아래 채팅 입력창*/}
      <ModalComponent>
        <Header>
          <ChatRoomInfo>
            {/* <ProCircle src={props.profile_image_url} /> */}
            <ProCircle/>
            <SellerOfThis>{props.username}</SellerOfThis>
          </ChatRoomInfo>
        </Header>
        <BodyChatBox>
          {props.is_chat ?
          props.chat_list.map((c, idx) => {
            return 
              <ChatBox>
                <ProCircle src={c.profile_url}/>
                <Chat>
                  <div>
                    <Chatername>{c.user_name}</Chatername>
                      {c.chat}
                    <InsertTime>{timeForToday(props.insert_dt)}</InsertTime>
                  </div>
                </Chat>
              </ChatBox>
          })
          : null}

        </BodyChatBox>
        <ChatInputBox>
          <ChatInput 
              type="text"
              placeholder="채팅입력"
              onChange={selectComment} 
              value={comments}/>
          {ok_submit ? 
            <ChatUpload onClick={addChat}>게시</ChatUpload> 
            : <ChatUpload style={{opacity: "0.3"}}>게시</ChatUpload> }
        </ChatInputBox>
      </ModalComponent>
    </React.Fragment>
  )
}

export default ChatModal;

// 화면전체를 차지하는 부분.
// opacity값을 줘서 모달의 배경을 불투명한 옅은 검은색이 되게 한다.
// position: fixed로 화면이 고정되게 한다. 
const Component = styled.div`
  position: fixed;
  top: 0;
  opacity: 0.4;
  height: 100vh;
  width: 100vw;
  background-color: black;
  z-index: 10;
`;

// 모달밖의 공간을 클릭하면 모달이 바로 꺼지게 하는 부분.
const ExitContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 12px;
  z-index: 20;
`;

// 오른쪽 상단 구석에 x 버튼. 채팅창 없어진다.
const ExitBtn = styled.button`
  cursor: pointer;
  color: white;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
`;

const ModalComponent = styled.div`
  position: fixed;
  width: 700px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  display: flex;
  z-index: 20px;
  
  @media (max-width: 950px) {
    width: 350px;
  }
  
  @media (max-width: 350px) {
    width: 100%
  }
`;

const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #EFEFEF;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatRoomInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

const ProCircle = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-size: cover;
  margin-right: 10px;
`;

const SellerOfThis = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
`;

const BodyChatBox = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1px solid #EFEFEF;
  /* 채팅량이 많으면 스크롤로 아래 부분이
  위로 올라가게 해서 댓글이 보이게 하는 부분 */
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  };
`;

const ChatInputBox = styled.div`
  width: 100%;
  height: 56px;
  padding: 0px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid #EFEFEF;
`;

const ChatInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 80%
`;

const ChatUpload = styled.button`
  font-size: 14px;
  color: #3897F0;
  cursor: pointer;
  font-weight: 600;
`;

// BodyChatBox 안의 채팅란 설계
const ChatBox = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
`;       

const Chat = styled.div`
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
`;

const Chatername = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
`;

const InsertTime = styled.div`
  font-size: 10px;
  color: #999;
  border-bottom: 1px solid #EFEFEF;
  padding: 16px;
`;