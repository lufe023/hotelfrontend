import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MenuProvider } from './utils/MenuContext';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store'
import { NotificationProvider } from './utils/NotificationContext.jsx';
import { ChatProvider } from './utils/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
    <Provider store={store}>
    <NotificationProvider>
    <ChatProvider>
    <MenuProvider>
    <App />
    </MenuProvider>
    </ChatProvider>
    </NotificationProvider>
    </Provider>
    </HashRouter>
  </StrictMode>,
)
