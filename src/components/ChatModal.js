// 상세페이지의 채팅 버튼을 누르면 갑툭튀하는 채팅창이 뜨게 하는 모달
// Detail.js (부모 컴포넌트) => ChatModal.js (자식 컴포넌트)
import React, {useState} from "react";

import styled from "styled-components";
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";

// 소켓 통신
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import StompJS from '@stomp/stompjs';

import { history } from "../redux/configureStore";
import { actionCreators as chatActions } from "../redux/modules/chat"
import { actionCreators as userActions } from "../redux/modules/user"; 
import { useDispatch, useSelector } from "react-redux";

// let sockJS = new SockJS("http://52.78.12.253/chatting");  // 소켓 연결 하는 url
// let stompClient : Stomp.Client = Stomp.over(sockJS);  // 리턴받기  

// 소켓 통신 객체
// const sock = new SockJS("http://52.78.12.253/chatting");  // 소켓 연결 하는 url
// const ws = Stomp.over(sock);

const ChatModal = (props) => {

  const dispatch = useDispatch();

  let socket = new SockJS("http://52.78.12.253/chatting");
  // const ws = Stomp.over(sock);
  const stompClient = Stomp.over(socket);  // endpoint

  const post_list = useSelector((state) => {
      // console.log(state)
      // window.alert('')
      return state.post.detail_list
    });
  const target_idx = post_list.findIndex((p) => p.id == props.detail_id);
  const post_target = post_list[target_idx]
  
  // 이메일 정보
  const receiverEmail = post_target.email;
  const userEmail = localStorage.getItem('email');
  console.log(receiverEmail);

  const _token = localStorage.getItem("Authorization");
    let token = {
      headers : { Authorization: `${_token}` }, 
    }

  const API = `http://52.78.12.253/api/chat/newChat?receiver=${receiverEmail}&sender=${userEmail}`;
  axios.post(API, token)
    .then((response) => {
      console.log(response.data);

      let chatInfo = {
        senderName: response.data.senderName,
        senderEmail: response.data.senderEmail,
        senderId: response.data.senderId,
        receiverName: response.data.receiverName,
      }

      console.log(response.data.messages);
      console.log(chatInfo);
      dispatch(chatActions.getChatRoomInfo(chatInfo));
      // }
    }).catch((error) => {
      console.log(error)
      window.alert("채팅 데이터들을 가져오지 못했습니다.")
    })

  React.useEffect(()=>{
    const userEmail = localStorage.getItem('email');
    console.log(stompClient);
    stompClient.connect({}, function () {
        stompClient.subscribe('/topic/' + userEmail, function (e) {
            if(e.body.toString() == "notice"){
                // alertClosing('noticeCome',2000);
            }
            else{
                // alertClosing('comeMessage',2000);
            }
          });
        });
    }, []);

  const is_login = useSelector((state) => state.user.is_login);
  const is_me = useSelector((state) => state.user.user.uid);
  const user_info = useSelector((state) => state.user.user);

  const chat_info = useSelector((state) => state.chat.currentchat);
  console.log(chat_info);
  const chat_recevier = chat_info.receiverName;
  const chat_sender = chat_info.senderName;
  
  const [chats, setChats] = useState();
  const ok_submit = chats ? true : false;

  const selectChat = (e) => {
    console.log(e.target.value);
    setChats(e.target.value);
  }

  // // 웹소켓 연결, 구독
  // async function wsConnectSubscribe() {
  //   try {
  //     await ws.connect(
  //       {
  //         token: token,
  //       },
  //       () => {
  //         ws.subscribe(
  //           `/sub/api/chat/rooms/${roomId}`,
  //           (data) => {
  //             const newMessage = JSON.parse(data.body);
  //             dispatch(chatActions.getMessage(newMessage));
  //           },
  //           {token: token}
  //         );
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error)
  //   }
  // } 

  // // 웹소켓이 연결될 때까지 실행하는 함수
  // function waitForConnection(ws, callback) {
  //   setTimeout(
  //     function () {
  //       // 연결되면 콜백함수 실행
  //       if (ws.ws.readyState === 1) {
  //         callback();
  //         // 연결 안되면 재호출
  //       } else {
  //         waitForConnection(ws, callback);
  //       }
  //     }, 1 // 1밀리초 간격으로 실행
  //   )
  // }

  // // 메시지 보내기
  // async function sendMessage(){
  //   try {
  //     // token이 없으면 로그인 페이지로 이동
  //     if (!token) {
  //       alert('토큰이 없습니다. 다시 로그인 해주세요!');
  //       history.replace('/');
  //     }
  //     // send할 데이터
  //     const data = {
  //       type: 'TALK',
  //       roomId: roomId,
  //       sender: sender,
  //       message: messageText,
  //       senderEmail: null,
  //     }
  //     // 빈문자열이면 리턴
  //     if (messageText === "" ) {
  //       return;
  //     }
  //     // 로딩 중
  //     dispatch(chatActions.isloading());
  //     waitForConnection(ws, function () {
  //       ws.send(
  //         '/api/chat/message',
  //         {token: token},
  //         JSON.stringify(data)
  //       );
  //       console.log(ws.ws.readyState);
  //       dispatch(chatActions.writeMessage(''))
  //     })
  //   } catch (error) {
  //     console.log(error);
  //     console.log(ws.ws.readyState);
  //   }
  // }


  // 렌더링 될 때 마다 연결, 구독. 다른 방으로 옮길 때 연결, 구독 해제
  // React.useEffect(() => {

  //   wsConnectSubscribe();
  //   return () => {
  //     wsDisConnectUnsubscribe();
  //   };
  // }, [roomId]);


  // 채팅창은 크게 헤더+바디로 구성
  return( 
    <React.Fragment>
      {/* 모달 외부 */}
      <Component onClick={props.close}/>
      <ExitContainer>
        <ExitBtn onClick={props.close}>
          <CloseIcon fontSize="large"/>
        </ExitBtn>
      </ExitContainer>
      {/* 모달 본체 : 헤더 + 바디 + 맨 아래 채팅 입력창*/}
      <ModalComponent>
        <ModalHeader>
          {/* <ChatRoomInfo roomName={roomName}> */}
            {/* <ProCircle src={props.profile_image_url} /> */}
            {/* <ProCircle/> */}
            <SellerOfThis>{chat_recevier}</SellerOfThis>
          {/* </ChatRoomInfo> */}
        </ModalHeader>
        <BodyChatBox>
          {/* {props.is_chat ?
          props.chat_info.map((c, idx) => { */}
            <ChatBox>
              {/* <ProCircle src={c.profile_url}/> */}
              <Chat>
                <div>
                  <Chatername>{chat_sender}</Chatername>
                  {/* <Chatername>{c.user_name}</Chatername> */}
                    {/* {c.chat} */}
                  {/* <InsertTime>{timeForToday(props.insert_dt)}</InsertTime> */}
                  {/* {chat_message} */}
                </div>
              </Chat>
            </ChatBox>
          {/* })
          : null} */}

        </BodyChatBox>
        <ChatInputBox>
          <ChatInput 
              type="text"
              placeholder="채팅입력"
              onChange={selectChat} 
              // value={chats}
              />
          {/* {ok_submit ?  */}
            <ChatUpload 
              // onClick={addChat}
              >
                게시
            </ChatUpload> 
            {/* : <ChatUpload style={{opacity: "0.3"}}>게시</ChatUpload> } */}
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
  /* z-index: 10; */
  /* margin-top: 20px; */
  position: fixed;
  top: 0;
  opacity: 0.2;
  height: 100vh;
  width: 100vw;
  background-color: black;
`;

// 모달밖의 공간을 클릭하면 모달이 바로 꺼지게 하는 부분.
const ExitContainer = styled.div`
  z-index: 20;
  position: fixed;
  top: 0;
  right: 0;
  padding: 12px;
`;

// 오른쪽 상단 구석에 x 버튼. 채팅창 없어진다.
const ExitBtn = styled.button`
  /* z-index: 5; */
  cursor: pointer;
  color: white;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
`;

const ModalComponent = styled.div`
  z-index: 20px;
  position: fixed;
  margin: 20px;
  width: 700px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  display: flex;
  @media (max-width: 950px) {
    width: 350px;
  }
  @media (max-width: 350px) {
    width: 100%
  }
`;

const ModalHeader = styled.div`
  padding: 16px;
  height: 30px;
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