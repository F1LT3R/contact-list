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

      .edit-contact {
        display: none
      }

      .edit-contact label {
        font-size: 14px; 
        margin: 2px 0;
        display:block;
      }

      .edit-contact input {
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

  deleteContact(event, index) {
    event.stopPropagation();
    store.dispatch({ type: actions.DELETE_CONTACT, index });
  }

  selectContact(event, index) {
    event.stopPropagation();
    store.dispatch({ type: actions.SELECT_CONTACT, index });
  }

  removeContactEvents() {
    this.$deleteButtons.forEach((button) => {
      button.removeEventListener('click', (event, index) => {
        this.deleteContact(event, index);
      });
    });

    this.$contactsAry.forEach((button) => {
      button.removeEventListener('click', (event, index) => {
        this.deleteContact(event, index);
      });
    });
  }

  attachContactEvents() {
    if (Reflect.has(this, '$deleteButtons')) {
      this.removeContactEvents();
    }

    this.$deleteButtons = this.shadowRoot.querySelectorAll('button.delete');
    this.$deleteButtons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        this.deleteContact(event, index);
      });
    });

    this.$contactsAry = this.shadowRoot.querySelectorAll('.contact');
    this.$contactsAry.forEach(($contact, index) => {
      $contact.addEventListener('click', (event) => {
        this.selectContact(event, index);
      });
    });
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
    event.preventDefault();
    event.stopPropagation();
    store.dispatch({ type: 'CANCEL_EDIT' });
  }

  newContact() {
    store.dispatch({ type: 'CREATE_NEW_CONTACT' });
  }

  renderSelectedContact({ selectedContact }) {
    if (!selectedContact) {
      this.$editContact.style.display = 'none';
      return;
    }
    this.$editContact.style.display = 'block';

    this.$firstNameInput.value = selectedContact.firstName;
    this.$lastNameInput.value = selectedContact.lastName;
    this.$emailInput.value = selectedContact.email;
    this.$phoneInput.value = selectedContact.phone;
  }

  renderCount({ contacts }) {
    this.$count.innerHTML = `Total contacts: ${contacts.length}`;
  }

  renderContacts({ contacts }) {
    this.$contacts.innerHTML = contacts
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

    this.attachContactEvents();
  }

  form() {
    return /*html*/ `
      <form class="edit-contact" action="none">
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

  renderTemplate({ contacts }) {
    return /*html*/ `
      <style>${this.style()}</style>

      <h1>Contact List</h1>
      
      <div class="controls">
        <button class="new">New Contact</button>
      </div>

      <div class="selected-contact">${this.form()}</div>

      <div class="contacts"></div>

      <div class="count"></div>
    `;
  }

  queryElements() {
    this.$count = this.shadowRoot.querySelector('.count');
    this.$contacts = this.shadowRoot.querySelector('.contacts');
    this.$newContactButton = this.shadowRoot.querySelector('button.new');
    this.$editContact = this.shadowRoot.querySelector('.edit-contact');
    this.$firstNameInput = this.shadowRoot.querySelector(
      'input[name=firstName]'
    );
    this.$lastNameInput = this.shadowRoot.querySelector('input[name=lastName]');
    this.$phoneInput = this.shadowRoot.querySelector('input[name=phone]');
    this.$emailInput = this.shadowRoot.querySelector('input[name=email]');
    this.$saveContactButton = this.shadowRoot.querySelector('button.save');
    this.$cancelEditButton = this.shadowRoot.querySelector('button.cancel');
  }

  attachEvents(root) {
    this.$firstNameInput.addEventListener('change', this.setFirstName);
    this.$lastNameInput.addEventListener('change', this.setLastName);
    this.$phoneInput.addEventListener('change', this.setPhone);
    this.$emailInput.addEventListener('change', this.setEmail);
    this.$saveContactButton.addEventListener('click', this.saveContact);
    this.$cancelEditButton.addEventListener('click', this.cancelEdit);
    this.$newContactButton.addEventListener('click', this.newContact);
  }

  disconnectedCallback() {
    this.$firstNameInput.removeEventListener('change', this.setFirstName);
    this.$lastNameInput.removeEventListener('change', this.setLastName);
    this.$phoneInput.removeEventListener('change', this.setPhone);
    this.$emailInput.removeEventListener('change', this.setEmail);
    this.$saveContactButton.removeEventListener('click', this.saveContact);
    this.$cancelEditButton.removeEventListener('click', this.cancelEdit);
    this.$newContactButton.removeEventListener('click', this.newContact);
    this.removeOldContactEventListeners();
  }

  render(state) {
    this.renderCount(state);
    this.renderContacts(state);
    this.renderSelectedContact(state);
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const initialState = store.getState();
    this.shadowRoot.innerHTML = this.renderTemplate(initialState);
    this.queryElements();
    this.render(initialState);
    this.attachEvents();

    store.subscribe(() => {
      const state = store.getState();
      this.renderCount(state);
      this.renderContacts(state);
      this.renderSelectedContact(state);
    });
  }
}

customElements.define('contact-list', ContactList);
