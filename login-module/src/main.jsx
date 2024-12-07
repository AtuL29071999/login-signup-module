import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "23621445607-9o9nu3u9nv7ijteb42keimco618mkarf.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>,
  {/* </StrictMode>, */}
)
