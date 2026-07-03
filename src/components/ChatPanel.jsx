import axios from "axios";
import { useEffect, useRef, useState } from "react";

import ChatMessage from "./ChatMessage";
import { BASE_URL } from "../utils/constant";

function ChatPanel({ videoId }) {

  const [question,setQuestion] =
  useState("");

  const [messages,setMessages] =
  useState([]);

  const [loading,setLoading] =
  useState(false);

  const bottomRef = useRef();

  const scrollBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    });
  };

  const fetchHistory =
  async()=>{

    try{

      const res =
      await axios.get(
        `${BASE_URL}/chat/history/${videoId}`,
        {
          withCredentials:true
        }
      );

      setMessages(
        res.data || []
      );

    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    if(videoId){
      fetchHistory();
    }
  },[videoId]);

  useEffect(()=>{
    scrollBottom();
  },[messages]);

  const askQuestion =
  async()=>{

    if(!question.trim()) return;

    const userMessage = {
      role:"user",
      content:question
    };

    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    try{

      setLoading(true);

      const res =
      await axios.post(
        `${BASE_URL}/chat/ask/question`,
        {
          question,
          videoId
        },
        {
          withCredentials:true
        }
      );

      const aiMessage = {
        role:"assistant",
        content:
          res.data.answer
      };

      setMessages(prev=>[
        ...prev,
        aiMessage
      ]);

      setQuestion("");

    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };

  return (

    <div className="bg-white rounded-xl shadow h-[700px] flex flex-col">

      <div className="p-4 border-b">

        <h2 className="font-bold text-xl">
          AI Assistant
        </h2>

      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {
          messages.map(
            (msg,index)=>(
              <ChatMessage
                key={index}
                message={msg}
              />
            )
          )
        }

        {
          loading && (
            <div className="text-gray-500">
              AI is thinking...
            </div>
          )
        }

        <div ref={bottomRef}></div>

      </div>

      <div className="border-t p-4 flex gap-2">

        <input
          value={question}
          onChange={(e)=>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Ask anything..."
          className="flex-1 border p-3 rounded"
        />

        <button
          onClick={askQuestion}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatPanel;