import { IconBook2, IconClock } from "@tabler/icons-react";

const tugas = [
  "Buatlah 5 contoh Noun Phrase",
  "Buatlah 5 contoh Simple Present tense",
  "Buatlah 5 contoh Present Tense",
];

export default function Tugas() {
  return (
    <div className='row row-cards'>
      <div className='space-y'>
        {tugas &&
          tugas.map((t) => {
            return (
              <div className='card' key={t}>
                <div className='row g-0'>
                  <div className='col-auto'>
                    <div className='card-body'>
                      <div
                        className='avatar avatar-md'
                        style={{
                          backgroundImage: `url(https://preview.tabler.io/static/jobs/job-1.jpg)`,
                        }}></div>
                    </div>
                  </div>
                  <div className='col'>
                    <div className='card-body ps-0'>
                      <div className='row'>
                        <div className='col'>
                          <h3 className='mb-0'>
                            <a href='#'>{t}</a>
                          </h3>
                        </div>
                        <div className='col-auto fs-3 text-green'>
                          22 Agustus 2022
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md'>
                          <div className='mt-3 list-inline list-inline-dots mb-0 text-muted d-sm-block d-none'>
                            <div className='list-inline-item'>
                              <IconClock className='icon icon-inline mr-2' />
                              <span>25 Agustus 2023 17:00</span>
                            </div>
                            <div className='list-inline-item'>
                              <IconBook2 className='icon icon-inline mr-2' />
                              <span>10/30</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
