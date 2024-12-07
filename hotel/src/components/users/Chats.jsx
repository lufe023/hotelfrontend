import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../Navbar";
import axios from "axios";
import getConfig from "../../utils/getConfig";

const socket = io(import.meta.env.VITE_API_SERVER);

const Chats = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null); // Para almacenar el ID del usuario autenticado
  const [recipientId] = useState("c064508c-17e2-4c9d-a12d-288bd8c6740a"); // ID fijo de Amnia Santana
  const [chats, setChats] = useState([])
  // Obtener el token del localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Si el token está disponible, decodificar el userId
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id); // Extraemos el userId del token
    }

    // Recibir mensajes
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: data.senderId === userId ? "yo" : "otro", body: data.content },
      ]);
    });

    // Confirmación de envío
    socket.on("message_sent", (data) => {
      console.log("Mensaje enviado:", data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, [token, userId]);

  // Enviar un mensaje
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return; // Evitar enviar mensajes vacíos
    }

    const newMessage = {
      chatId: "CHAT_ID", // ID del chat (reemplaza con el real)
      senderId: userId,  // ID del remitente (usamos el ID del usuario del token)
      recipientId: recipientId, // ID del destinatario (Amnia Santana en este caso)
      content: message,
      token: token, // Enviamos el token al backend para verificar la autenticación
    };

    socket.emit("send_message", newMessage);
    setMessages([...messages, { from: "yo", body: message }]);
    setMessage(""); // Limpiar el campo de texto
  };

  const getMyChats = () => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats`;
    axios
        .get(URL, getConfig())
        .then((res) => {
            setChats(res.data);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getMyChats()
  }, [])
  console.log(chats)
  return (
    <div>
        <Navbar/>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.from} dice: {msg.body}
          </li>
        ))}
      </ul>
    <div className="col-md-3">
  {/* DIRECT CHAT PRIMARY */}
  <div className="card card-primary card-outline direct-chat direct-chat-primary">
    <div className="card-header">
      <h3 className="card-title">Direct Chat</h3>
      <div className="card-tools">
        <span title="3 New Messages" className="badge bg-primary">3</span>
        <button type="button" className="btn btn-tool" data-card-widget="collapse">
          <i className="fas fa-minus" />
        </button>
        <button type="button" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
          <i className="fas fa-comments" />
        </button>
        <button type="button" className="btn btn-tool" data-card-widget="remove">
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
    {/* /.card-header */}
    <div className="card-body" style={{display: 'block'}}>
      {/* Conversations are loaded here */}
      <div className="direct-chat-messages">
        {/* Message. Default to the left */}
        <div className="direct-chat-msg">
          <div className="direct-chat-infos clearfix">
            <span className="direct-chat-name float-left">Alexander Pierce</span>
            <span className="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
          </div>
          {/* /.direct-chat-infos */}
          <img className="direct-chat-img" style={{width:40}} src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg" alt="Message User Image" />
          {/* /.direct-chat-img */}
          <div className="direct-chat-text">
            Is this template really for free? That's unbelievable!
          </div>
          {/* /.direct-chat-text */}
        </div>
        {/* /.direct-chat-msg */}
        {/* Message to the right */}
        <div className="direct-chat-msg right">
          <div className="direct-chat-infos clearfix">
            <span className="direct-chat-name float-right">Sarah Bullock</span>
            <span className="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>
          </div>
          {/* /.direct-chat-infos */}
          <img className="direct-chat-img" style={{width:40}}  src="https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp" alt="Message User Image" />
          {/* /.direct-chat-img */}
          <div className="direct-chat-text">
            You better believe it!
          </div>
          {/* /.direct-chat-text */}
        </div>
        {/* /.direct-chat-msg */}
      </div>
      {/*/.direct-chat-messages*/}
      {/* Contacts are loaded here */}
      <div className="direct-chat-contacts">
        <ul className="contacts-list">
          <li>
            <a href="#">
              <img className="contacts-list-img" src="../dist/img/user1-128x128.jpg" alt="User Avatar" />
              <div className="contacts-list-info">
                <span className="contacts-list-name">
                  Count Dracula
                  <small className="contacts-list-date float-right">2/28/2015</small>
                </span>
                <span className="contacts-list-msg">How have you been? I was...</span>
              </div>
              {/* /.contacts-list-info */}
            </a>
          </li>
          {/* End Contact Item */}
        </ul>
        {/* /.contatcts-list */}
      </div>
      {/* /.direct-chat-pane */}
    </div>
    {/* /.card-body */}
    <div className="card-footer" style={{display: 'block'}}>
      <form action="#" method="post">
        <div className="input-group">
          <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
          <span className="input-group-append">
            <button type="submit" className="btn btn-primary">Send</button>
          </span>
        </div>
      </form>
    </div>
    {/* /.card-footer*/}
  </div>
  {/*/.direct-chat */}
</div>

    </div>
  );
};

export default Chats;
