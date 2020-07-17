import store from './store';

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

      button.delete {
        background: #F20;
      }
      button.save {
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

  form({ firstName, lastName, email, phone } = {}) {
    return /*html*/ `<form class="edit-user" action="none">
        <label for="firstName">First Name </label>
        <input name="firstName" value="${firstName}" />

        <label for="lastName">Last Name</label>
        <input name="lastName" value="${lastName}" />
        
        <label for="email">Email</label>
        <input name="email" value="${email}" type="email" />
        
        <label for="phone">Phone</label> 
        <input name="phone" value="${phone}" type="phone" />

        <div class="controls">
          <button class="cancel">Cancel</button>
          <button class="save">Save</button>
        </div>
      </form>`;
  }

  template({ contacts, count }) {
    return /*html*/ `
      <style>${this.style()}</style>

      <h1>Contact List</h1>
      
      <div class="controls">
        <button class="new">New Contact</button>
      </div>

      <div class="selected-contact"></div>

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
        store.dispatch({ type: 'DELETE_CONTACT', index });
      })
    );

    const $contactsAry = this.shadowRoot.querySelectorAll('.contact');
    $contactsAry.forEach(($contact, index) =>
      $contact.addEventListener('click', (event) => {
        event.stopPropagation();
        store.dispatch({ type: 'SELECT_CONTACT', index });
      })
    );
  }

  updateSelectedContact({ selectedContact }) {
    if (!selectedContact) {
      this.$selectedContact.style.display = 'none';
      return;
    }

    this.$selectedContact.innerHTML = this.form(selectedContact);
    this.$selectedContact.style.display = 'block';

    this.shadowRoot
      .querySelector('button.save')
      .addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch({ type: 'SAVE_CONTACT' });
      });

    this.shadowRoot
      .querySelector('button.cancel')
      .addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch({ type: 'CANCEL_EDIT' });
      });

    this.shadowRoot
      .querySelector('input[name=firstName]')
      .addEventListener('change', (event) => {
        event.stopPropagation();
        store.dispatch({ type: 'SET_FIRSTNAME', value: event.target.value });
      });

    this.shadowRoot
      .querySelector('input[name=lastName]')
      .addEventListener('change', (event) => {
        event.stopPropagation();
        store.dispatch({ type: 'SET_LASTNAME', value: event.target.value });
      });

    this.shadowRoot
      .querySelector('input[name=phone]')
      .addEventListener('change', (event) => {
        event.stopPropagation();
        store.dispatch({ type: 'SET_PHONE', value: event.target.value });
      });

    this.shadowRoot
      .querySelector('input[name=email]')
      .addEventListener('change', (event) => {
        event.stopPropagation();
        store.dispatch({ type: 'SET_EMAIL', value: event.target.value });
      });
  }

  attachEvents(root) {
    this.$count = root.querySelector('.count');
    this.$contacts = root.querySelector('.contacts');
    this.$selectedContact = root.querySelector('.selected-contact');

    root.querySelector('button.new').addEventListener('click', () => {
      store.dispatch({ type: 'CREATE_NEW_CONTACT' });
    });

    store.subscribe(() => {
      const state = store.getState();
      this.updateCount(state.contacts.length);
      this.updateSelectedContact(state);
      this.updateContacts(state.contacts, store);
      this.$contactsAry = root.querySelectorAll('.contact');
    });
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const state = store.getState();
    this.shadowRoot.innerHTML = this.template(state);
    this.attachEvents(this.shadowRoot);
  }
}

customElements.define('contact-list', ContactList);
