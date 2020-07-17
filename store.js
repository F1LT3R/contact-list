// define('todo-list', {});
import * as actions from './actionTypes';

const genId = () =>
  Array(16)
    .fill('')
    .map(() => String.fromCharCode(parseInt(Math.random() * 64) + 48))
    .join('');

/* eslint-disable no-undef */
const { createStore } = Redux;

const initialState = {
  contacts: [
    {
      firstName: 'Alistair',
      lastName: 'MacDonald',
      phone: '888-888-8888',
      email: 'nope@nope.com',
      id: '0'
    }
  ],
  selectedContact: null,
  selectedIndex: null
};

const UserModel = () => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  id: genId()
});

const validEmail = (email) => email && email.includes('@');
const validPhone = (phone) =>
  phone &&
  phone.split('').filter((n) => typeof Number(n) === 'number').length > 9;

function app(state = initialState, action) {
  const { selectedContact } = state;

  switch (action.type) {
    case actions.CREATE_NEW_CONTACT:
      return Object.assign({}, state, {
        selectedContact: { ...UserModel() },
        selectedIndex: state.contacts.length - 1
      });

    case actions.SET_FIRSTNAME:
      if (!selectedContact) {
        throw 'CREATE_NEW_CONTACT must be run before SET_FIRSTNAME';
      }
      return Object.assign({}, state, {
        selectedContact: { ...selectedContact, firstName: action.value }
      });

    case actions.SET_LASTNAME:
      if (!selectedContact) {
        throw 'CREATE_NEW_CONTACT must be run before SET_LASTNAME';
      }
      return Object.assign({}, state, {
        selectedContact: { ...selectedContact, lastName: action.value }
      });

    case actions.SET_PHONE:
      if (!selectedContact) {
        throw 'CREATE_NEW_CONTACT must be run before SET_PHONE';
      }
      if (!validPhone(action.value)) {
        throw 'Invalid phone number passed to SET_PHONE';
      }
      return Object.assign({}, state, {
        selectedContact: { ...selectedContact, phone: action.value }
      });

    case actions.SET_EMAIL:
      if (!selectedContact) {
        throw 'CREATE_NEW_CONTACT must be run before SET_EMAIL';
      }
      if (!validEmail(action.value)) {
        throw 'Invalid email passed to SET_EMAIL';
      }
      return Object.assign({}, state, {
        selectedContact: { ...selectedContact, email: action.value }
      });

    case actions.SAVE_CONTACT:
      if (!selectedContact) {
        throw 'Contact must be selected/edited before running SAVE_CONTACT';
      }
      const incomplete = Object.entries(selectedContact)
        .map(([prop, value]) => (value ? null : prop))
        .filter((entry) => !!entry);
      if (incomplete.length > 0) {
        throw `You must complete the [${incomplete}] fields before calling SAVE_CONTACT`;
      }
      const isNew = state.selectedIndex === state.contacts.length - 1;
      if (!isNew) {
        state.contacts[state.selectedIndex] = { ...selectedContact };
      }
      const newContacts = isNew
        ? [...state.contacts, { ...selectedContact }]
        : [...state.contacts];
      return Object.assign({}, state, {
        contacts: [...newContacts],
        selectedContact: null,
        selectedIndex: null
      });

    case actions.SELECT_CONTACT:
      if (!Reflect.has(action, 'index')) {
        throw 'Your SELECT_CONTACT action must have a valid Index';
      }
      return Object.assign({}, state, {
        selectedContact: { ...state.contacts[action.index] },
        selectedIndex: action.index
      });

    case actions.CANCEL_EDIT:
      if (state.selectedContact === null) {
        throw 'You must be editing a contact to CANCEL_EDIT';
      }
      return Object.assign({}, state, {
        selectedContact: null,
        selectedIndex: null
      });

    case actions.DELETE_CONTACT:
      if (
        !typeof action.index === 'number' ||
        action.index < 0 ||
        action.index >= state.contacts.length
      ) {
        throw 'You must select a valid contact index to DELETE_CONTACT';
      }
      return Object.assign({}, state, {
        contacts: [
          ...state.contacts.slice(0, action.index),
          ...state.contacts.slice(action.index + 1)
        ]
      });

    default:
      return state;
  }
}

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(app, reduxDevTools);

export default store;
