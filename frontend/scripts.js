// Handle form submissions
document.addEventListener('DOMContentLoaded',() => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const ticketForm = document.getElementById('ticketForm');
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          console.log(response);
          const data = await response.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = data.redirectUrl;
          } else {
            alert("Login failed : user doesn't exist");
          }
        } catch (error) {
          console.error('Error logging in', error);
        }
      });
    }
  
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
          });
          const data = await response.json();
          if (response.status === 201) {
            alert('Signup successful. Please login.');
            window.location.href = '/login.html';
          } else {
            console.error('Signup failed');
          }
        } catch (error) {
          console.error('Error signing up', error);
        }
      });
    }
  
    if (ticketForm) {
      ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const token = localStorage.getItem('token');
        try {
          const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({ title, description })
          });
          const data = await response.json();
          if (response.status === 201) {
            alert('Ticket created successfully.');
            window.location.href = '/view-tickets.html';
          } else {
            console.error('Ticket creation failed');
          }
        } catch (error) {
          console.error('Error creating ticket', error);
        }
      });
    }
    // Load tickets on employee-tickets.html
    if (window.location.pathname === '/employee-tickets.html') {
        const token = localStorage.getItem('token');
        if (!token) {
        alert('Please login first.');
        window.location.href = '/login.html';
        }
    
        async function displayTicket() {
        try {

            const response = await fetch('/api/tickets', {
            headers: {
               'Authorization': token
            }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tickets.');
            }
            
            const tickets = await response.json();
            
    
            const ticketListElement = document.getElementById('tickets-list');
            ticketListElement.innerHTML = '';
    
            tickets.forEach(ticket => {
              const ticketHTML = `
                <div class="bg-white p-4 rounded shadow-md">
                <h3 class="text-lg font-bold">${ticket.customer_id}</h3>
                <h3 class="text-lg font-bold">${ticket.title}</h3>
                <p class="text-gray-700">${ticket.description}</p>
                <p class="text-gray-700">Status: ${ticket.status}</p>
                ${ticket.answer ? `<p class="text-gray-700">Answer: ${ticket.answer}</p>` : ''}
                ${ticket.status === 'Open' ? `
                    <textarea id="answer-${ticket.id}" class="w-full px-3 py-2 border rounded mb-4" placeholder="Write your answer"></textarea>
                    <button onclick="answerTicket(${ticket.id})" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Answer</button>
                ` : ''}
                </div>
            `;
            ticketListElement.innerHTML += ticketHTML;
            });
        } catch (error) {
            console.error('Error displaying tickets:', error);
        }
        }
    
        window.answerTicket = async function(ticketId) {
        const answer = document.getElementById(`answer-${ticketId}`).value;
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch('/api/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ id: ticketId, answer })
            });
    
            if (response.ok) {
            
            displayTicket();
            } else {
            console.error('Error answering ticket.');
            }
        } catch (error) {
            console.error('Error answering ticket:', error);
        }
        };
    
        displayTicket();
    }

    
    // Load tickets on view-tickets.html
    if (window.location.pathname === '/view-tickets.html') {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('Please login first.');
          window.location.href = '/login.html';
      }

      async function displayTickets() {
          try {
              const response = await fetch('/api/employee', {
                  headers: {
                      'Authorization': token
                  }
              });
              if (!response.ok) {
                  throw new Error('Failed to fetch tickets.');
              }
              const tickets = await response.json();

              // Get the ticket list element
              const ticketListElement = document.getElementById('tickets-List');

              // Clear previous tickets
              ticketListElement.innerHTML = '';

              // Display each ticket in the list
              tickets.forEach(ticket => {
                  const ticketHTML = `
                      <div class="bg-white p-4 rounded shadow-md">
                          <h3 class="text-lg font-bold">${ticket.username}</h3>
                          <h3 class="text-lg font-bold">${ticket.title}</h3>
                          <p class="text-gray-700">${ticket.description}</p>
                          <p class="text-gray-700">Status: ${ticket.status}</p>
                      </div>
                  `;
                  ticketListElement.innerHTML += ticketHTML;
              });
          } catch (error) {
              console.error('Error displaying tickets:', error);
          }
      }

      // Initial display of tickets when the page loads
      displayTickets();
  }

  
});
  