import React, { useEffect, useState } from 'react';
import Aside from '../aside';
import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext';
import axios from 'axios';
import getConfig from '../../utils/getConfig';
import { useSelector } from 'react-redux';

const AllChats = () => {
    const { isPinned } = useMenu();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState(''); // Estado para el mensaje
    const user = useSelector(state => state.userSlice);
    const getMyChats = () => {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats`;
        axios
            .get(URL, getConfig())
            .then((res) => {
                setChats(res.data);
            })
            .catch((err) => console.log(err));
    };
console.log(selectedChat)
    const sendMessage = async () => {
        if (!selectedChat || !message.trim()) return;

        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats/chats/${selectedChat.id}/messages`;
        
        try {
            const res = await axios.post(URL, { message, receiverId:selectedChat.user.id }, getConfig());
            // Actualiza los mensajes del chat seleccionado
            setSelectedChat({
                ...selectedChat,
                messages: [...selectedChat.messages, res.data],
            });
            setMessage(''); // Limpia el input
        } catch (error) {
            console.error('Error enviando el mensaje:', error);
        }
    };

    useEffect(() => {
        getMyChats();
    }, []);

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
                                    <div className="row">
                                        <div className="col-6 d-flex align-items-center">
                                            <h6 className="mb-0">Chats</h6>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="card-body p-3 pb-0">
                                    <ul className="list-group ps--scrolling-y scroll scrollHistory" style={{height:"50vh", overflow:'scroll'}}>
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
                                        <div className="card-header ">
                                            <h3 className="card-title">{selectedChat.user.firstName}<span className='m-2 text-sm'>{selectedChat.user.phone}</span></h3>
                                            <div className="card-tools">
                                            <button type="button" className="shadow-none hover btn-danger btn btn-tool" onClick={()=>setSelectedChat()}><i className="fas fa-times" />
                                            </button>
                                            </div>

                                        </div>
                                        <div className="card-body">
                                            <div className="direct-chat-messages">
                                                {selectedChat.messages?.map((message, index) => (
                                                    <div
                                                        key={index}
                                                        className={`direct-chat-msg ${
                                                            message.senderId === selectedChat.user.id ? 'right' : ''
                                                        }`}
                                                    >
                                                        <div className="direct-chat-infos clearfix">
                                                        <span className="direct-chat-timestamp float-left">
                                                                {message.createdAt}
                                                            </span>
                                                            <span className="direct-chat-name float-right">
                                                            {message.senderId === selectedChat.user.id ? selectedChat.user.firstName : ''}
                                                            </span>
                                                        </div>
                                                        <div className="direct-chat-text">{message.message}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }}
                                            >
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
