import Link from "next/link";

// not found
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-3">
      <h1 className="text-3xl font-bold">404</h1>
      <p>Halaman tidak ditemukan</p>
      <Link href="/">Kembali ke halaman utama</Link>
    </div>
  );
}
