import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebase";
import styled from "styled-components";
import { useRouter } from 'next/router';
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import getRecipientEmail from './../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';


function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const endOfMessagesRef = useRef(null);
    const router = useRouter();
    const [messageSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp", "asc")
    );

    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where("email", "==", getRecipientEmail(chat.users, user))

    );

    const showMessages = () => {
        if (messageSnapshot) {
            return messageSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const scrollToButtom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();


        db.collection("users").doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

            },
            {
                merge: true
            }
        );
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });
        setInput('');
        scrollToButtom();
    };
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Conatainer>
            <Header>
                {recipient ? (<Avatar src={recipient?.photoURL} />)
                    :
                    (<Avatar>{recipientEmail[0]}</Avatar>)

                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active:{' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavaiable"}
                        </p>
                    ) : (<p>Loading last active</p>)
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </HeaderIcons>
            </Header>
            <MessageContainver>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainver>
            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />

                <button hidden disabled={!input} onClick={sendMessage}>Send Message </button>

                <MicIcon />
            </InputContainer>
        </Conatainer>
    );
}

export default ChatScreen;
const Button = styled.button``;
const Conatainer = styled.div`
    
`;
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    z-index: 100;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
`;
const Input = styled.input`
    flex: 1;
    align-items: center;
    padding: 10px;
    outline-width: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;


    
`;
const Header = styled.div`
    position: sticky;
    background: #fff;
    z-index: 100;
    top: 0;
    display: flex;
    padding : 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3{
        margin-bottom: 3px;
    }
    > p{
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcons = styled.div``;
const MessageContainver = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
const EndOfMessage = styled.div``;