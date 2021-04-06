const inboxURL = '/emails/inbox';
const sentURL = '/emails/sent';
const archivedURL = '/emails/archived'; 

// Get inbox json data 
async function getInbox() {
  const response = await fetch(inboxURL);
  const data = await response.json();

  // Show inbox mail data
  for (let i = 0; i < data.length; i++) {
    let anchor = document.createElement('a');
    let br = document.createElement('br');
    

    sender = data[i]['sender'];
    subject = data[i]['subject'];
    timestamp = data[i]['timestamp'];
    id = data[i]['id'];
    
    anchor.innerHTML = `${sender} | ${subject} -> ${timestamp}`;
    anchor.href = `/emails/${id}`;

    anchor.addEventListener('click', anchorClick);
    
    document.querySelector('#emails-view').append(anchor);
    document.querySelector('#emails-view').append(br);
    
    
  };
};
// Get sent mails json data 
async function getSent() {
  const response = await fetch(sentURL);
  const data = await response.json();

  // Show sent mail data
  for (let i = 0; i < data.length; i++) {
    let anchor = document.createElement('a');
    let br = document.createElement('br');
    
    sender = data[i]['sender'];
    subject = data[i]['subject'];
    timestamp = data[i]['timestamp'];
    id = data[i]['id'];
    
    anchor.innerHTML = `${sender} | ${subject} -> ${timestamp}`;
    anchor.href = `/emails/${id}`;
    anchor.className = 'sentAnchors';
    
    anchor.addEventListener('click', anchorClick);
    document.querySelector('#emails-view').append(anchor);
    document.querySelector('#emails-view').append(br);
  };
};

// Get archived mails json data 
async function getArchived() {
  const response = await fetch(inboxURL);
  const data = await response.json();

  for (let i = 0; i < data.length; i++)
  {
    if(data[i]['archived'] = true) {
      let anchor = document.createElement('a');
      let br = document.createElement('br');

      sender = data[i]['sender'];
      subject = data[i]['subject'];
      timestamp = data[i]['timestamp'];
      id = data[i]['id'];

      anchor.innerHTML = `${sender} | ${subject} -> ${timestamp}`;
      anchor.href = `/emails/${id}`;
      anchor.className = 'sentAnchors';

      anchor.addEventListener('click', anchorClick);
      document.querySelector('#emails-view').append(anchor);
      document.querySelector('#emails-view').append(br);
    }
  }
};

// On anchor click, show mail content
function anchorClick(e) {
  // Create instances of the following elements
  let div = document.createElement('div');
  let br = document.createElement('br');
  let hr = document.createElement('hr');
  let btn = document.createElement('button');

  // Customize div element
  div.style.height = '400px';

  // Customize button element
  btn.className = 'btn btn-sm btn-outline-primary';
  btn.style.padding = '3px 6px';
  btn.style.fontSize = '9px';
  btn.style.position = 'absolute';
  btn.style.top = '110px';
  btn.style.left = '770px';
  btn.innerHTML = 'Archive';

  // Append the empty div to the #email-view
  document.querySelector('#email-view').append(div);

  // Delete all previously opened emails from view
  div.className = 'mailContent';
  mailContent = document.querySelectorAll('.mailContent');
  mailContent.forEach(element => element.innerHTML = "");

  // Show email-view and prevent default behaviour
  view_email();
  e.preventDefault();

  // Get the href of this object
  let href = this.getAttribute('href');

  fetch(`${href}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    div.append(`${email['subject']} // `);
    div.append(`From: ${email['sender']}`);
    div.append(br)
    div.append(` To: ${email['recipients']}`);
    div.append(` // ${email['timestamp']}`);
    div.append(hr);
    div.append(`${email['body']}`);
    
    btn.addEventListener('click', function() {
      if (email['archived'] = false) {
        console.log(`${email['archived']} (1)`);
        fetch(`${href}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })
        console.log(`${email['archived']} (2)`);
      };

      if (email['archived'] = true) {
        console.log(`${href}`);
        console.log(`${email['archived']} (3)`);
        fetch(`${href}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        })
        console.log(`${email['archived']} (4)`);
      };
      console.log(`${email['archived']} (5)`);
    });
  });
  div.append(btn);
};

// Compose email function
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
};

function view_email() {
  //Show email and hide other views
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
};

// When dom is loaded, create click listeners
document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    getInbox();
    load_mailbox('inbox');
  });
  document.querySelector('#sent').addEventListener('click', () => {
    getSent();
    load_mailbox('sent');
  });
  document.querySelector('#archived').addEventListener('click', () => {
    getArchived();
    load_mailbox('archived');
  });
  document.querySelector('#compose').addEventListener('click', () => {
    compose_email();
  });
});

// Submit Email Function
document.addEventListener('DOMContentLoaded', () => {
  // Upon click, submit email
  document.querySelector('#compose-form').onsubmit = function() {
    // Get values provided by user
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    
    load_mailbox('sent');
    // Transform into json
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body,
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  };
});
