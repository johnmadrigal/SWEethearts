import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Row, Button, Card } from 'react-bootstrap';
import Spinner from '../components/Spinner';
import '../styles/user-profile.scss';

const Profile = (props) => {
  /*
   * Possible Props:
   * creatorUsername (possibly) passed in from IdeaPage
   * authStatus always passed in from App
   */
  console.log(props);
  const { ideaCreator, authStatus } = props;

  // Destructure currently authenticated user's username from authStatus
  const { username } = authStatus;
  const creatorName = username;
  // Accessing Profile from Idea Page?
  if (ideaCreator) {
    console.log('idea creator is : ', ideaCreator);
    // If logged-in user is _not_ clicking on their own profile picture,
    // RESET name-to-display to that of the User being clicked by logged-in User
    if (loggedInUsername !== ideaCreator) {
      creatorName = ideaCreator;
    }
  }
  // Set up user data to display on Profile
  const [userData, setUserData] = useState({});

  // componentDidMount() functional equivalent
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    // Get all existing user data, sending username as a parameter
    const res = await fetch(`/api/profile/${creatorName}`);
    // console.log('res', res);
    // Expect in response an object with all User table column properties
    const userTableData = await res.json();
    console.log('UTD', userTableData);
    setUserData(userTableData);
  };

  /* 
   * PROFILE COMPONENT USER FLOW:

   *   Case 1: Viewing your own profile (READ and WRITE)
   *       On first render, display all data in this DB row (distinguished by `username`)
   *       
   *       If current User clicks edit, then submit:
   *         1a. Send all data stored from initial GET request
   *         1b. Except for the modified fields, whose values will be set to User input
   * 
   *   Case 2: Viewing another User's profile (whether or not you're a registered user)
   *     Same page without edit button functionality (READ-ONLY)
  */

  if (!Object.keys(userData).length) {
    return <Spinner />;
  }
  if (userData.err) {
    return <Container>Could not load user</Container>;
  }

  return (
    <Container id="userProfileContainer">
      <Row className="mb-4" id="row1">
        <Card className="m-3" id="card" style={{ width: '20rem' }}>
          <Card.Img src={userData.profilepic} variant="top" />
          <Card.Body>
            <Card.Title>{username}</Card.Title>
            <Card.Text style={{ fontWeight: 300 }}>First Name: {userData.firstname}</Card.Text>
            <Card.Text style={{ fontWeight: 300 }}>Last Name: {userData.lastname}</Card.Text>
            <Card.Text style={{ fontWeight: 300 }}>About: {userData.about}</Card.Text>
            <Card.Text style={{ fontWeight: 300 }}>Github: {userData.githubhandle}</Card.Text>
            <Card.Text style={{ fontWeight: 300 }}>LinkedIn: {userData.linkedin}</Card.Text>
            <Card.Text style={{ fontWeight: 300 }}>
              Personal Page: {userData.personalpage}
            </Card.Text>
          </Card.Body>
        </Card>
        <h3>{creatorName}'s Developer Profile</h3>
        <img
          alt="profile pic"
          id="profilePic"
          src="https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-hi.png"
        />
      </Row>
      <Link to="/editprofile">Edit Profile</Link>
      <Row id="row2">
        <Col className="cardHeader" id="bioCard">
          Bio
        </Col>
        <Col className="cardHeader ml-5" id="contactInfoCard">
          Where else can your future teammates contact you?
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
