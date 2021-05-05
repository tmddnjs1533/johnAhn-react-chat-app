import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Button, Col, Form, Icon, Input, Row} from "antd";
import io from 'socket.io-client'
import { connect } from "react-redux"
import moment from "moment"
import { getChats, afterPostMessage } from "../../../_actions/chat_actions";
import ChatCard from "./Sections/ChatCard";
import Dropzone from 'react-dropzone'
import axios from "axios";

let server = 'http://localhost:5000/'
const socket = io(server);

const ChatPage = ({ user, chat, getChats, afterPostMessage }) => {
    const [chatMessage, setChatMessages] = useState('');
    const messageEnd = useRef()

    useMemo(() => {
        getChats()
        socket.on('Output Chat Message', messageFromBackEnd => {
            afterPostMessage(messageFromBackEnd)
        })


    }, [socket]);
    //

    useEffect(() => {
        messageEnd.current.scrollIntoView({behavior: 'smooth'})
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

    const onDrop = (files) => {
        console.log(files)
        let formData = new FormData;

        const config = {
            header: {
                "contents-type": 'multipart/form-data'
            }
        }
        formData.append("file", files[0])
        return axios.post('api/chat/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    let sendChatMessage = response.data.url;
                    let userId = user.userData._id
                    let userName = user.userData.name
                    let userImage = user.userData.image
                    let nowTime = moment()
                    let type = "VideoOrImage"
                    socket.emit("Input Chat Message", {
                        sendChatMessage,
                        userId,
                        userName,
                        userImage,
                        nowTime,
                        type
                    })
                }
                console.log(response)
            })
    }

    return (
        <>
            <div>
                <p style={{ fontSize: '2rem', textAlign: 'center' }}>Real Time Chat</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="infinite-container" style={{ height: '500px', overflowY: 'auto' }}>
                    {chat.chats && chat.chats.map(c => (
                        <ChatCard
                            key={c._id}
                            {...c}
                        />
                    ))}
                    <div
                        ref={messageEnd}
                        style={{ float: 'left', clear: 'both' }}
                    />
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
                        <Col span={2}>
                            <Dropzone onDrop={onDrop}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Button>
                                                <Icon type="upload" />
                                            </Button>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </Col>
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
}

const mapStateToProps = state => ({
    user: state.user,
    chat: state.chat
})
const mapDispatchToProps = dispatch => ({
    getChats: () => dispatch(getChats()),
    afterPostMessage: data => dispatch(afterPostMessage(data))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage)