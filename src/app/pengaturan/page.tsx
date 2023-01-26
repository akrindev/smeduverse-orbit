export default function SettingsPage() {
  return (
    <div className='col d-flex flex-column'>
      <div className='card-body'>
        <h2 className='mb-4'>My Account</h2>
        {/* <h3 className='card-title'>Profile Details</h3> */}

        <div className='row g-2'>
          <div className='col-md'>
            <div className='form-label'>Nama Lengkap</div>
            <input
              type='text'
              className='form-control'
              value='Syakirin Amin'
              disabled
            />
          </div>
          <div className='col-md'>
            <div className='form-label'>NIY</div>
            <input
              type='text'
              className='form-control'
              value='2021102'
              disabled
            />
          </div>
          <div className='col-md'>
            <div className='form-label'>Jenis PTK</div>
            <input
              type='text'
              className='form-control'
              value='Developer'
              disabled
            />
          </div>
        </div>
      </div>
      {/* <div className='card-footer bg-transparent mt-auto'>
        <div className='btn-list justify-content-end'>
          <a href='#' className='btn'>
            Cancel
          </a>
          <a href='#' className='btn btn-primary'>
            Submit
          </a>
        </div>
      </div> */}
    </div>
  );
}
