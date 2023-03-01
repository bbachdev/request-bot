import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children } : AppLayoutProps) {  
  return (
    <div className={'min-h-screen bg-gray-900 text-white flex flex-col justify-between'}>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}