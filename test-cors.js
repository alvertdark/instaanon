const SESSION_ID = '30982216478%3A88uqRIEmWo7xAt%3A12%3AAYjcKlr1mWFz_3GzqwaIjnO2BO52a3v85dZxkKmZ-g';
const USER_ID = '30982216478';

async function testFetch() {
  const cookieString = `sessionid=${SESSION_ID}; ds_user_id=${USER_ID};`;
  const username = 'cristiano';
  const targetUrl = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  
  const headers = {
    'Cookie': cookieString,
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'X-IG-App-ID': '936619743392459',
  };

  const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, { headers });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 500));
}

testFetch();
