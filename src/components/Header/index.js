import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import headerIcon from '../../assets/estimate.jpg';
import Notes from '@material-ui/icons/Notes';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'inherit',
  },
  icon: {
    margin: theme.spacing(0,3,0,0),
  }
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Notes className={classes.icon} />
          <Typography variant="h4" className={classes.title}>
            Estimator
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;