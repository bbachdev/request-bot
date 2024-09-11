'use client'
import { signOut } from '@/actions/auth'
import { MdArrowDropDown, MdAccountCircle } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import type { User } from "lucia";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';

interface UserBadgeProps {
  user: User | null
}

export default function UserBadge( {user}: UserBadgeProps) {
  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className={`flex flex-row gap-2 items-center`}>
              <Avatar>
                <AvatarImage src={user.profile_image_url} />
                <AvatarFallback>{user.display_name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className={`font-bold`}>{user.display_name}</p>
              <MdArrowDropDown size={30}/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem><span className={`flex flex-row gap-2 items-center`}><MdAccountCircle size={14}/>My Channel</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}><span className={`flex flex-row gap-2 items-center`}><PiSignOutBold size={14}/>Sign Out</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}