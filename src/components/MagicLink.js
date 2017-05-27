import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { browserHistory } from 'react-router';

const API_DOMAIN = 'https://htctw-server.herokuapp.com/api';
const cookies = new Cookies();

class MagicLink extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const magicCode = this.props.params.magicCode;

    fetch(`${API_DOMAIN}/ml_exchange/?link=${magicCode}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json);
      if (json.ok) {
        const accessToken = json.access_token;
        cookies.set('accessToken', accessToken, { path: '/' });
        browserHistory.push('/group');
      } else {
        console.log(json);
      }
    });
  }
  render() {
    return (
      <div className="App">
        <p>Redirecting...</p>
      </div>
    );
  }
}

export default MagicLink;
