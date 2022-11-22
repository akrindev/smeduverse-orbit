export default function Siswa() {
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
              <th>Tanggal Lahir</th>
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
                  <div>Pekalongan</div>
                  <div className='text-muted'>22 Agustus 2001</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
