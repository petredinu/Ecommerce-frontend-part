export default {
  auth: {
    domain: "dev-li55ssrce5r8p0im.eu.auth0.com",
    clientId: "j6kUcSQidBs1diUiqgIwrzHc4cX8oasa",
    authorizationParams: {
      redirect_uri: "http://localhost:4200",
      audience: "http://localhost:8080",
    },
    
  },
  oidc: {
        clientId: '0oa9pyr2oqvxYjZ6Q5d7',
        issuer: 'https://dev-12345678.okta.com/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  },
}
