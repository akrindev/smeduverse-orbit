import { IconEye } from "@tabler/icons-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className='page page-center'>
      <div className='container container-normal py-4'>
        <div className='row align-items-center g-4'>
          <div className='col-lg'>
            <div className='container-tight'>
              <div className='text-center mb-4'>
                <a href='/' className='navbar-brand navbar-brand-autodark'>
                  <Image
                    src={`/orbit.png`}
                    width={46}
                    height={46}
                    alt='orbit'
                    className='mr-3'
                  />
                  <span className='h2'>Smeduvere Orbit</span>
                </a>
              </div>
              <div className='card card-md'>
                <div className='card-body'>
                  <h2 className='h2 text-center mb-4'>
                    Login to your orbit account
                  </h2>
                  <form action='/dashboard' method='get'>
                    <div className='mb-3'>
                      <label className='form-label'>NIY / Email</label>
                      <input
                        type='email'
                        className='form-control'
                        placeholder='NIY / Email'
                      />
                    </div>
                    <div className='mb-2'>
                      <label className='form-label'>Password</label>
                      <div className='input-group input-group-flat'>
                        <input
                          type='password'
                          className='form-control'
                          placeholder='Your password'
                        />
                        <span className='input-group-text'>
                          <a
                            href='#'
                            className='link-secondary'
                            title='Show password'
                            data-bs-toggle='tooltip'>
                            <IconEye />
                          </a>
                        </span>
                      </div>
                    </div>
                    <div className='mb-2'>
                      <label className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <span className='form-check-label'>
                          Remember me on this device
                        </span>
                      </label>
                    </div>
                    <div className='form-footer'>
                      <button type='submit' className='btn btn-primary w-100'>
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg d-none d-lg-block'>
            <Image
              src={`/nothing-here.png`}
              className='d-block mx-auto'
              alt='nothing here'
              width={550}
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
