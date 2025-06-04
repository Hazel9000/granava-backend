document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value
  };

  const responseDiv = document.getElementById('response');

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      responseDiv.innerText = result.message;
    } else {
      responseDiv.innerText = result.error || 'Registration failed';
    }
  } catch (err) {
    responseDiv.innerText = 'Network error';
  }
});