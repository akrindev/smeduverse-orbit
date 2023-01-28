import Link from "next/link";

export default function ModulGrid({ id }: { id: string | number }) {
  return (
    <div className='col-sm-6 col-lg-4'>
      <div className='card card-sm'>
        <Link href={`/modul/${id}`} className='d-block'>
          <img
            src='https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1232&q=80'
            className='card-img-top'
          />
        </Link>
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
