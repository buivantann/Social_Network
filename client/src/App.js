import { useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import RouterRender from './routes/RouterRender';
import PrivateRouter from './routes/PrivateRouter';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Forgot from './pages/forgotPassword';
import Reset from './pages/resetPassword';

import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import StatusModal from './components/home/create_post/StatusModal';
import NotFound from './components/NotFound';

import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from './redux/actions/authAction';
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAction';

import io from 'socket.io-client';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import Socket from './socket';
import { getNotifies } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs';

function App() {
  const { auth, status, modal, call } = useSelector((state) => state);
  const { isLogged } = auth;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/',
      secure: true,
    });

    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
  }, [dispatch]);

  return (
    <Router>
      <Alert />

      <div className={`App ${(status || modal) && 'mode'}`}>
        {auth.token && <Header />}
        {status && <StatusModal />}
        {auth.token && <Socket />}
        {call && <CallModal />}

        <Route exact path="/" component={auth.token ? Home : Login} />
        <Route exact path="/register" component={isLogged ? NotFound : Register} />
        <Route exact path="/forgot_password" component={isLogged ? NotFound : Forgot} />
        <Route exact path="/reset/:token" component={isLogged ? NotFound : Reset} />

        <PrivateRouter exact path="/:page" component={RouterRender} />
        <PrivateRouter exact path="/:page/:id" component={RouterRender} />
      </div>
    </Router>
  );
}

export default App;
