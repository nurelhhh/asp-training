import Layout from "../../shared/layout";
import {SingleDatePicker} from 'react-dates';
import React, { useState } from "react";
import Moment from 'moment';
import { BookingClient } from "../../api/shop_api";


interface BookingFormData {
    dateFrom: Moment.Moment;
    dateTo: Moment.Moment;
}

const BookingForm: React.FunctionComponent<{
    onSubmit: (params: BookingFormData) => Promise<void>
}> = (props) => {
    const [datePickerFromFocused, setDatePickerFromFocused] = useState(false);
    const [datePickerToFocused, setDatePickerToFocused] = useState(false);
    const [dateFromValue, setDateFromValue] = useState<Moment.Moment | null>(null);
    const [dateToValue, setDateToValue] = useState<Moment.Moment | null>(null);

    const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!dateFromValue || !dateToValue) {
            return;
        }

        await props.onSubmit({
            dateFrom: dateFromValue,
            dateTo: dateToValue
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <SingleDatePicker 
                        id="datePickerFrom"
                        focused={datePickerFromFocused}
                        onFocusChange={e => setDatePickerFromFocused(e.focused)}
                        date={dateFromValue}
                        onDateChange={e => setDateFromValue(e)}
                        block />
                </div>
                <div className="mb-3">
                    <SingleDatePicker 
                        id="datePickerTo"
                        focused={datePickerToFocused}
                        onFocusChange={e => setDatePickerToFocused(e.focused)}
                        date={dateToValue}
                        onDateChange={e => setDateToValue(e)}
                        block />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </div>
            </form>

            {
                dateFromValue?.toISOString() +
                '\n' +
                dateToValue?.toISOString()
            }
        </div>
    );
}

function Booking() {
    const onSubmit = async (params: BookingFormData) => {
        const client = new BookingClient('https://localhost:44324');
        await client.post({
            from: params.dateFrom.toISOString(true),
            to: params.dateTo.toISOString(true)
        });
    };

    return (
        <div>
            <BookingForm onSubmit={onSubmit} />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Layout title="Create Booking">
            <Booking />
        </Layout>
    );
}