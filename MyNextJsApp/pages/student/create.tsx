import { useEffect, useState } from "react";
import { Fakultas, FakultasClient, JurusanClient, Kampus, KampusClient } from "../../api/shop_api";
import Layout from "../shared/layout";
import Select from 'react-select';
import { SingleDatePicker } from 'react-dates';
import Moment from "moment";
import 'react-dates/initialize';

interface Student {
    studentID: string;
    nama: string;
    jurusan: string;
    fakultas: string;
    kampus: string;
}

interface SelectOption {
    value: string;
    label: string;
}

function StudentCreateForm() {

    const [listKampus, setListKampus] = useState<Kampus[]>([]);
    const [listFakultas, setListFakultas] = useState<SelectOption[]>([]);
    const [listJurusan, setListJurusan] = useState<SelectOption[]>([]);
    const [birthday, setBirthday] = useState<Moment.Moment | null>(Moment());
    const [birthdayFocused, setBirthdayFocused] = useState(false);

    useEffect(() => {
        (async () => {
            const client = new KampusClient('https://localhost:44324');
            const list = await client.get();
            setListKampus(list);
        })();

        (async () => {
            const client = new FakultasClient('https://localhost:44324');
            const list = await client.get();
            const select = list.map(Q => ({
                label: Q.name ?? '',
                value: Q.fakultasID
            } as SelectOption));

            setListFakultas(select);
        })();
    }, []);

    const downloadJurusan = async (fakultasID: string | undefined) => {
        if (!fakultasID) {
            return;
        }

        setListJurusan([]);

        const client = new JurusanClient('https://localhost:44324');
        const list = await client.get(fakultasID);
        const select = list.map(Q => ({
            label: Q.name ?? '',
            value: Q.jurusanID
        } as SelectOption));

        setListJurusan(select);
    }

    return (
        <div>
            <form >
                <div className="form-floating mb-3">
                    <input id="studentID" className="form-control" placeholder="s" />
                    <label htmlFor="studentID">ID</label>
                </div>
                <div className="form-floating mb-3">
                    <input id="nama" className="form-control" placeholder="s" />
                    <label htmlFor="nama">Nama</label>
                </div>
                <div className="mb-3">
                    <label className="fw-bold" htmlFor="fakultas">Fakultas</label>
                    <Select instanceId={'label'} onChange={e => downloadJurusan(e?.value)} options={listFakultas}></Select>
                </div>
                <div className="mb-3">
                    <label className="fw-bold" htmlFor="jurusan">Jurusan</label>
                    <Select instanceId={'label'} options={listJurusan}></Select>
                </div>            
                <div className="form-floating mb-3">

                    <select id="kampus" className="form-control" placeholder="s">
                        {
                            listKampus.map(Q => <option key={Q.kampusID} value={Q.kampusID}>{Q.name}</option>)
                        }
                    </select>
                    <label htmlFor="kampus">Kampus</label>
                </div>
                <div>
                    <label className="fw-bold" htmlFor="birthday">Birthday</label>
                    <br/>
                    <SingleDatePicker 
                        id="birthday"
                        date={birthday} 
                        onDateChange={e => setBirthday(e)}
                        focused={birthdayFocused} 
                        onFocusChange={e => setBirthdayFocused(e.focused)}
                        >
                    </SingleDatePicker>
                </div>
            </form>
        </div>
    );
}

function StudentCreate() {
    return (
        <div>
            <StudentCreateForm />
        </div>
    );
}

export default function StudentCreatePage() {
    return (
        <Layout title="Add New Student">
            <StudentCreate />
        </Layout>
    );
}