const login = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ziyad@islami.com', password: 'Ziyad@is1' })
    });
    const data = await loginRes.json();
    const token = data.token;
    console.log('Token logic success:', !!token);
    
    const allRes = await fetch('http://localhost:5000/api/articles/admin/all', {
        headers: { 'x-auth-token': token }
    });
    console.log('Status /admin/all:', allRes.status);
    const text = await allRes.text();
    console.log('Payload /admin/all:', text.substring(0, 200));
  } catch (e) {
    console.error(e);
  }
};
login();
