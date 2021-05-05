import React, {useState, useEffect} from 'react';
import {Button, Col, Form, Icon, Input, Row} from "antd";
import io from 'socket.io-client'
import { connect } from "react-redux"
import moment from "moment"
import { getChats } from "../../../_actions/chat_actions";
import ChatCard from "./Sections/ChatCard";

const ChatPage = ({ user, chat, getChats }) => {
    const [chatMessage, setChatMessages] = useState('');
    let server = 'http://localhost:5000/'



    const socket = io(server);


    useEffect(() => {
        getChats()
        socket.on('Output Chat Message', messageFromBackEnd => {
            console.log(messageFromBackEnd)
        })
    }, [chat]);


    const onSubmit = (e) => {
        e.preventDefault()
        let sendChatMessage = chatMessage;
        let userId = user.userData._id
        let userName = user.userData.name
        let userImage = user.userData.image
        let nowTime = moment()
        let type = "Text"

        socket.emit("Input Chat Message", {
            sendChatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        })
        setChatMessages('')
    }
    return (
        <>
            <div>
                <p style={{ fontSize: '2rem', textAlign: 'center' }}>Real Time Chat</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="infinite-container">
                    {chat.chats && chat.chats.map(c => (
                        <ChatCardgi
                            key={c._id}
                            sender={c.sender}
                            message={c.message}
                        />
                    ))}
                    {/*<div
                        ref={el => { setMessagesEnd(el); }}
                        style={{ float: 'left', clear: 'both'}}
                        />*/}
                </div>

                <Row>
                    <Form layout="inline" onSubmit={onSubmit}>
                        <Col span={18}>
                            <Input
                                id="message"
                                prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Let's start talking"
                                type="text"
                                value={chatMessage}
                                onChange={e => setChatMessages(e.target.value)}
                                />
                        </Col>
                        <Col span={2}></Col>
                        <Col span={4}>
                            <Button type="primary" style={{ width: '100%' }} htmlType="submit">
                                <Icon type="enter" />
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    user: state.user,
    chat: state.chat
})
const mapDispatchToProps = dispatch => ({
    getChats: () => dispatch(getChats())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage)
