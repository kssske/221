import React, { useState } from "react";
import { apiFetch } from "../api/api";

interface Props {
    studentNumber: string
    onUpdated: () => void
}

export default function AttendanceForm({ studentNumber, onUpdated }: Props) {

    const [session, setSession] = useState("1"); //the initial value 1
    const [status, setStatus] = useState("1");

    const handleSubmit = async (e: React.SubmitEvent) => { //event React.SubmitEvent

        e.preventDefault();

        await apiFetch("/api/attendance", {

            method: "POST",

            body: JSON.stringify({

                number: studentNumber,

                session,

                status: Number(status) //Convert to a number

            })

        });

        onUpdated();

    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>出席登録</h2>

            <select
                value={session}
                onChange={e => setSession(e.target.value)} //type a character into the input 
            // field, the latest character (e.target.value) is overwritten and saved 
            // to  `session`.
            >

                {[...Array(15)].map((_, i) => (
                    <option key={i} value={i + 1}>
                        {i + 1}回目
                    </option>
                ))}

            </select>

            <label>

                <input
                    type="radio"
                    value="1"
                    checked={status === "1"}
                    onChange={e => setStatus(e.target.value)}
                />

                出席

            </label>

            <label>

                <input
                    type="radio"
                    value="0"
                    checked={status === "0"}
                    onChange={e => setStatus(e.target.value)}
                />

                欠席

            </label>

            <button>登録</button>

        </form>

    )

}