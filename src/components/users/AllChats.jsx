import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { ChatContext } from '../../utils/ChatContext';  // Importa el contexto
import Aside from '../aside';
import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext';
import axios from 'axios';
import getConfig from '../../utils/getConfig';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const AllChats = () => {
    const chatRef = useRef(null);
    const parametros = useParams()
    const chatId = parametros.id

    const { isPinned } = useMenu();
    const { chats, selectedChat, setSelectedChat, user, getMyChats } = useContext(ChatContext);
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



    const handleAssignAgent = (chatId, agentId) => {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats/chats/${chatId}`;
        axios
          .patch(URL,{ agentId }, getConfig())
          .then((res) => {
            getMyChats()
            Swal.fire({
                icon: 'success',
                title: '¡Agente asignado!',
                text: `Ahora tienes este caso.`,
              });
            
          })
          .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema al asignarte este caso`,
              });
            console.log(err)});
    }

    const putChatCompleted = (chatId) =>{
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats/chats/${chatId}`;
        axios
          .patch(URL,{ status:'completed' }, getConfig())
          .then((res) => {
            getMyChats()
          })
          .catch((err) => {
            console.log(err)});
    }

    const putBotAgent = (userId) => {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/users/${userId}`;
        axios
          .patch(URL,{ isBotTalking:false}, getConfig())
          .then((res) => {
            getMyChats()
          })
          .catch((err) => {
            console.log(err)});      
    }

    const handleChatCompleted = (chatId, userId)=>{
        Swal.fire({
            title: "¿Estas seguro?",
            html: `
            ¿Estas seguro que quieres marcar este chat como completado? esta acción hará que el chat desaparezca de tu lista pero no se borrará del sistema.
          `,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Si, completar!",
            denyButtonText: `Dejar sin efecto`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Caso completado", "", "success");
              putChatCompleted(chatId)
              putBotAgent(userId)
            } else if (result.isDenied) {
              Swal.fire("No hubo cambios", "", "info");
            }
          });
        }

        useEffect(() => {
          const found = chats.find((element) => element.id === chatId);
          setSelectedChat(found)
        }, [chatId])
        
       

    return (
      <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
        <Aside />
          <Navbar />
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
          <div className="container-fluid py-4">
            <div className="row">
     
              <div className="col-lg-8 order-lg-2">
                <div className="row">
                  {selectedChat && (
                    <div className="card card-primary card-outline direct-chat direct-chat-primary">
                      <div className="card-header">
                        <h3 className="card-title">
                          {selectedChat.user.firstName}
                          <span className="m-2 text-sm">{selectedChat.user.phone}</span>
                        </h3>
                        {!selectedChat.agentId &&
                        <button onClick={()=>handleAssignAgent(selectedChat.id, user.id)} className='btn btn-dark float-right'>Asignarme este caso</button>
                        }
                      </div>
                      <div className="card-body">
                        <div
                          className="direct-chat-messages"
                          ref={chatRef}
                          style={{ overflowY: 'scroll', maxHeight: '400px' }}
                        >
                         {selectedChat.messages
  ?.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)) // Ordena los mensajes por fecha (más recientes al final)
  .map((message, index) => (
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
                            {selectedChat.agentId &&
                          <div className="input-group">
                            <input
                              type="text"
                              name="message"
                              placeholder={`Escribe un mensaje para ${selectedChat.user.firstName}`}
                              className="form-control"
                              autoComplete="off"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              style={{marginRight:"-3px", minHeight:"41px"}}
                            />
                            <span className="input-group-append">
                              <button type="submit" className="btn btn-primary">
                                Send
                              </button>
                            </span>
                          </div>
                          }
                        </form>
                        <button className='btn btn-danger' onClick={()=>handleChatCompleted(selectedChat.id,selectedChat.user.id)}>Marcar como completado</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4 order-lg-1">
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
                            <span className="text-xs" style={{display:"flex"}}>
                              {chat.messages[0]?.message}
                              {!chat.status === 'active' &&
                              <i className="fas fa-check-circle" />
                            }
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
            </div>
          </div>
        </main>
      </div>
    );
  };

export default AllChats;
