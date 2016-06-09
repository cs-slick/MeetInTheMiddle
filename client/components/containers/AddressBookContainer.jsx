import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import AddAddress from '../AddAddress.jsx';
import AddressBook from '../addressBook.jsx'

class AddressBookContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  handleOpenModal(e) {
    this.setState({
      isShowingModal: true,
    })
  }

  handleCloseModal(e) {
    this.setState({
      isShowingModal: false,
    });
  }

  handleAddAddress(e) {
    this.props.handleAddAddress(e);
    this.setState({
      isShowingModal: false,
    })
  }

  render() {
    return (
      <div>
        <div style={{display: 'inline-block'}}>
          <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <h4 style={{float: 'left'}}>Address Book</h4>
            <button className="button-primary" style={{marginLeft: '16px'}} onClick={this.handleOpenModal}>Add</button>
          </div>
          <br/>
          <AddressBook
            contactNames={this.props.contactNames}
            handleContactNameClick={this.props.handleContactNameClick} />
        </div>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={this.handleCloseModal}>
            <ModalDialog onClose={this.handleCloseModal}>
              <h1>Add New Address</h1>
              <AddAddress
                handleAddAddress={this.handleAddAddress}
                handleChangeAddName={this.props.handleChangeAddName}
                handleChangeAddStreet={this.props.handleChangeAddStreet}
                handleChangeAddCity={this.props.handleChangeAddCity}
                handleChangeAddState={this.props.handleChangeAddState} />
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    );
  }
}
module.exports = AddressBookContainer;
