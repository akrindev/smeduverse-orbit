import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ModulList from "../modul/components/modul-list";
import AnalyticsCard from "./components/analytics";

// revalidate every 5 seconds
export const revalidate = 5;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Halaman utama",
};

export default async function Page() {
  return (
    <div className='flex flex-col space-y-5 h-full'>
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <h2 className='font-semibold text-2xl tracking-tight'>Dashboard</h2>
            <p className='text-muted-foreground text-sm'>
              Selamat datang kembali
            </p>
          </div>
        </div>

        <AnalyticsCard />

        <div className='mt-5'>
          <div className='space-y-1 mt-6'>
            <h2 className='font-semibold text-2xl tracking-tight'>Modul</h2>
            <p className='text-muted-foreground text-sm'>
              Modul yang kamu kelola
            </p>
          </div>
          <Separator className='my-4' />
          <ModulList owned />
        </div>
      </div>
    </div>
  );
}
