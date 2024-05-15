const tokenStorage = makeStorage('token');
(function bootstrap() {
  const authAPI = makeAuthAPI();
  const contentElement = document.getElementById('content');
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('code')) {
    return authAPI.getToken(urlParams.get('code')).then(getDog);
  }

  if (!authAPI.isAuthenticated()) {
    const loginBtn = document.createElement('button');
    loginBtn.innerText = 'Login';
    loginBtn.onclick = authAPI.login;
    return contentElement.appendChild(loginBtn);
  }

  getDog().catch(function () {
    tokenStorage.clear();
    window.location.reload();
  });

  function getDog() {
    return fetch(
      'https://knu2a2pvob.execute-api.ap-southeast-1.amazonaws.com/default/sp-login-dog-handler',
      { headers: { Authorization: `Bearer ${tokenStorage.get()}` } }
    )
      .then((res) => res.json())
      .then(function ({ url }) {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        contentElement.appendChild(imgElement);
      });
  }
})();

function makeStorage(key) {
  return {
    get: () => localStorage.getItem(key),
    set: (dto) => localStorage.setItem(key, dto),
    clear: () => localStorage.removeItem(key),
  };
}
function makeAuthAPI() {
  function isAuthenticated() {
    return !!tokenStorage.get();
  }

  function login() {
    const authenticationServerUrl = 'https://stg-id.singpass.gov.sg';
    const redirectURI = encodeURIComponent('https://sp-login.pages.dev');
    const nonce = '24d3f319-6531-4533-8fb2-9b3c93807fb7';
    const clientId = 'D8VwLbq8ifuHkja32nH5yPa079JAFjZH';
    window.location.href = `${authenticationServerUrl}/auth?scope=openid&response_type=code&redirect_uri=${redirectURI}&nonce=${nonce}&client_id=${clientId}&state=bXlTdGF0ZQ==`;
  }

  function getToken(code) {
    console.log(code);
    const resourceServerUrl =
      'https://knu2a2pvob.execute-api.ap-southeast-1.amazonaws.com/default/sp-login-auth-handler';
    return fetch(`${resourceServerUrl}?code=${code}`)
      .then((res) => res.json())
      .then(({ id_token }) => tokenStorage.set(id_token))
      .catch(console.error);
  }
  return { isAuthenticated, login, getToken };
}

function makeDogApi() {
  function getRandomDog() {}
  return { getRandomDog };
}

function authenticate() {
  // https://sp-login.pages.dev/?code=vBFZB_yFatLOjvwcQBZz38JOyc-7XFlBv8IDWlgexJo&state=bXlTdGF0ZQ%3D%3D
}
