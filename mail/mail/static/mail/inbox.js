const inboxURL = '/emails/inbox'
const sentURL = '/emails/sent'
const archivedURL = '/emails/archived'

async function getInbox() {
  const response = await fetch(inboxURL);
  const data = await response.json();
  data.forEach(element => console.log(`${element.sender} | ${element.subject} -> ${element.timestamp}`));
}

async function getSent() {
  const response = await fetch(sentURL);
  const data = await response.json();
  console.log(typeof data);
  console.log(data);
  console.log(data[0]['sender']); //THIS CARALHO
  console.log(typeof data[0]);
  /*for (const element in data) {
    console.log(`${element.sender} | ${element.subject} -> ${element.timestamp}`);
  }
  /*for (let i = 0; i < data.length; i++) {
    element = data.getJSONObject(i);
    let li = document.createElement('li');
    li.innerHTML = `${element.sender} | ${element.subject} -> ${element.timestamp}`;
    document.querySelector('#container').append(li);
  }*/

}
async function getArchived() {
  const response = await fetch(archivedURL);
  const data = await response.json();
  data.forEach(element => console.log(`${element.sender} | ${element.subject} -> ${element.timestamp}`));
  
}


document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Load sent by default
  load_mailbox('sent')
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

// Submit email function
document.addEventListener('DOMContentLoaded', () => {

  // Upon click, submit email
  document.querySelector('#compose-form').onsubmit = function() {

    // Get values provided by user
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Transform into a json response
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });
  };
})



// Show inbox, sent and archived mailboxes
document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('#inbox').onclick = () => {
    getInbox();
    const element = document.createElement('div');
    element.innerHTML = getInbox();
  };
  
  document.querySelector('#sent').onclick = () => {
    getSent();
    const element = document.createElement('div');
    console.log(getSent())
  };

  document.querySelector('#archived').onclick = () => {
    getArchived();
  };


});



