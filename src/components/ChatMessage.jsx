import ReactMarkdown from "react-markdown";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-xl ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatMessage;