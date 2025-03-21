// Function to generate a code verifier and challenge
function generatePKCE() {
    const code_verifier = generateRandomString(43); // Random string of at least 43 characters
    const code_challenge = generateCodeChallenge(code_verifier);
    return { code_verifier, code_challenge };
  }
  
  // Function to generate a random string
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }
  
  // Function to generate the code challenge (SHA-256 hash of the code_verifier)
  function generateCodeChallenge(code_verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    return crypto.subtle.digest('SHA-256', data).then(hash => {
      let base64Url = btoa(String.fromCharCode.apply(null, new Uint8Array(hash)));
      base64Url = base64Url.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return base64Url;
    });
  }
  
  // OAuth2 authorization URL
  const clientId = '904cbf39b8fc23a1a7cbd6648dd09c10'; // Replace with your client ID
  const redirectUri = 'https://monicacardoso.github.io/workfront-oauth2-pkce/callback.html'; // Set up GitHub Pages redirect URL
  const authEndpoint = 'https://monicacardoso.my.workfront.adobe.com/oauth2/authorize';
  const responseType = 'code';
  const codeChallengeMethod = 'S256';
  
  // Function to start the authorization flow
  function startAuthorization() {
    const { code_verifier, code_challenge } = generatePKCE();
    sessionStorage.setItem('code_verifier', code_verifier); // Save code_verifier for later use
  
    const authorizationUrl = `${authEndpoint}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${code_challenge}&code_challenge_method=${codeChallengeMethod}`;
    window.location.href = authorizationUrl;
  }
  
  document.getElementById('authorize-btn').addEventListener('click', startAuthorization);
  