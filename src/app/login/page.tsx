"use client";

import { IconEye } from "@tabler/icons-react";
import Image from "next/image";
import { getCsrfToken, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function getC() {
      const res = await getCsrfToken();

      setCsrfToken(res);

      return res;
    }

    getC();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // prevent to be reloaded
    e.preventDefault();

    // initial laoding
    setState((s) => "loading");

    // then post credentials
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      // set loading btn to idle
      setState((s) => "idle");
      // console.log("signIn", res);
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setPassword((p) => "");
        setError((p) => true);
      }
    });
  };

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
                  {error && (
                    <div className='alert alert-danger'>
                      <strong>Oops!</strong> NIY / Email atau password salah.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} method='post'>
                    <input
                      type='hidden'
                      name='csrfToken'
                      defaultValue={csrfToken}
                    />
                    <div className='mb-3'>
                      <label className='form-label'>NIY / Email</label>
                      <input 
                        type='email'
                        name='email'
                        className='form-control'
                        placeholder='NIY / Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                      />
                    </div>
                    <div className='mb-2'>
                      <label className='form-label'>Password</label>
                      <div className='input-group input-group-flat'>
                        <input
                          type='password'
                          name='password'
                          className='form-control'
                          placeholder='Your password'
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
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
                        <input
                          type='checkbox'
                          name='remember'
                          className='form-check-input'
                        />
                        <span className='form-check-label'>
                          Remember me on this device
                        </span>
                      </label>
                    </div>
                    <div className='form-footer'>
                      <button
                        type='submit'
                        className={`btn btn-primary w-100 ${
                          state == "loading" && "btn-loading"
                        }`}>
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
