export default function UserPage({ params }: { params: { twitchId: string } }) {
  console.log('User',params.twitchId)
  return (
    <div>
      page
    </div>
  )
}