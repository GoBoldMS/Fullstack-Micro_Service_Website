import 'bootstrap/dist/css/bootstrap.css';
import Api from "../api/build-client";
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}></Header>
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>)
}

AppComponent.getInitialProps = async (appContext) => {
    const client = Api(appContext.ctx);
    
    const secretKey = process.env.SECRET_KEY;


    const { data } = await client.get('api/users/currentuser')

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser,secretKey)
    }

    return {
        pageProps,
        ...data,

    }
}

export default AppComponent;