import { useEffect, useState } from "react";
import { BookingClient, BookingListItem } from "../../api/shop_api";
import Layout from "../../shared/layout";
import Moment from 'moment';

const BookingIndex: React.FunctionComponent = () => {

    const [items, setItems] = useState<BookingListItem[]>([]);
    
    useEffect(() => {
        (async () => {
            const client = new BookingClient("https://localhost:44324");
            const data = await client.get();
            setItems(data);
        })();
    }, []);

    function getRows() {
        return items.map(Q => <tr key={Q.bookingID}>
            <td>{Moment(Q.from).local().format('MMMM Do YYYY, h:mm:ss a')}</td>
            <td>{Moment(Q.to).local().format('MMMM Do YYYY, h:mm:ss a')}</td>
        </tr>);
    }

    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>
                    { getRows() }
                </tbody>
            </table>
        </div>
    );
}

export default function IndexPage() {
    return (
        <Layout title="Bookings">
            <BookingIndex />
        </Layout>
    );
}