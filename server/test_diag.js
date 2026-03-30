(async () => {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@islami.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Token acquired.');
        
        const articlesRes = await fetch('http://localhost:5000/api/articles?admin=true');
        const articlesObj = await articlesRes.json();
        console.log('Articles count:', articlesObj.length);
        if (articlesObj.length === 0) return console.log('No articles.');
        
        const id = articlesObj[0]._id;
        console.log('Testing ID:', id);
        
        const articleReq = await fetch(`http://localhost:5000/api/articles/${id}?admin=true`, {
            headers: { 'x-auth-token': token }
        });
        console.log('GET /:id status:', articleReq.status);
        const articleData = await articleReq.json();
        console.log('Title:', articleData.title);
        
        const toggleReq = await fetch(`http://localhost:5000/api/articles/${id}/toggle-visibility`, {
            method: 'PUT',
            headers: { 'x-auth-token': token }
        });
        console.log('PUT /toggle-visibility status:', toggleReq.status);
        const toggleData = await toggleReq.text();
        console.log('Toggle Data:', toggleData.substring(0, 100));

    } catch (e) {
        console.log('Script Error:', e.message);
    }
})();
