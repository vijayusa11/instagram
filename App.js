import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase.js';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from 'firebase';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [user, setUser] = useState(null);
  const [openSignIn, setopenSignIn] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser){
            console.log(authUser);
            setUser(authUser);
            if(authUser.displayName){

            }else{
              return authUser.updateProfile({
                displayName: username,
              })
            }
        }else{
            setUser(null);
        }
    })
    return () =>{
      unsubscribe();
    }
  }, [user, username])
    useEffect(() => {
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()})))
      })
    }, []);
    const signUp = (event) => {
        event.preventDefault();
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message));
        setOpen(false);
    }
    const signIn = (event) =>{
        event.preventDefault();
        auth
        .signInWithEmailAndPassword(email,password)
        .catch((error) => alert(error.message));
        setopenSignIn(false);
    } 
  return (
    <div className="app">
           
    <Modal open={open} onClose={() => setOpen(false)} >
    <div style={modalStyle} className={classes.paper}> 
      <center>
      <img className='app__headerImage' style={{height:100, width:150}} src='https://i.kym-cdn.com/entries/icons/original/000/010/944/instagram.jpg' alt='yeah'/>
      </center>
      <form className='app_signup'>
      <Input placeholder='User Name' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type='submit' onClick={signUp}>Sign up</Button>
      </form>
    </div>
  </Modal>
  <Modal open={openSignIn} onClose={() => setopenSignIn(false)} >
    <div style={modalStyle} className={classes.paper}> 
      <center>
      <img className='app__headerImage' style={{height:100, width:150}} src='https://i.kym-cdn.com/entries/icons/original/000/010/944/instagram.jpg' alt='yeah'/>
      </center>
      <form className='app_signup'>
      <Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type='submit' onClick={signIn}>Sign In</Button>
      </form>
    </div>
  </Modal>
      <div className='app__header'>
        <img className='app__headerImage' style={{height:50, width:80}} src='https://i.kym-cdn.com/entries/icons/original/000/010/944/instagram.jpg' alt='yeah'/>
        {user ? (
        <Button onClick={() => auth.signOut()}>Sign Out</Button>
      ) :(
        <div className='app__loginContainer'>
          <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}
      </div>
      <h2>Vijay Choudhary's Instagram Clone</h2>
      <div className='app_posts'>  
      <div className='app__postsLeft'>
      {
         posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imgUrl={post.imgUrl} />
         ))
      } 
      </div>
      </div>
     
       {user?.displayName ? (<ImageUpload username={user.displayName} />) : (<h3>Sorry you need to login to Upload</h3>)}
       {signUp?.displayName ? (<ImageUpload username={user.displayName} />) : (<h3></h3>)}
       
          </div>
  );
}

export default App;
