import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Header from '../Header';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Endpoint from '../../config/endpoint';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import rightTick from '../../assets/right-tick.png';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(6,3,0,0),
  },
  root: {
    width: '35%',
    minWidth: '630px'
  },
  paper: {
    padding: theme.spacing(3, 3),
  },
  table: {
    minWidth: 350,
    margin: theme.spacing(6,3,0,0),
  },
  header: {
    backgroundColor: '#838ec4',
  },
  cell: {
    color: 'white',
  },
  color: {
    color: '#5f668c',
    fontFamily: 'inherit',
  },
  statistic: {
    color: '#5f668c',
    fontFamily: 'inherit',
    margin: theme.spacing(1),
  }
}));

let tshirtSizeCount = {};

const Dashboard = (props) => {
  const classes = useStyles();
  const { match: { params: { sessionId }} } = props;
  const [ list, setList ] = useState([]);
  const [ showVotes, setShowVotes ] = useState(false);
  const [ clearVotes, setClearVotes ] = useState(false);
  const [ isInitiator, setIsInitiator ] = useState(false);
  const [ estimateValue, setEstimateValue ] = useState('');
  const tshirtSize = ['XS', 'S', 'M', 'L', 'XL',];

  useEffect(() => {
    sessionStorage.setItem('sessionId', sessionId);
    if(!sessionStorage.getItem('userName')) {
      props.history.push('/');
    }

    setInterval(async () => {
      const url = `${Endpoint.apiUrl}cachedata/read?key=${sessionId}&cacheName=initiatorCache`;
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setList(data);
        setInitiator(data);
      });
    }, 1000);
  }, [estimateValue, isInitiator, showVotes, clearVotes]);

  const updateEstimation = (value) => {
    const userId = sessionStorage.getItem('userId');
    const url = `${Endpoint.apiUrl}cachedata/update-vote?sessionKey=${sessionId}&uuid=${userId}&votedValue=${value}`;
    fetch(url, {
      method: "PUT"
    })
    .then(response => {
      setEstimateValue(value);
      console.log('Response: ', response);
    });
  }

  const clearVotesFunc = () => {
    const url = `${Endpoint.apiUrl}cachedata/clear-votes?sessionKey=${sessionId}`;
    fetch(url, {
      method: "PUT"
    })
    .then(response => {
      console.log('response:', response);
      setClearVotes(true);
    });
  }

  const showVotesFunc = () => {
    const url = `${Endpoint.apiUrl}cachedata/show-vote?sessionKey=${sessionId}`;
    fetch(url, {
      method: "PUT"
    })
    .then(response => {
      console.log('response:', response);
      setShowVotes(true);
    });
  }

  const setInitiator = (data) => {
    tshirtSizeCount = {
      'XS': 0,
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0
    };
    data.length > 0 && data.map((row, key) => {
      const userId = Object.keys(row)[0];
      if(row[userId].userName === sessionStorage.getItem('userName')) {
        sessionStorage.setItem('userId', userId);
        let isTrueSet = (row[userId].isInitiator == 'true');
        sessionStorage.setItem('userId', userId);
        setIsInitiator(isTrueSet);
      }
      if(row[userId].votedAs !== "") {
        tshirtSizeCount[row[userId].votedAs]++; 
      }
    });
  }

  return (
    <div className={classes.root}>
      <Header />
      <Paper className={classes.paper}>
        <Typography className={classes.color} variant="h5" component="h3">
          Hello { sessionStorage.getItem('userName') }
        </Typography>
        <Typography className={classes.color} variant="h6" component="h3">
          Session ID: <b>{ sessionId }</b>
        </Typography>
        
        {
          isInitiator && 
            <div>
              <Button onClick={clearVotesFunc} className={classes.margin} variant="outlined" color="primary">
              Clear Votes
              </Button>
              <Button onClick={showVotesFunc} className={classes.margin} variant="outlined" color="primary">
                Show Votes
              </Button>
            </div>
        }
          
          <div>
            {
              tshirtSize.map((value, key) => (
                <Button size="small" key={key} onClick={ () => updateEstimation(value)} className={classes.margin} variant="outlined" color="primary">
                  {value}
                </Button>
              ))
            }
          </div>
        <Paper>  
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.header}>
                <TableCell className={classes.cell}>Employee</TableCell>
                <TableCell className={classes.cell} align="center">Estimation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                list.length > 0 && list.map((row, key) => {
                  const userId = Object.keys(row)[0];
                  let currentUser;
                  if(row[userId].userName === sessionStorage.getItem('userName')) {
                    currentUser = true;
                  } else {
                    currentUser = false;
                  }
                  return (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {row[userId].userName}
                      </TableCell>
                      <TableCell align="center">
                        {
                          currentUser? 
                            row[userId].votedAs ?
                              row[userId].votedAs 
                            : 
                              'Not Voted' 
                          :
                          row[userId].showVotes === 'true' ?   
                            row[userId].votedAs ?
                              row[userId].votedAs 
                            : 
                              'Not Voted'
                          :
                            row[userId].votedAs ?
                              <img src={rightTick} width="30px" />
                            : 
                              'Hidden'
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
              </TableBody>
            </Table>
          </Paper>
          {
            list.length > 0 && list[0][Object.keys(list[0])[0]]['showVotes'] === 'true' &&
            <Paper>
              <Table className={classes.table}>
                <TableHead>
                  <Typography className={classes.statistic} variant="h5" component="h3">
                    Statistic
                  </Typography>
                  <TableRow className={classes.header}>
                    <TableCell className={classes.cell}>Size</TableCell>
                    <TableCell className={classes.cell} align="center">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    Object.keys(tshirtSizeCount).map(key => {
                      return (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">{key}</TableCell>
                          <TableCell align="center">{tshirtSizeCount[key]}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </Paper>
          }
      </Paper>
    </div>
  );
}

export default Dashboard;
