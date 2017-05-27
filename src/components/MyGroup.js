import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Cookies from 'universal-cookie';

import { Card } from 'material-ui';

import logo from './logo.png';
import './MyGroup.css';

const API_DOMAIN = 'https://htctw-server.herokuapp.com/api';
const cookies = new Cookies();

class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: '',
      members: []
    };
  }
  componentWillMount() {
    const accessToken = this.props.params.access_token;
    if (accessToken) {
      cookies.set('accessToken', accessToken, { path: '/' });
    }
    const storedAccessToken = cookies.get('accessToken');
    fetch(`${API_DOMAIN}/my_group/?access_token=${storedAccessToken}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json);
      if (json.ok) {
        this.setState({
          group: json.group,
          members: json.members,
        });
      } else {
        console.log(json);
      }
    });
  }
  render() {
    return (
      <div className="App">
        <div className="Group">
          <div>
            <h2>How to Change the World Group Finder</h2>
          </div>
          <div className="card-wrapper">
            <Card>
              <h1>{this.state.group}</h1>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn colSpan="3" tooltip="Group Members" style={{ textAlign: 'center' }}>
                      Group Members
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Course</TableHeaderColumn>
                    <TableHeaderColumn>Email</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.members.map(member => (
                    <TableRow>
                      <TableRowColumn>{member.name}</TableRowColumn>
                      <TableRowColumn>{member.course}</TableRowColumn>
                      <TableRowColumn>{member.email}</TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p>We'll email you when someone else joins the group</p>
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
      </div>
    );
  }
}

export default MyGroup;
