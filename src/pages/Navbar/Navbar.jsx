import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useDispatch, useSelector } from 'react-redux';

import ProjectForm from '../Project/ProjectForm'
import { PersonIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../Redux/Auth/Action';

const Navbar = () => {
  
    const {auth} = useSelector(store => store)
  const  navigate=useNavigate();
  const dispatch = useDispatch()

  const handleLogout = ()=>{
    dispatch(logout())
  }
  return (
    <div className='sticky top-0 z-50 bg-black border-b py-4 px-5 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <p onClick={()=>navigate("/")} className='cursor-pointer'>Project Management</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">New Project</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Fill out the form below to create a new project.</DialogDescription>
            </DialogHeader>

            <ProjectForm />
          </DialogContent>
        </Dialog>
        <Button onClick ={()=> navigate("/upgrade_plan")} variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          Upgrade
        </Button>
      </div>
      
      <div className='flex gap-3 items-center'>
        <p className='text-sm font-medium'>{auth.user?.username}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <PersonIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick ={handleLogout}className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar