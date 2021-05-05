import React from 'react';
import {Avatar, Comment, Tooltip} from "antd";
import moment from "moment";

const ChatCard = (props) => {
    return (
        <div style={{ width: '100%' }}>
            <Comment
                author={props.sender.name}
                avatar={<Avatar src={props.sender.image} alt={props.sender.name} />}
                content={<p>{props.message}</p>}
                datetime={<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')} ><span>{moment().fromNow()}</span></Tooltip> }
            />
        </div>
    )
}

export default ChatCard
