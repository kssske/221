interface Props {
    data: any
}

export default function StudentInfo({ data }: Props) {

    return (

        <>

            <h2>学生情報</h2>

            <table>

                <tbody>

                    <tr>
                        <th>学生番号</th>
                        <td>{data.学生番号}</td>
                    </tr>

                    <tr>
                        <th>氏名</th>
                        <td>{data.氏名}</td>
                    </tr>

                    <tr>
                        <th>ふりがな</th>
                        <td>{data.ふりがな}</td>
                    </tr>



                    <tr>
                        <th>記述</th>
                        <td>{data.記述}</td>
                    </tr>
                    <tr>
                        <th>日付</th>
                        <td>{data.日付}</td>
                    </tr>
                    <tr>
                        <th>テスト合計</th>
                        <td>{data.テスト合計}</td>
                    </tr>
                    <tr>
                        <th>成績</th>
                        <td>{data.成績}</td>
                    </tr>
                    <tr>
                        <th>出席合計</th>
                        <td>{data.出席合計}</td>
                    </tr>

                </tbody>

            </table>

        </>

    )

}