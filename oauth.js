async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64UrlEncoded = btoa(String.fromCharCode.apply(null, hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64UrlEncoded;
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

  // Store the code verifier for token exchange
  sessionStorage.setItem('code_verifier', codeVerifier);

  // Generate the code challenge
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Construct the authorization URL
  const authUrl = `https://monicacardoso.my.workfront.adobe.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  // Redirect to Workfront for authentication
  window.location.href = authUrl;
}

// Start the flow when needed
startOAuthFlow();
