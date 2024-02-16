
const links = {
    wcaURL: "https://worldcubeassociation.org",
    appID: "4z4iVFLLs_08S7t8Bl2E-sRMc3zdFVviDeoHsxscKKk",
    redirect: "http://localhost:5173/",
}

export const AuthService = {
    setToken: (token: string) => {
      localStorage.setItem('accessToken', token);
    },
    getToken: () => {
      return localStorage.getItem('accessToken');
    },
    logIn: () => {
        return `${links.wcaURL}/oauth/authorize?client_id=${links.appID}&redirect_uri=${links.redirect}&response_type=token&scope=public+manage_competitions`;
    },
    logOut: () => {
      // Add something here
    },
  };