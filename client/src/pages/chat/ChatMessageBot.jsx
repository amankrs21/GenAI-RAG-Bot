import PropTypes from "prop-types";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { Highlight, themes } from "prism-react-renderer";
import { ContentCopy, ThumbUp, ThumbDown } from "@mui/icons-material";

import ChatFeedback from "./ChatFeedback";


// ChatMessageBot component
const ChatMessageBot = ({ msg, isLiked, isDisliked, onLike, onDislike }) => {

    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const messageText = msg.bot || msg.user || "No message content";
    const sender = msg.bot ? "bot" : msg.user ? "user" : "unknown";

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }).catch((err) => {
            toast.error("Failed to copy code!");
            console.error("Copy failed:", err);
        });
    };

    const handleDislikeFeedback = (comment) => {
        onDislike(comment);
        setOpen(false);
    }

    return (
        <div className={`chat-message-wrapper ${sender}`}>
            <ReactMarkdown
                children={messageText}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ children }) => <h1 className="markdown-heading">{children}</h1>,
                    h2: ({ children }) => <h2 className="markdown-heading">{children}</h2>,
                    h3: ({ children }) => <h3 className="markdown-heading">{children}</h3>,
                    h4: ({ children }) => <h4 className="markdown-heading">{children}</h4>,
                    ol: ({ children }) => <ol className="markdown-list">{children}</ol>,
                    ul: ({ children }) => <ul className="markdown-list">{children}</ul>,
                    li: ({ children }) => <li className="markdown-list-item">{children}</li>,
                    code({ inline, className, children, ...props }) {
                        const codeContent = String(children).replace(/\n$/, "");
                        const match = /language-(\w+)/.exec(className || "");
                        if (!inline && match) {
                            return (
                                <div className="code-block-wrapper">
                                    <Highlight
                                        theme={themes.github}
                                        code={codeContent}
                                        language={match[1]}
                                    >
                                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                            <pre
                                                className={className}
                                                style={{
                                                    ...style,
                                                    margin: 0,
                                                    padding: "12px",
                                                    fontSize: "13px",
                                                    borderRadius: "5px",
                                                    background: "#121314",
                                                }}
                                            >
                                                {tokens.map((line, i) => {
                                                    const lineProps = getLineProps({ line, key: i });
                                                    const { key: lineKey, ...restLineProps } = lineProps;
                                                    return (
                                                        <div key={lineKey} {...restLineProps}>
                                                            {line.map((token, key) => {
                                                                const tokenProps = getTokenProps({ token, key });
                                                                const { key: tokenKey, ...restTokenProps } = tokenProps;
                                                                return <span key={tokenKey} {...restTokenProps} />;
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </pre>
                                        )}
                                    </Highlight>

                                    <IconButton
                                        aria-label="copy code"
                                        onClick={() => handleCopy(codeContent)}
                                        className="copy-button"
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            color: "white",
                                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                                            opacity: copied ? 1 : 0.7,
                                            transition: "opacity 0.3s",
                                        }}
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </div>
                            );
                        }
                        return (
                            <code className={`inline-code ${className || ""}`} {...props}>
                                {codeContent}
                            </code>
                        );
                    },
                }}
            />
            {sender === "bot" && (
                <div className="feedback-buttons">
                    <IconButton size="small" color={isLiked ? "primary" : "default"}
                        disabled={isDisliked} onClick={onLike}>
                        <ThumbUp fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color={isDisliked ? "error" : "default"}
                        disabled={isLiked} onClick={() => isDisliked ? onDislike() : setOpen(true)}>
                        <ThumbDown fontSize="small" />
                    </IconButton>
                </div>
            )}
            {open && <ChatFeedback open={open} setOpen={setOpen} onsubmit={handleDislikeFeedback} />}
        </div>
    );
};

ChatMessageBot.propTypes = {
    msg: PropTypes.shape({
        bot: PropTypes.string,
        user: PropTypes.string,
    }).isRequired,
    isLiked: PropTypes.bool,
    isDisliked: PropTypes.bool,
    onLike: PropTypes.func.isRequired,
    onDislike: PropTypes.func.isRequired,
};
ChatMessageBot.defaultProps = {
    isLiked: false,
    isDisliked: false,
};

export default ChatMessageBot;
