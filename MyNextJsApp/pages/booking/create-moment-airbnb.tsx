import Layout from "../../shared/layout";
import {SingleDatePicker} from 'react-dates';
import React, { useState } from "react";
import Moment from 'moment';
import { BookingClient } from "../../api/shop_api";
import DatePicker from 'react-datepicker';

interface BookingFormData {
    dateFrom: Moment.Moment;
    dateTo: Moment.Moment;
}

const BookingForm: React.FunctionComponent<{
    onSubmit: (params: BookingFormData) => Promise<void>
}> = (props) => {
    const [dateFromValue, setDateFromValue] = useState<Date | null>(null);
    const [dateToValue, setDateToValue] = useState<Date | null>(null);

    const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        if (!dateFromValue || !dateToValue) {
            return;
        }

        await props.onSubmit({
            dateFrom: Moment(dateFromValue),
            dateTo: Moment(dateToValue)
        });
    };

    const toDate = (e: Date | [Date, Date] | null) => {
        if (!e) {
            return null;
        }

        if (Array.isArray(e)) {
            return e[0];
        }

        return e;
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <DatePicker 
                        id="datePickerFrom"
                        selected={dateFromValue}
                        onChange={e => setDateFromValue(toDate(e))}
                        showTimeSelect
                        dateFormat={'Pp'} />
                </div>
                <div className="mb-3">
                <DatePicker 
                        id="datePickerTo"
                        selected={dateToValue}
                        onChange={e => setDateToValue(toDate(e))}
                        showTimeSelect
                        dateFormat="Pp" />

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