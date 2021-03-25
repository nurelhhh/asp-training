import { Layout } from "./shared/layout";
import React from 'react';
import Link from 'next/link';

class Index extends React.Component<{}, {
    num: number
}> {
    constructor(props) {
        super(props);
        this.state = {
            num: 0
        }
    }

    onClick = () => {
        this.setState({
            num: this.state.num + 1
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.onClick} type="button">{this.state.num}</button>
                <br/>
                <Link href="/todo">
                    <a>Goto Todo List</a>
                </Link>
            </div>
        );
    }
}


export default function IndexPage() {
    return (
        <Layout title="Home">
            <Index></Index>
        </Layout>
    ); 
}