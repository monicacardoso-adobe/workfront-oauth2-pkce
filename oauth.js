async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return hashBase64;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => characters[x % characters.length])
    .join('');
}

async function startOAuthFlow() {
  const clientId = '904cbf39b8fc23a1a7cbd6648dd09c10';
  const redirectUri = 'https://monicacardoso-adobe.github.io/workfront-oauth2-pkce/callback.html';

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Save for the token exchange later
  sessionStorage.setItem('code_verifier', codeVerifier);

  // Build URL
  const authUrl = `https://monicacardoso.my.workfront.com/oauth2/consent?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

  console.log("Redirecting to:", authUrl);
  window.location.href = authUrl;
}
