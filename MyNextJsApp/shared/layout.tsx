import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserManagerFactory } from '../services/UserManagerFactory';

function GetNavigationLinkClassName(active: boolean) {
    if (active) {
        return "nav-link active";
    } else {
        return "nav-link";
    }
}

function GetNavigationLinkAriaCurrent(active: boolean) {
    if (active) {
        return "page";
    } else {
        return undefined;
    }
}

const NavigationLink: React.FunctionComponent<{
    href: string
}> = (props) => {
    let active;
    if (props.href === '/') {
        if (useRouter().pathname === '/') {
            active = true;
        } else {
            active = false;
        }
    } else {
        active = (useRouter().pathname.toLowerCase().includes(props.href.toLowerCase()));
    }

    return (
        <li className="nav-item">
            <Link href={props.href}>
                <a className={GetNavigationLinkClassName(active)} aria-current={GetNavigationLinkAriaCurrent(active)}>
                    {props.children}
                </a>
            </Link>
        </li>
    );
}

const LoginDropdown: React.FunctionComponent<{}> = () => {
    const [fullName, setFullName] = useState('');
    const [ready, setReady] = useState(false);

    const getUserData = async () => {
        const userManager = UserManagerFactory();
        const user = await userManager.getUser();

        setFullName(user?.profile?.name ?? '');
        setReady(true);
    }

    useEffect(() => {
        getUserData();
    }, []);

    if (ready === false) {
        return <div></div>;
    }

    return (
        <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown ms-auto">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {
                    fullName ? fullName : 'guest'
                }
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {
                        fullName ? 
                        <li>
                            <a className="dropdown-item" href="/account/logout">
                                <FontAwesomeIcon className="me-2" icon={faSignOutAlt} />
                                Logout
                            </a>
                        </li>
                        :
                        <li>
                            <Link href="/account/login">
                                <a className="dropdown-item">
                                    <FontAwesomeIcon className="me-2" icon={faSignInAlt} />
                                    Login
                                </a>
                            </Link>
                        </li>
                    }
                </ul>
            </li>
        </ul>
    );
}

const NavigationBar: React.FunctionComponent<{}> = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link href="/">
                    <a className="navbar-brand">3+1 Gan</a>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <NavigationLink href="/">Home</NavigationLink>
                    <NavigationLink href="/todo">Todo</NavigationLink>
                    <NavigationLink href="/customer">Customers</NavigationLink>
                    <NavigationLink href="/product">Products</NavigationLink>
                    <NavigationLink href="/student/create">Students</NavigationLink>
                </ul>
                <LoginDropdown />
                </div>
            </div>
      </nav>
    );
};

export class Layout extends React.Component<{
    title: string
}> {
    render() {
        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <title>{this.props.title} - Belajar React</title>
                </Head>
                <header>
                    <NavigationBar></NavigationBar>
                </header>
                <main className="container my-4">
                    {this.props.children}
                </main>
                <footer>
                    <script src="/bootstrap.bundle.min.js"></script>
                </footer>
            </div>
        );
    }
}

export default Layout;