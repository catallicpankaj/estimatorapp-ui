import React, { useState } from 'react';
import './Home.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Header from '../Header';
import Paper from '@material-ui/core/Paper';
import Endpoint from '../../config/endpoint';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(3,3,3,5),
  },
  root: {
    width: '30%',
    minWidth: '630px'
  },
  paper: {
    padding: theme.spacing(3, 3),
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const [sessionId, setSessionId] = useState(0);
  const [name, setName] = useState('');

  const joinSession = () => {
    if(sessionStorage.getItem('sessionId')) {
      let url = `${Endpoint.apiUrl}cachedata/update-session?sessionKey=${sessionStorage.getItem('sessionId')}&newUserName=${name}`;
      fetch(url, {
        method: "PUT"
      })
      .then(response => {
        setSessionId(sessionStorage.getItem('sessionId'));
        sessionStorage.setItem('userName', name);
        props.history.push(`/${sessionStorage.getItem('sessionId')}`);
      });
    } else {
      let url = `${Endpoint.apiUrl}cachedata/create-session?initiatorName=${name}`;
      fetch(url, {
        method: "POST"
      })
      .then(response => response.json())
      .then(data => {
        const { sessionInitiatorData: { generatedUniqueKey } } = data;
        setSessionId(generatedUniqueKey);
        sessionStorage.setItem('userName', name);
        props.history.push(`/${generatedUniqueKey}`);
      });
    }
  }

  return (
    <div className={classes.root}>
      <Header />
      <Paper className={classes.paper}>
        <TextField
          id="name"
          label="Name"
          placeholder="Name"
          margin="normal"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Button  onClick={joinSession} className={classes.margin} variant="contained" color="primary">
          Join Session
        </Button>
      </Paper>
    </div>
  );
}

export default Home;
