import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { ChatContext } from '../../utils/ChatContext';  // Importa el contexto
import Aside from '../aside';
import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext';
import axios from 'axios';
import getConfig from '../../utils/getConfig';

const AllChats = () => {
    const chatRef = useRef(null);
    const { isPinned } = useMenu();
    const { chats, selectedChat, setSelectedChat, handleNewMessageNotification } = useContext(ChatContext);
    const [message, setMessage] = useState('');
  
    const handleSendMessage = () => {
      if (!selectedChat || !message.trim()) return;
  
      const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats/chats/${selectedChat.id}/messages`;
      axios
        .post(URL, { message, receiverId: selectedChat.user.id }, getConfig())
        .then((res) => {
          setSelectedChat({
            ...selectedChat,
            messages: [...selectedChat.messages, res.data],
          });
          setMessage('');
        })
        .catch((err) => console.log(err));
    };
  
    useEffect(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, [selectedChat]);
  
    return (
      <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
        <Aside />
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
          <Navbar />
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-lg-4">
                <div className="card h-100">
                  <div className="card-header pb-0 p-3">
                    <h6 className="mb-0">Chats</h6>
                  </div>
                  <div className="card-body p-3 pb-0">
                    <ul className="list-group ps--scrolling-y scroll" style={{ height: "50vh", overflow: 'scroll' }}>
                      {chats?.map((chat) => (
                        <li
                          key={chat.id}
                          className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
                        >
                          <div className="d-flex flex-column">
                            <h6 className="mb-1 text-dark font-weight-bold text-sm">
                              {chat.user.firstName}
                            </h6>
                            <span className="text-xs">
                              {chat.messages[0]?.message}
                            </span>
                          </div>
                          <button
                            className="btn btn-link text-dark text-sm mb-0 px-0 ms-4"
                            onClick={() => setSelectedChat(chat)}
                          >
                            Leer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  {selectedChat && (
                    <div className="card card-primary card-outline direct-chat direct-chat-primary">
                      <div className="card-header">
                        <h3 className="card-title">
                          {selectedChat.user.firstName}
                          <span className="m-2 text-sm">{selectedChat.user.phone}</span>
                        </h3>
                      </div>
                      <div className="card-body">
                        <div
                          className="direct-chat-messages"
                          ref={chatRef}
                          style={{ overflowY: 'scroll', maxHeight: '400px' }}
                        >
                          {selectedChat.messages?.map((message, index) => (
                            <div
                              key={index}
                              className={`direct-chat-msg ${message.senderId === selectedChat.user.id ? 'right' : ''}`}
                            >
                              <div className="direct-chat-text">{message.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card-footer">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                          <div className="input-group">
                            <input
                              type="text"
                              name="message"
                              placeholder="Type Message ..."
                              className="form-control"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <span className="input-group-append">
                              <button type="submit" className="btn btn-primary">
                                Send
                              </button>
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

export default AllChats;
