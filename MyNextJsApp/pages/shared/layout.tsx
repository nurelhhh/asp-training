import React from 'react';
import Head from 'next/head';

export class Layout extends React.Component<{
    title: string
}> {
    render() {
        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>{this.props.title}</title>
                </Head>
                <div>
                    <p>Ini header</p>
                    <p>test aja</p>
                    <button type="button">My Button</button>
                    <hr/>
                </div>
                <main>{this.props.children}</main>
            </div>
        );
    }
}