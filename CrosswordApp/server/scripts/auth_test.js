
const API_URL = 'http://localhost:5001/auth';
const TEST_COUNT = 5;

async function testAuth() {
    console.log(`Starting Auth Test (${TEST_COUNT} iterations)...`);
    let successes = 0;
    let failures = 0;

    for (let i = 0; i < TEST_COUNT; i++) {
        const username = `testuser_${Date.now()}_${i}`;
        const email = `${username}@example.com`;
        const password = 'password123';

        try {
            // 1. Register
            const url = `${API_URL}/register`;
            console.log(`[Iter ${i+1}] Registering ${username} at ${url}...`);
            const regRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!regRes.ok) {
                const err = await regRes.text();
                throw new Error(`Register failed: ${regRes.status} ${err}`);
            }
            
            // 2. Login
            console.log(`[Iter ${i+1}] Logging in...`);
            const loginRes = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!loginRes.ok) {
                 const err = await loginRes.text();
                 throw new Error(`Login failed: ${loginRes.status} ${err}`);
            }

            const data = await loginRes.json();
            if (data.token) {
                console.log(`[Iter ${i+1}] Success! Token received.`);
                successes++;
            } else {
                console.error(`[Iter ${i+1}] Failed: No token returned.`);
                failures++;
            }
        } catch (error) {
            console.error(`[Iter ${i+1}] Error:`, error.message);
            failures++;
        }
        // Small delay
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n--- Auth Test Summary ---');
    console.log(`Total: ${TEST_COUNT}`);
    console.log(`Success: ${successes}`);
    console.log(`Failed: ${failures}`);
}

testAuth();
