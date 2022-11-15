import { IconCalendar, IconMessage } from "@tabler/icons";

export default function Tugas() {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>Tugas </h3>
      </div>
      <div className='table-responsive'>
        <table className='table card-table table-vcenter'>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i}>
                <td className='w-100'>
                  <a href='#' className='text-reset'>
                    Simple Present Tense
                  </a>
                </td>
                <td className='text-nowrap text-muted'>
                  <IconCalendar className='icon mr-2' />
                  August 05, 2022
                </td>
                <td className='text-nowrap'>
                  <a href='#' className='text-muted'>
                    <IconMessage className='icon mr-2' /> 3
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
