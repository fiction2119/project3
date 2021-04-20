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
    };
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
};

// Reply email function
function reply_email(recipients, subject, body, timestamp) {
  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = `Re: ${subject}`;
  document.querySelector('#compose-body').value = `On ${timestamp}, ${recipients} wrote: ${body}`;
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

// On anchor click, show mail content
function anchorClick(e) {

  // Get href of this object
  let href = this.getAttribute('href');

  // Create instances of the following elements
  let div = document.createElement('div');
  let br = document.createElement('br');
  let hr = document.createElement('hr');
  let archiveBtn = document.createElement('button');
  let replyBtn = document.createElement('button');

  // Customize the following elements
  customize(div, archiveBtn, replyBtn);

  // Delete all previously opened emails from view and append div to it
  document.querySelector('#email-view').innerHTML = "";
  document.querySelector('#email-view').append(div);

  // Show email-view and prevent default behaviour
  view_email();
  e.preventDefault();

  fetch(`${href}`)
  .then(response => response.json())
  .then(email => {
    // Append to div the content below
    div.append(`${email['subject']} // `);
    div.append(`From: ${email['sender']}`);
    div.append(br)
    div.append(` To: ${email['recipients']}`);
    div.append(` // ${email['timestamp']}`);
    div.append(hr);
    div.append(`${email['body']}`);
    div.append(archiveBtn);
    div.append(replyBtn);
    
    return email;
    
  })
  .then(email => {
    replyBtn.addEventListener('click', () => {
      reply_email(email['recipients'], email['subject'], email['body']), String(email['timestamp']);
    });
    return email;
  })
  .then(email => {
    if (email['archived'] == true) {
      archiveBtn.innerHTML = 'Unarchive';
      archiveBtn.addEventListener('click', unarchive(href));
    }
    else {
      archiveBtn.innerHTML = 'Archive';
      archiveBtn.addEventListener('click', archive(href));
    };
  });
};

function archive(href) {
  console.log('From unarchive to archive....');
  fetch(`${href}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  });
};

function unarchive(href) {
  console.log('From archive to unarchive....');
  fetch(`${href}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  });
};

// Customize the following elements
function customize(div, archiveBtn, replyBtn) {

  // div
  div.style.height = '400px';

  // archiveBtn
  archiveBtn.className = 'btn btn-sm btn-outline-primary';
  archiveBtn.style.padding = '3px 6px';
  archiveBtn.style.fontSize = '9px';
  archiveBtn.style.position = 'absolute';
  archiveBtn.style.top = '110px';
  archiveBtn.style.left = '770px';

  // replyBtn
  replyBtn.className = 'btn btn-sm btn-outline-primary';
  replyBtn.style.padding = '3px 6px';
  replyBtn.style.fontSize = '9px';
  replyBtn.style.position = 'absolute';
  replyBtn.style.top = '135px';
  replyBtn.style.left = '770px';
  replyBtn.innerHTML = 'Reply';
};

