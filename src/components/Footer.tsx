import Link from "next/link"

export default function Footer() {
  return (
    <div className={'p-4 bg-gray-800'}>
      <ul className={'flex flex-row justify-center items-center'}>
        <li className="mr-4">
          <Link href={'/privacy-policy'}>Privacy Policy</Link>
        </li>
        <li className="mr-4">|</li>
        <li>
        <Link href={'/terms-of-service'}>Terms of Service</Link>
        </li>
      </ul>
    </div>
  )
}