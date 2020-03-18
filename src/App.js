import React from 'react';
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

var apiEndpoint = 'http://localhost:5000'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      onProfile: false,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      data: [],
      isSignedIn: false,
      userDetails: {}
    }
    //this.responseGoogle = this.responseGoogle.bind(this)
    //this.componentDidMount = this.componentDidMount.bind(this)
    //this.onSuccess = this.onSuccess.bind(this)
    //this.onSignIn = this.onSignIn.bind(this)
  }
  

  responseGoogleSuccess = (response) => {
    console.log("yeee")
    this.setState({userDetails: response.profileObj, isSignedIn: true});
    axios.post(apiEndpoint + '/users/' + this.state.userDetails.email,  {"first_name": this.state.userDetails.givenName, "last_name": this.state.userDetails.familyName})
      .then(res => {
        console.log(res.data);
        //this.setState({ persons });
      })
    
  };

  logout = () => {
    this.setState({isSignedIn: false, userDetails:{}})
  };

  handleSubmit = (event) => {
    console.log(this.state.userDetails)
    event.preventDefault();
  }

  checkSignedIn = () => {
    console.log("we in here", this.state.isSignedIn)
    if(!this.state.isSignedIn){
      return(
        <GoogleLogin
        clientId="1034011358451-901ird0jj5jnle85inpimfpba5epnaqv.apps.googleusercontent.com"
        render={renderProps => (
          <button
            className="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Log in with Google
          </button>
        )}
        onSuccess={this.responseGoogleSuccess}
        onFailure={this.responseGoogle}
      />
      )
    }else{
      console.log("we returning else")
      return(
        <div className="userDetails-wrapper">
        <div className="details-wrapper">
          <GoogleLogout
            render={renderProps => (
              <button
                className="logout-button"
                onClick={renderProps.onClick}
              >
                Log Out
              </button>
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

        <div>
          hi how are ya
          <form onClick={this.handleSubmit}>
            <input type="text" id="fname" name="fname"/>
            <input type="submit" value ="Submittaroon"/>
          </form>
        </div>


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
