import { environment } from "../../environments/environment";

export default {
  auth: {
    domain: "dev-li55ssrce5r8p0im.eu.auth0.com",
    clientId: "j6kUcSQidBs1diUiqgIwrzHc4cX8oasa",
    authorizationParams: {
      redirect_uri: "https://localhost:4200/login/callback",
      audience: "http://localhost:8080",
    },
    
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase',
       'http://localhost:8080/api/page-contents/**',
    ],
  },
}
