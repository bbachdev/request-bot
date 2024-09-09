interface ContentContainerProps {
  children: React.ReactNode;
}

export default function ContentContainer({children}: ContentContainerProps) {
  return (
    <div className={`flex-grow flex flex-col max-w-[1440px] w-full mx-auto`}>
      {children}
    </div>
  )
}