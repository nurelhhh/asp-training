import { Layout } from "./shared/layout";
import React, { useState } from 'react';
import Link from 'next/link';



const Index: React.FunctionComponent<{}> = () => {
    const [num, setNum] = useState(0);

    return (
        <div>
            <button 
                type="button" 
                className="btn btn-primary"
                onClick={e => {
                    setNum(num + 1);
                }}>
                    {num}
            </button>
        </div>
    );
}

// class Index extends React.Component<{}, {
//     num: number
// }> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             num: 0
//         }
//     }

//     onClick = () => {
//         this.setState({
//             num: this.state.num + 1
//         });
//     }
//     render() {
//         return (
//             <div>
//                 <button className="btn btn-primary" onClick={this.onClick} type="button">{this.state.num}</button>
//                 <br/>
//                 <Link href="/todo">
//                     <a>Goto Todo List</a>
//                 </Link>
//             </div>
//         );
//     }
// }


export default function IndexPage() {
    return (
        <Layout title="Home">
            <Index></Index>
        </Layout>
    ); 
}