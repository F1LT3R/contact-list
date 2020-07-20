import store from './store.js';
import * as actions from './actionTypes.js';

class ContactList extends HTMLElement {
  constructor() {
    super();
  }

  style() {
    return /*css*/ `
      :host {
        width: 400px;
        display: block;
        float: left;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        font-family: 'Roboto';
        border-radius: 3px;
        padding: 16px;
        margin: 8px;
        font-size: 110%;
      }

      * {
        margin: 0;
        padding: 0;
      }

      form label {
        display:block; 
      }
      
      .contact  {
        border-radius: 4px;
        display: block;
        margin: 16px 0;
        padding: 16px;
        background: #EFEFEF;
        cursor: pointer;
      }

      .contact:hover {
        background: #08A;
        color: #fff;
      }

      .contact:hover a{
        color: #fff;
      }
      
      .name {
        font-weight: bold;
        font-size: 22px;
        margin: 8px 0;
      }
      
      .actions {
        margin-top: 16px;
      }

      button {
        padding: 12px 16px;
        margin-top: 8px 8px 16px 0;
        border-radius: 4px;
        background: #08A;
        font-size: 16px;
        color: white;
        cursor: pointer;
        border: none;
      }

      button:hover {
        background: #09C; 
      }

      button.delete {
        background: #D20;
      }
      
      button.delete:hover {
        background: #F20;
      }

      button.save {
        background: #180;
      }

      button.save:hover {
        background: #2A0;
      }
      
      .controls {
        margin: 16px 0;
      }

      .edit-user label {
        font-size: 14px; 
        margin: 2px 0;
        display:block;
      }

      .edit-user input {
        font-size: 18px;
        margin: 2px 0 12px 0;
        display:block;
        padding: 8px;
        width: 380px;
      }

      button {
        position: relative;
        top: 0px;
      }

      button:hover, button:focus {
        top: -1px;
        box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.25);
      }

      button:active {
        box-shadow: none;
      }

      @media (prefers-color-scheme: dark) {
        .contact  { 
          background: #222;
        }

        .contact a {
          color: #08A;
        }

        button {
          background: #048;
        }

        button.delete {
          background: #810;
        }

        button.save {
          background: #140;
        }

        .contact:hover {
          background: #048;
          color: #AAA;
        }

        .contact:hover a{
          color: #AAA;
        }

        input {
          background: #222;
          border: 1px solid #888;
          color: #AAA;
        }
      }
    `;
  }

  renderContacts(contacts) {
    return contacts
      .map((contact) => {
        return /*html*/ `<div class="contact">
          <div class="name">${contact.firstName} ${contact.lastName}</div>
          <div class="last-phone">
            <a href="tel:${contact.phone}">${contact.phone}</a>
          </div>
          <div class="last-email"><a href="mailto:${contact.email}">${contact.email}</a></div>
          <div class="actions">
            <button class="delete">Delete</button>
          </div>
    </div>`;
      })
      .join('');
  }

  form() {
    return /*html*/ `
      <form class="edit-user" action="none">
        <label for="firstName">First Name </label>
        <input name="firstName" />

        <label for="lastName">Last Name</label>
        <input name="lastName" />

        <label for="email">Email</label>
        <input name="email" type="email" />

        <label for="phone">Phone</label>
        <input name="phone" type="phone" />

        <div class="controls">
          <button class="cancel">Cancel</button>
          <button class="save">Save</button>
        </div>
      </form>
    `;
  }

  template({ contacts, count, selectedContact }) {
    return /*html*/ `
      <style>${this.style()}</style>

      <h1>Contact List</h1>
      
      <div class="controls">
        <button class="new">New Contact</button>
      </div>

      <div class="selected-contact">${this.form()}</div>

      <div class="contacts">
        ${contacts.length ? this.renderContacts(contacts) : ''}
      </div>      

      <div class="count">Total: ${count}</div>
    `;
  }

  updateCount(count) {
    this.$count.innerHTML = `Total contacts: ${count}`;
  }

  updateContacts(contacts, store) {
    this.$contacts.innerHTML = this.renderContacts(contacts);

    const $deleteButtons = this.shadowRoot.querySelectorAll('button.delete');
    $deleteButtons.forEach((button, index) =>
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        store.dispatch({ type: actions.DELETE_CONTACT, index });
      })
    );

    const $contactsAry = this.shadowRoot.querySelectorAll('.contact');
    $contactsAry.forEach(($contact, index) =>
      $contact.addEventListener('click', (event) => {
        event.stopPropagation();
        store.dispatch({ type: actions.SELECT_CONTACT, index });
      })
    );
  }

  setFirstName(event) {
    store.dispatch({ type: actions.SET_FIRSTNAME, value: event.target.value });
  }

  setLastName(event) {
    store.dispatch({ type: actions.SET_LASTNAME, value: event.target.value });
  }

  setPhone(event) {
    store.dispatch({ type: actions.SET_PHONE, value: event.target.value });
  }

  setEmail(event) {
    store.dispatch({ type: actions.SET_EMAIL, value: event.target.value });
  }

  saveContact(event) {
    event.preventDefault();
    event.stopPropagation();
    store.dispatch({ type: 'SAVE_CONTACT' });
  }

  cancelEdit(event) {
    console.log(this, event);
    event.preventDefault();
    event.stopPropagation();
    store.dispatch({ type: 'CANCEL_EDIT' });
  }

  newContact() {
    store.dispatch({ type: 'CREATE_NEW_CONTACT' });
  }

  updateSelectedContact({ selectedContact }) {
    if (!selectedContact) {
      this.$selectedContact.style.display = 'none';
      return;
    }
    this.$selectedContact.style.display = 'block';

    this.$firstNameInput.value = selectedContact.firstName;
    this.$lastNameInput.value = selectedContact.lastName;
    this.$emailInput.value = selectedContact.email;
    this.$phoneInput.value = selectedContact.phone;
  }

  queryElements(root) {
    this.$count = root.querySelector('.count');
    this.$contacts = root.querySelector('.contacts');
    this.$newContactButton = root.querySelector('button.new');
    this.$selectedContact = root.querySelector('.selected-contact');
    this.$firstNameInput = root.querySelector('input[name=firstName]');
    this.$lastNameInput = root.querySelector('input[name=lastName]');
    this.$phoneInput = root.querySelector('input[name=phone]');
    this.$emailInput = root.querySelector('input[name=email]');
    this.$saveContactButton = root.querySelector('button.save');
    this.$cancelEditButton = root.querySelector('button.cancel');
  }

  attachEvents(root) {
    this.$firstNameInput.addEventListener('change', this.setFirstName);
    this.$lastNameInput.addEventListener('change', this.setLastName);
    this.$phoneInput.addEventListener('change', this.setPhone);
    this.$emailInput.addEventListener('change', this.setEmail);
    this.$saveContactButton.addEventListener('click', this.saveContact);
    this.$cancelEditButton.addEventListener('click', this.cancelEdit);

    this.$newContactButton.addEventListener('click', this.newContact);

    store.subscribe(() => {
      const state = store.getState();
      this.updateCount(state.contacts.length);
      this.updateSelectedContact(state);
      this.updateContacts(state.contacts, store);
    });
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const state = store.getState();
    const root = this.shadowRoot;
    root.innerHTML = this.template(state);
    this.queryElements(root);
    this.attachEvents(root);
  }

  disconnectedCallback() {
    this.$firstNameInput.removeEventListener('change', this.setFirstName);
    this.$lastNameInput.removeEventListener('change', this.setLastName);
    this.$phoneInput.removeEventListener('change', this.setPhone);
    this.$emailInput.removeEventListener('change', this.setEmail);
    this.$saveContactButton.removeEventListener('click', this.saveContact);
    this.$cancelEditButton.removeEventListener('click', this.cancelEdit);

    this.$newContactButton.removeEventListener('click', this.newContact);
  }
}

customElements.define('contact-list', ContactList);
