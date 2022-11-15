export default function ModulSectionSide() {
  return (
    <>
      <div className='subheader mb-2'>Search</div>
      <div className='mb-2'>
        <input
          type='text'
          className='form-control'
          placeholder='Search . . .'
        />
      </div>
      <div className='subheader mb-2'>Guru</div>
      <div className='mb-2'>
        <select className='form-select'>
          <option value='all'>Semua Guru</option>
          <option value='ima'>Bu ima</option>
          <option value='us'>Bu Us</option>
          <option value='widy'>Bu Widy</option>
        </select>
      </div>
      <div className='subheader mb-2'>Tahun Ajaran</div>
      <div className='mb-2'>
        <select className='form-select'>
          <option value='2022'>2022/2023</option>
          <option value='2021'>2021/2022</option>
        </select>
      </div>
      <div className='subheader mb-2'>Tingkat Kelas</div>
      <div className='mb-2'>
        <div className='list-group list-group-transparent mb-3'>
          <a
            className='list-group-item list-group-item-action d-flex align-items-center active'
            href='#'>
            X<small className='text-muted ms-auto'>24</small>
          </a>
          <a
            className='list-group-item list-group-item-action d-flex align-items-center'
            href='#'>
            XI
            <small className='text-muted ms-auto'>149</small>
          </a>
          <a
            className='list-group-item list-group-item-action d-flex align-items-center'
            href='#'>
            XII
            <small className='text-muted ms-auto'>88</small>
          </a>
        </div>
      </div>
    </>
  );
}
