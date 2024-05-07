const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  console.log('Submitting login request...');
  console.log('Username:', username);

  try {
    const response = await fetch('login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    console.log('Login successful');
    window.location.href = '../index.html'; // Redirect to main interface if login is successful
  } catch (error) {
    console.error('Error during login:', error);
    alert('Failed to login. Please try again.');
  }
});
