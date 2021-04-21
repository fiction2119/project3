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

// on anchor click, show mail content
function anchorClick(e) {

  // get href of this object
  let href = this.getAttribute('href');

  // create instances of the following elements
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

  // Delete all previously opened emails from view and append div to it
  document.querySelector('#email-view').innerHTML = "";
  document.querySelector('#email-view').append(div);

  // add content to email-view and show it
  append_content(href, div, archiveBtn, replyBtn);
  view_email();
  e.preventDefault();

  /* fetch(`${href}`)
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
    
  });*/
};

async function append_content(href, div, button1, button2) {
  const response = await fetch(href);
  const data = await response.json();

  let br = document.createElement('br');
  let hr = document.createElement('hr');
  
  div.append(`${data['subject']} // `);
  div.append(`From: ${data['sender']}`);
  div.append(br)
  div.append(` To: ${data['recipients']}`);
  div.append(` // ${data['timestamp']}`);
  div.append(hr);
  div.append(`${data['body']}`);

  div.append(button1);
  div.append(button2);
  button1.id = 'archiveBtn';
console.log("data",data);

  if (data['archived'] == true) {
    button1.innerHTML = 'Unarchive';
    button1.addEventListener('click', function(){archiveOrUnarchive(href, button1);});
  }
  else {
    button1.innerHTML = 'Archive';
    button1.addEventListener('click', function(){archiveOrUnarchive(href, button1);});
  };
};

async function archive(href, button) {
  console.log('From unarchive to archive...')
  const response = await fetch(href, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  });
  console.log("status", response.status);
  
  if(response.status == 204)
  {
    button.innerText = "Unarchive";
    
  }
};

async function unarchive(href, button) {
  console.log('From archive to unarchive...')
  //disable
  const response = await fetch(href, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  });

  //.then -> enable mudava nome.
  console.log("status", response.status);
  if(response.status == 204)
  {
    button.innerText = "Archive";
  }
};

async function archiveOrUnarchive(href, button){
  if(button.innerText == "Archive"){
    console.log('From unarchive to archive...')
    const response = await fetch(href, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    });  
    if(response.status == 204)
    {
      button.innerText = "Unarchive";
    }
  }
  else
  {
    console.log('From archive to unarchive...')
    //disable ao butao -> button.disabled = true.
    const response = await fetch(href, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    });
    //.then -> enable mudar nome.
    if(response.status == 204)
    {
      button.innerText = "Archive";
    }
    //else -> mesagem erro, se quiseres
  }
}
