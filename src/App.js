import React, { Component } from 'react';
import { Card, TextField, SelectField, MenuItem, RaisedButton, Snackbar } from 'material-ui';
import Cookies from 'universal-cookie';
import { browserHistory } from 'react-router';

import logo from './logo.svg';
import './App.css';

const API_DOMAIN = 'http://localhost:8000/api';
const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      name: '',
      email: '',
      course: '',
      theme: '',
      groupNumber: '',
      checkEmail: false,
      error: false,
      errorMessage: '',
    };
  }

  componentWillMount() {
    const accessToken = cookies.get('accessToken');
    if (accessToken) {
      browserHistory.push('/group');
    }
  }

  onSubmit() {
    const params = {
      name: this.state.name,
      course: this.state.course,
      email: this.state.email,
      theme: this.state.theme,
      group_number: this.state.groupNumber,
    };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
    fetch(`${API_DOMAIN}/signup/?${query}`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json);
      if (json.ok) {
        this.setState({
          checkEmail: true,
        });
      } else {
        this.setState({
          error: true,
          errorMessage: json.error,
        });
      }
    });
  }

  handlSnackBarDisappear = () => {
    this.setState({
      error: false,
    });
  };
  render() {
    return (
      <div className="App">
        <div>
          <h2>How to Change the World Group Finder</h2>
        </div>
        <div className="card-wrapper">
          {this.state.checkEmail ?
            <p>Check your inbox to verify your email and see who's in your group ✉️</p> :
            <div className="form">
              <Card>
                <h3>Sign up</h3>
                <TextField
                  floatingLabelText="Full Name"
                  value={this.state.name}
                  onChange={(event) => { this.setState({ name: event.target.value }); }}
                />
                <TextField
                  hintText="zcabxxx@ucl.ac.uk"
                  floatingLabelText="UCL email address"
                  value={this.state.email}
                  onChange={(event) => { this.setState({ email: event.target.value }); }}
                />
                <TextField
                  hintText="Mechanical Engineering"
                  floatingLabelText="Course"
                  value={this.state.course}
                  onChange={(event) => { this.setState({ course: event.target.value }); }}
                />
                <SelectField
                  floatingLabelText="Theme"
                  value={this.state.theme}
                  onChange={(event, index, value) => { this.setState({ theme: value }); }}
                  style={{ textAlign: 'left' }}
                >
                  <MenuItem value={'Water 1'} primaryText="Water 1" />
                  <MenuItem value={'Water 2'} primaryText="Water 2" />
                  <MenuItem value={'Materials 1'} primaryText="Materials 1" />
                  <MenuItem value={'Materials 2'} primaryText="Materials 2" />
                  <MenuItem value={'Energy 1'} primaryText="Energy 1" />
                  <MenuItem value={'Energy 2'} primaryText="Energy 2" />
                  <MenuItem value={'Smart Cities 1'} primaryText="Smart Cities 1" />
                  <MenuItem value={'Smart Cities 2'} primaryText="Smart Cities 2" />
                  <MenuItem value={'Transport 1'} primaryText="Transport 1" />
                  <MenuItem value={'Transport 2'} primaryText="Transport 2" />
                </SelectField>
                <TextField
                  hintText="5"
                  floatingLabelText="Group Number"
                  value={this.state.groupNumber}
                  onChange={(event) => { this.setState({ groupNumber: event.target.value }); }}
                />
                <RaisedButton label="Sign Up" primary onTouchTap={this.onSubmit} style={{ margin: '20px 0' }} />
                <Snackbar
                  open={this.state.error}
                  message={this.state.errorMessage}
                  autoHideDuration={4000}
                  onRequestClose={this.handlSnackBarDisappear}
                />
              </Card>
            </div>
          }
        </div>
        <div className="card-wrapper">
          <Card>
            <h3>How it works</h3>
            <p>
              You sign up using the group theme and number that were sent to you, and we'll email you when someone else joins your group. You'll be able to start talking to your team before How To Change the World officially kicks off on Tuesday 🎉
            </p>
          </Card>
        </div>
        <div className="card-wrapper">
            <Card>
              <h3>UCL API</h3>
              <p>
                If you haven't yet, check out UCL API.
              </p>
              <a href="https://uclapi.com">
                <img src={logo} alt="UCL API logo" />
              </a>
            </Card>
        </div>
      </div>
    );
  }
}

export default App;
