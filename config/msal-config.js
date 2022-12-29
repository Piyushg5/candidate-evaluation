module.exports = {
  auth: {
    clientId: '811ba117-edae-4f84-a037-6bfa036c7a2a',
    authority: 'https://login.microsoftonline.com/intelliswift.com',
    redirectUri: '/',
    postLogoutRedirectUri: '/login',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  }
};
