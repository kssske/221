interface Props {
    data: any
}

export default function AttendanceTable({ data }: Props) {

    const sessions = [];

    for (let i = 1; i <= 15; i++) {

        const key = `${i}回目`;

        let label = "";

        if (data[key] == 1) label = "出席";
        else if (data[key] == 0) label = "欠席";

        sessions.push(
            <td key={i}>{label}</td>
        )

    }

    return (

        <div>

            <h2>出席状況</h2>

            <table>

                <thead>

                    <tr>

                        {[...Array(15)].map((_, i) => (
                            <th key={i}>{i + 1}回目</th>
                        ))}

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        {sessions}

                    </tr>

                </tbody>

            </table>

        </div>

    )

}