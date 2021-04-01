import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/lib/css/_datepicker.css';
import '../css/index.css';
import 'react-dates/initialize';
import "react-datepicker/dist/react-datepicker.css";

// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import { useEffect } from 'react';
import { UserManagerFactory } from '../services/UserManagerFactory';

const MyApp: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const userManager = UserManagerFactory(true);
    userManager.events.addAccessTokenExpired(e => {
      userManager.signinSilent();
    });
    userManager.events.addAccessTokenExpiring(e => {
      userManager.signinSilent();
    });
  }, []);

  return <Component {...pageProps} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp