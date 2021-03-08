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
    console.log(anchor);

    sender = data[i]['sender'];
    subject = data[i]['subject'];
    timestamp = data[i]['timestamp'];
    id = data[i]['id'];

    anchor.innerHTML = `${sender} | ${subject} -> ${timestamp}`;
    anchor.href = `/emails/${id}`;

    document.querySelector('#emails-view').append(anchor);
    document.querySelector('#emails-view').append(br);
  };
  // Change color to gray if read = true
  if(data[i]['read'] === true) {
    div.style.backgroundColor = "#DCDCDC";
  }
  else {
    div.style.backgroundColor = "#FFFFFF";
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
// On anchor click, show mail content
function anchorClick(e) {
  let div = document.createElement('div');

  document.querySelector('#email-view').append(div);

  // Delete all previously opened emails from view
  mailContent = document.querySelectorAll('.mailContent');
  mailContent.forEach(element => element.innerHTML = "");
  
  div.className = 'mailContent';
  view_email();
  
  e.preventDefault();

  let href = this.getAttribute('href');

  fetch(`${href}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    div.append(`From: ${email['sender']}  To: ${email['recipients']} Subject: ${email['subject']} Timestamp: ${email['timestamp']}  ${email['body']}`);
  });
};


// Get archived mails json data 
async function getArchived() {
  const response = await fetch(archivedURL);
  const data = await response.json();

  // Show archived mail data
  for (let i = 0; i < data.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = `${data[i]['sender']} | ${data[i]['subject']} -> ${data[i]['timestamp']}`;
    document.querySelector('#emails-view').append(li);
  };
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
  console.log('composing...')
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
  
  console.log('viewing email...');
};

// When dom is loaded, create click listeners
document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    load_mailbox('inbox');
    getInbox();
  });
  document.querySelector('#sent').addEventListener('click', () => {
    load_mailbox('sent');
    getSent();
  });
  document.querySelector('#archived').addEventListener('click', () => {
    load_mailbox('archived');
    getArchived();
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
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  };
});
