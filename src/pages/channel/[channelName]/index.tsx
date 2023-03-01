import AuthLayout from "@/components/AuthContainer"
import { useRouter } from "next/router";

export default function Channel() {
  const router = useRouter();
  const { channelName } = router.query

  return (
    <AuthLayout>
      <div className={'flex justify-center'}>
        Channel Page for {channelName}
      </div>
    </AuthLayout>
  )
}