export default function ListSiswa() {
  const names: Array<{ name: string }> = [
    {
      name: "Nanang Hermanto",
    },
    {
      name: "Syakirin Amin",
    },
    {
      name: "Rio Aprianto",
    },
    {
      name: "Muhimmatul Iffadah",
    },
    {
      name: "Leni Pratiwi",
    },
  ];

  return (
    <div className='card'>
      <div className='table-responsive'>
        <table className='table table-vcenter card-table'>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            {names.map(({ name }) => (
              <tr>
                <td>
                  <div className='d-flex py-1 align-items-center'>
                    <span className='avatar me-2'>SA</span>
                    <div className='flex-fill'>
                      <div className='font-weight-medium'>{name}</div>
                      <div className='text-muted'>
                        <span className='text-reset'>
                          {name.replace(" ", ".").toLowerCase()}@smeducative.com
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <ActionStatus name={name} key={name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ActionStatus = ({ name }: { name: string }) => {
  const id = name.replace(" ", "").toLowerCase();
  return (
    <div className='mb-3'>
      {/* <label className='form-label'>Buttons group</label> */}
      <div className='btn-group w-100' role='group'>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
          checked
        />
        <label htmlFor={`action-status-${id}`} className='btn'>
          Hadir
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
        />
        <label htmlFor={`action-status-${id}`} className='btn'>
          Izin
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
        />
        <label htmlFor={`action-status-${id}`} className='btn'>
          Sakit
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
        />
        <label htmlFor={`action-status-${id}`} className='btn'>
          Alpa
        </label>
      </div>
    </div>
  );
};
