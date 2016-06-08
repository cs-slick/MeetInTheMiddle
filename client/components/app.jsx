'use strict';
const React = require('react');
const ActivityChoice = require('./activityChoices.jsx');
const AddressForm = require('./addressForm.jsx');
const MapResults = require('./map.jsx');
const ResultList = require('./resultListItem.jsx');
const SignUp = require('./SignUp.jsx');
const UserLogin = require('./userLogin.jsx');
const $ = require('jquery');
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
const AddressBookContainer = require('./containers/AddressBookContainer.jsx')
const AddressFormsContainer = require('./containers/AddressFormsContainer.jsx');

var App = React.createClass({

  getInitialState: function () {
    return ({
      numberOfPeople: 2,
      travelData: [],
      categories:[],
      currentPage: 'signUpPage',
      resultsData: '',
      username: '',
      password: '',
      addAddress: {
        name: '',
        street: '',
        city: '',
        state: '',
      },
      sourceAddressArr: [],
      contacts: ['Add Custom Address'],
      friends: [],
    });
  },

  addForms: function () {
    let formArray = [];
    for (let i = 0; i < this.state.numberOfPeople; i++) {
      formArray.push(<AddressForm id={i} />);
    }
    return formArray;
  },

  addSingleForm: function (e) {
    e.preventDefault();
    const people = this.state.numberOfPeople + 1;
    this.setState({ numberOfPeople: people });
  },

  addActivities: function () {
    const activityTypes = ['Restaurants', 'Active Life', 'Nightlife', 'Arts', 'Shopping'];
    let activitiesArray = [];
    for (let i = 0, len = activityTypes.length; i < len; i++) {
      activitiesArray.push(<ActivityChoice
        activity={activityTypes[i]}
        key={i}
        grabCategories={this.grabCategories}
        />);
    }
    return activitiesArray;
  },
  submitInputData: function () {
    let addressFormData = {
      inputArray: this.state.sourceAddressArr,
      categories: this.state.categories,
     };
    const friends = [];
    for (let i = 0; i < addressFormData.inputArray.length; i++) {
      friends.push(addressFormData.inputArray[i].name)
    }
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/meet',
      data: addressFormData,
      success: function (response) {
        let result = response;
        this.setState({
          friends: friends,
          resultsData: result,
          currentPage: 'resultsPage',
        });
      }.bind(this),
      error: function(err) {
        console.log('error processing input data', err);
      }
    });
  },
  //userlogin for all these handlers below (3)
  handleSubmit: function(e) {
    e.preventDefault();
    //need to send username and password
    //and check database to see if it is in there
    var userDataObj = { userData: {
      username:this.state.username,
      password:this.state.password,
      }
    }

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/login',
      data: userDataObj,
      success: function (response) {
        //loop through array and access each objet at its property name 'name'
        // this.state.sourceAddressArr.concat(response);
        var responseArr = this.state.contacts.concat(response);
        console.log(responseArr)
        this.setState({
          currentPage: 'addressesPage',
          contacts: responseArr,
        });
      }.bind(this),
      error: function(err) {
        return alert('Wrong Info');
      }
    });
  },

  handleUserChange: function(e) {
    this.setState({username:e.target.value});
  },

  handlePasswordChange: function(e) {
    this.setState({password:e.target.value});
  },

  userData: function() {
    var firstNameId = 'form #firstName';
    var lastNameId = 'form #lastName';
    var usernameId = 'form #signup-username';
    var passwordId = 'form #signup-password';
    let userData = {};
    userData.firstname = $(firstNameId).val();
    userData.lastname = $(lastNameId).val();
    userData.username = $(usernameId).val();
    userData.password = $(passwordId).val();
    return userData;
  },

  signUpUser: function (e) {
    e.preventDefault();
    var userDataObj = { userData: this.userData() };

    if (userDataObj.userData.firstname === '' ||
    userDataObj.userData.lastname === '' ||
    userDataObj.userData.password === '' ||
    userDataObj.userData.username === '') {
      alert('Please fill out all fields ;)');
    }
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/createuser',
      data: userDataObj,
      success: function (response) {
        this.setState({
          currentPage: 'addressesPage',
        });
      }.bind(this),
      error: function(err) {
        return alert('Username already exists, please choose another one');
      }
    });
  },

  handleChangeAddName: function(e) {
    this.setState({
      addAddress: {
        name: e.target.value,
        street: this.state.addAddress.street,
        city: this.state.addAddress.city,
        state: this.state.addAddress.state,
      },
    });
  },
  handleChangeAddStreet: function(e) {
    this.setState({
      addAddress: {
        name: this.state.addAddress.name,
        street: e.target.value,
        city: this.state.addAddress.city,
        state: this.state.addAddress.state,
      },
    });
  },
  handleChangeAddCity: function(e) {
    this.setState({
      addAddress: {
        name: this.state.addAddress.name,
        street: this.state.addAddress.street,
        city: e.target.value,
        state: this.state.addAddress.state,
      },
    });
  },
  handleChangeAddState: function(e) {
    this.setState({
      addAddress: {
        name: this.state.addAddress.name,
        street: this.state.addAddress.street,
        city: this.state.addAddress.city,
        state: e.target.value,
      },
    });
  },
  handleContactNameClick: function(e) {
    e.preventDefault();
    var clickedName = e.target.innerHTML;
    //setstate for the source address
    for (let i = 0; i < this.state.contacts.length; i++) {
      //find the object with given name from e.targeet html
      for(var key in this.state.contacts[i]) {
        //append found object to source address THING!
        if (this.state.contacts[i][key] === clickedName) {
          const newSourceAddressArr = this.state.sourceAddressArr.slice();
          newSourceAddressArr.push(this.state.contacts[i]);
          this.setState({
            sourceAddressArr: newSourceAddressArr,
          });
          break;
        }
      }
    }
  },
  handleAddAddress: function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/addAddress',
      data: this.state.addAddress,
      success: function (response) {
        this.state.addAddress = {};
      }.bind(this),
      error: function(err) {
        console.log('error adding address to the database');
      },
    });
  },

  grabCategories: function(e) {
    if (e.target.checked){
      let statecopy = this.state.categories;
      statecopy.push(e.target.value);
      return this.setState({
        categories:statecopy
      });
    } else {
      let temp = this.state.categories,
      i = temp.indexOf(e.target.value);
      temp.splice(i, 1);
      return this.setState({
        categories:temp
      });
    }
  },

  findDistance: function(i) {
    const userCoords = [];
    for(let i = 0; i < this.state.friends.length; i++) {
      const temp = {};
      temp.longitude = this.state.resultsData.userCoords.longitudes[i];
      temp.latitude = this.state.resultsData.userCoords.latitudes[i];
      userCoords.push(temp);
    }
    const obj = {
      yelp_coord: this.state.resultsData.meetSuggestions[i].location.coordinate,
      user_coords: userCoords
    }
    this.findDistanceAjax(obj)
  },

  findDistanceAjax: function(object) {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/distance',
      data: object,
      success: function (response) {
        this.setState({
          travelData: response
        });
      }.bind(this),
      error: function(err) {
        console.log('something fucked up');
      }
    });
  },

  logout: function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/login',
      success: function () {
        this.setState({
          currentPage: 'signUpPage',
        });
      }.bind(this),
      error: function(err) {
        console.log('logout error: ', err);
      }
    });
  },
  handleAddressFormNameChange: function(i, e) {
    const newSourceAddressArr = this.state.sourceAddressArr.slice();
    newSourceAddressArr[i].name = e.target.value;
    this.setState({
      sourceAddressArr: newSourceAddressArr,
    });
  },
  handleAddressFormStreetChange: function(i, e) {
    const newSourceAddressArr = this.state.sourceAddressArr.slice();
    newSourceAddressArr[i].street = e.target.value;
    this.setState({
      sourceAddressArr: newSourceAddressArr,
    });
  },
  handleAddressFromCityChange: function(i, e) {
    const newSourceAddressArr = this.state.sourceAddressArr.slice();
    newSourceAddressArr[i].city = e.target.value;
    this.setState({
      sourceAddressArr: newSourceAddressArr,
    });
  },
  handleAddressFromStateChange: function(i, e) {
    const newSourceAddressArr = this.state.sourceAddressArr.slice();
    newSourceAddressArr[i].state = e.target.value;
    this.setState({
      sourceAddressArr: newSourceAddressArr,
    });
  },
  render: function () {
    if (this.state.currentPage === 'addressesPage') {
      return (
        <div>
          <h4>Source Addresses</h4>
          <AddressFormsContainer
            formValuesArr={this.state.sourceAddressArr}
            onNameChange={this.handleAddressFormNameChange}
            onStreetChange={this.handleAddressFormStreetChange}
            onCityChange={this.handleAddressFromCityChange}
            onStateChange={this.handleAddressFromStateChange}
            />
          <button className="button-primary" onClick={this.addSingleForm}>Add Address</button>
          <hr />
          <h4>Where do you want to meet?</h4>
          <div className="row">
            {this.addActivities()}
          </div>
          <button className="button-primary" onClick={this.submitInputData}>Meet in the middle!</button>

          <hr />
          <AddressBookContainer
            contactNames={this.state.contacts}
            handleContactNameClick={this.handleContactNameClick}
            handleAddAddress={this.handleAddAddress}
            handleChangeAddName={this.handleChangeAddName}
            handleChangeAddStreet={this.handleChangeAddStreet}
            handleChangeAddCity={this.handleChangeAddCity}
            handleChangeAddState={this.handleChangeAddState} />
          <button className='button-primary' onClick={this.logout}>Logout</button>
        </div>
      );
    }

    if (this.state.currentPage === 'resultsPage') {
      return (
        <div>
          <MapResults data={this.state.resultsData} />
          <ResultList
            data={this.state.resultsData}
            findDistance={this.findDistance}
            travelData={this.state.travelData}
            friends ={this.state.friends}
            />
        </div>
      );
    }

    if (this.state.currentPage === 'signUpPage') {
      return (
        <div>
          <UserLogin
            userValue={this.state.username}
            passwordValue ={this.state.password}
            handleSubmit={this.handleSubmit}
            handleUserChange={this.handleUserChange}
            handlePasswordChange={this.handlePasswordChange}
            />
          <SignUp onSubmit={this.signUpUser} />
        </div>
      );
    }
  },

});

module.exports = App;
