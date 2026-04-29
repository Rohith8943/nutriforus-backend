const axios = require('axios');

async function testForgot() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email: 'admin@nutriforus.com' });
    console.log(res.data);
  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}

testForgot();
