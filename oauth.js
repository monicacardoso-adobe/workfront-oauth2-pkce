async function generateCodeChallenge() {
  const codeVerifier = generateRandomString(64);
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const codeChallenge = btoa(String.fromCharCode.apply(null, hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  sessionStorage.setItem('code_verifier', codeVerifier);
  return codeChallenge;
}

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => possible[x % possible.length])
    .join('');
}

async function startOAuthFlow() {
  const codeChallenge = await generateCodeChallenge();
  
  const clientId = '904cbf39b8fc23a1a7cbd6648dd09c10';
  const redirectUri = 'https://monicacardoso-adobe.github.io/workfront-oauth2-pkce/callback.html';
  
  const authUrl = `https://monicacardoso.my.workfront.adobe.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.location.href = authUrl;
}
