import React from 'react';
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import Button from 'react-bootstrap/Button';
import JournalEntryForm from './JournalEntryForm'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

var apiEndpoint = 'http://localhost:5000'

class App extends React.Component {
  constructor(props){
    super(props)
    const loggedIn = localStorage.getItem('isSignedIn') === 'true';
    const userDeets = loggedIn ? JSON.parse(localStorage.getItem('user')) : {}
    console.log("user shet", userDeets)
    console.log(loggedIn);
    this.state = {
      onProfile: false,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      data: [],
      isSignedIn: loggedIn,
      userDetails: userDeets
    }

    
    //this.responseGoogle = this.responseGoogle.bind(this)
    //this.componentDidMount = this.componentDidMount.bind(this)
    //this.onSuccess = this.onSuccess.bind(this)
    //this.onSignIn = this.onSignIn.bind(this)
  }

  componentDidMount = () => {

    //this.setState({isSignedIn: loggedIn, userDetails : userDeets})
  }
  

  responseGoogleSuccess = (response) => {
    console.log("yeee")
    this.setState({userDetails: response.profileObj, isSignedIn: true});
    axios.post(apiEndpoint + '/users/' + this.state.userDetails.email,  {"first_name": this.state.userDetails.givenName, "last_name": this.state.userDetails.familyName})
      .then(res => {
        console.log(res.data);
        //localStorage.setItem('isSignedIn', true);
        //localStorage.setItem('user', JSON.stringify(this.state.userDetails));
      })
  };

  logout = () => {
    //localStorage.setItem('isSignedIn', false);
    //localStorage.setItem('user', {});
    //localStorage.clear()
    console.log("yeee")
    this.setState({isSignedIn: false, userDetails:{}}, () => this.forceUpdate())
  };

  checkSignedIn = () => {
    console.log("we in here", this.state.isSignedIn)
    if(!this.state.isSignedIn){
      return(
        <div>
          <div>
            Please log in to use CBT.
          </div>
          <GoogleLogin
          clientId="1034011358451-901ird0jj5jnle85inpimfpba5epnaqv.apps.googleusercontent.com"
          render={renderProps => (

            <Button variant="outline-primary"
              className="button"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Log in with Google
            </Button>
          )}
          onSuccess={this.responseGoogleSuccess}
          onFailure={this.responseGoogle}
        />
        </div>
      )
    }else{
      console.log("we returning else")
      return(
        <div className="userDetails-wrapper">
        <div className="details-wrapper">
          <GoogleLogout
            render={renderProps => (
              <Button variant="outline-danger"
                className="logout-button"
                onClick={renderProps.onClick}
              >
                Log Out
              </Button>
            )}
            onLogoutSuccess={this.logout}
          />

          <div className="image">
            <img src={this.state.userDetails.imageUrl} />
          </div>
          <div className="name">
            Welcome {this.state.userDetails.givenName}{" "}
            {this.state.userDetails.familyName}
          </div>
          <div className="email"><i>{this.state.userDetails.email}</i></div>
        </div>
        <JournalEntryForm user = {this.state.userDetails}/>
        <div className="bar" />
        <div className="stand" />
      </div>
      )
    }
  }

  render(){
    return(
      <div className="App">
        {this.checkSignedIn()}
      </div>
    );
  }
}

export default App;
