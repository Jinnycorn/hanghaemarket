export type message = {
  username: string;
  content: string;
};
let sockJS = new SockJS("http://localhost:8080/chatting");  // 소켓 연결 하는 url
let stompClient : Stomp.Client = Stomp.over(sockJS);
stompClient.debug= () => {};
export const ChatContainer = ({}) => {
  const [contents, setContents] = React.useState<message[]>([]);
  const [username, setUsername] = React.useState('');
  const [message, setMessage] = React.useState("");
  useEffect(()=>{
    stompClient.connect({},()=>{
      stompClient.subscribe('/topic/userEmail',(data)=>{  // 
        const newMessage : message = JSON.parse(data.body) as message;
        addMessage(newMessage);
      });
  });
  },[contents]);
  const handleEnter = (username: string, content: string) => {
    const newMessage: message = { username, content };
    stompClient.send("/app/chat/send",{},JSON.stringify(newMessage)); // 메시지 보내기
    setMessage("");
  };
  const addMessage = (message : message) =>{
    setContents(prev=>[...prev, message]);
  };
  return (
    <div className={"container"}>
      <ChatPresenter
        contents={contents}
        handleEnter={handleEnter}
        message={message}
        setMessage={setMessage}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
};