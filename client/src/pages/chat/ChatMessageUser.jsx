import PropTypes from "prop-types";

// ChatMessageUser Component
const ChatMessageUser = ({ msg }) => {
    return (
        <div className='chat-message-wrapper-user'>
            <pre>
                {msg?.user}
            </pre>
        </div>
    )
}

ChatMessageUser.propTypes = {
    msg: PropTypes.shape({
        user: PropTypes.string,
    }).isRequired,
};

export default ChatMessageUser;
