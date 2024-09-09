import { Button } from '@/components/ui/button';
import { FaTwitch } from "react-icons/fa6";

export default function Home() {
  return (
    <div className={`flex-grow flex items-center justify-center`}>
      <Button className={`bg-[#9146ff] hover:bg-[#9146ff]/90 gap-2`}><FaTwitch size={20}/>Sign In with Twitch</Button>
    </div>
  );
}