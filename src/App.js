import React from 'react';
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import logo from './logo.svg';
import './App.css';

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

  responseGoogle = (response) => {
    console.log("yeee")
    this.setState({ userDetails: response.profileObj, isSignedIn: true });
  };

  logout = () => {
    this.setState({isSignedIn: false, userDetails:{}})
  };

  
  render(){
    return(
      <div className="App">
        {!this.state.isSignedIn && (
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
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        )}
        {this.state.isSignedIn && (
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
                Welcome Mr. {this.state.userDetails.givenName}{" "}
                {this.state.userDetails.familyName}
              </div>
              <div className="email"><i>{this.state.userDetails.email}</i></div>
            </div>
            <div className="bar" />
            <div className="stand" />
          </div>
        )}
      </div>
    );
  }
}

export default App;
