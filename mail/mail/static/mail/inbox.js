const inboxURL = '/emails/inbox';
const sentURL = '/emails/sent';
const archiveURL = '/emails/archive'; 

// Get inbox json data
async function getInbox() {
  const response = await fetch(inboxURL);
  const data = await response.json();
  console.log(data);
  // show inbox mail data
  for (let i = 0; i < data.length; i++) {
    // instantiate elements
    let anchor = document.createElement('a');
    let br = document.createElement('br');

    sender = data[i]['sender'];
    subject = data[i]['subject'];
    timestamp = data[i]['timestamp'];
    id = data[i]['id'];
    read = data[i]['read'];

    if(read == true) {
      anchor.style.backgroundColor = '#D3D3D3';
    }
    else {
      anchor.style.backgroundColor = '#FFFFFF';
    };
    
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
  console.log(data);
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
    
    anchor.addEventListener('click', anchorClick);
    document.querySelector('#emails-view').append(anchor);
    document.querySelector('#emails-view').append(br);
  };
};

// Get archived mails json data 
async function getArchived() {
  const response = await fetch(archiveURL);
  const data = await response.json();
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    
    let anchor = document.createElement('a');
    let br = document.createElement('br');

    sender = data[i]['sender'];
    subject = data[i]['subject'];
    timestamp = data[i]['timestamp'];
    id = data[i]['id'];
    console.log(data[i]['archived']);

    anchor.innerHTML = `${sender} | ${subject} -> ${timestamp}`;
    anchor.href = `/emails/${id}`;

    anchor.addEventListener('click', anchorClick);
    document.querySelector('#emails-view').append(anchor);
    document.querySelector('#emails-view').append(br);
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

// reply 
function reply(sender, recipients, subject, body, timestamp) {
  // show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // clear composition fields
  document.querySelector('#compose-recipients').value = sender;
  document.querySelector('#compose-subject').value = `Re: ${subject}`;
  document.querySelector('#compose-body').value = `On ${timestamp}, ${sender} wrote: ${body}`;
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
  // show email and hide other views
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
};

// when dom is loaded create click listeners
document.addEventListener('DOMContentLoaded', function() {
  // toggle between views
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

// submit email function
document.addEventListener('DOMContentLoaded', () => {
  // upon click, submit email
  document.querySelector('#compose-form').onsubmit = function() {
    // get values provided by user
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    // load sent mail
    load_mailbox('sent');
    // transform into json
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body,
          read: false,
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  };
});

// on anchor click, show mail content
function anchorClick(e) {
  
  // mark as read
  let href = this.getAttribute('href');
  read_mail(href);
  // instantiate elements
  let div = document.createElement('div');
  let archiveBtn = document.createElement('button');
  let replyBtn = document.createElement('button');
  
  // customize following elements
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

  // delete all opened emails and append div to it
  document.querySelector('#email-view').innerHTML = "";
  document.querySelector('#email-view').append(div);

  // add content to email-view and show it
  append_content(href, div, archiveBtn, replyBtn);
  view_email();
  e.preventDefault();
};

async function append_content(href, div, button1, button2) {
  const response = await fetch(href);
  const data = await response.json();
  // instantiate
  let br = document.createElement('br');
  let hr = document.createElement('hr');

  let subject = data['subject'];
  let sender = data['sender'];
  let recipients = data['recipients'];
  let timestamp = data['timestamp'];
  let body = data['body'];
  let archived = data['archived'];

  div.append(`${subject} // `);
  div.append(`From: ${sender}`);
  div.append(br)
  div.append(` To: ${recipients}`);
  div.append(` // ${timestamp}`);
  div.append(hr);
  div.append(`${body}`);

  div.append(button1);
  div.append(button2);
  
  if (archived == true) {
    button1.innerHTML = 'Unarchive';
  }
  else {
    button1.innerHTML = 'Archive';
  };

  // archive event listener
  button1.addEventListener('click', () => {
    archive(href, button1);
  })
  // reply event listener
  button2.addEventListener('click', () => {
    reply(sender, recipients, subject, body, timestamp)
  });
};

// archive and unarchive put requests
async function archive(href, button){
  if(button.innerText == 'Archive'){
    // send put request
    const response = await fetch(href, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    });

    if(response.status == 204) {
      console.log('OK!')
    }
    else {
      console.log('ERROR')
    };

    getInbox();
    load_mailbox('inbox');
  }
  else {
    // switching
    const response = await fetch(href, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
    
    if(response.status == 204) {
      console.log('OK!');
    }
    else { 
      console.log('ERROR');
    };
    getInbox();
    load_mailbox('inbox');
  };
};

async function read_mail(href) {
  console.log('reading...');
  const response = await fetch(href, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
  if(response.status == 204) {
    console.log('OK!');
  }
  else { 
    console.log('ERROR');
  };
};
