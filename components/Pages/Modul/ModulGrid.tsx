export default function ModulGrid() {
  return (
    <div className='col-sm-6 col-lg-4'>
      <div className='card card-sm'>
        <a href='#' className='d-block'>
          <img
            src='https://preview.tabler.io/static/photos/beautiful-blonde-woman-relaxing-with-a-can-of-coke-on-a-tree-stump-by-the-beach.jpg'
            className='card-img-top'
          />
        </a>
        <div className='card-body'>
          <div className='d-flex align-items-center'>
            {/* <span
                className='avatar me-3 rounded'
                style='background-image: url(./static/avatars/000m.jpg)'></span> */}
            <div>
              <div>Bahasa Inggris</div>
              <div className='text-muted'>Roch Imaniwati - X</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
