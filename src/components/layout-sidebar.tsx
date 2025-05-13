import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactQueryProvider } from "./react-query-provider";

export function LayoutSidebar({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }>
        <AppSidebar variant='floating' />
        <SidebarInset>
          <header className='flex items-center gap-2 px-4 h-16 shrink-0'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className=''>
                  <BreadcrumbLink href='/'>Smeduverse Orbit</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className='md:block hidden' />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className='flex-1 overflow-y-auto'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
