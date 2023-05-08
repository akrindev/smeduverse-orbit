import { IconUserCheck } from "@tabler/icons-react";
import Link from "next/link";

export default function LatestAttendandes() {
  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-header">
          <div className="h3 card-title">Presensi terbaru</div>
          <div className="card-actions">
            <Link href={`/dashboard/modul/1`}>lihat semua</Link>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-vcenter card-table table-striped">
            <thead>
              <tr>
                <th>Presensi</th>
                <th>Modul</th>
                <th>Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].reverse().map((id) => (
                <tr key={id}>
                  <td>
                    <div className="d-flex py-1 align-items-center">
                      <div className="flex-fill">
                        <Link
                          href={`/dashboard/modul/presensi?presensiId=${id}`}
                          className="font-weight-medium"
                        >
                          #{id} presensi 22 February 2023
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>Bahasa Inggris</td>
                  <td>
                    <div className="text-muted">
                      <IconUserCheck className="icon icon-inline" />
                      <span className="ml-2">23/30</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
