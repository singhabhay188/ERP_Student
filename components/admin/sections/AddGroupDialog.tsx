"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { createGroup } from "@/actions/admin" // You'll need to create this action
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/useFetch"

export default function AddGroupDialog({ sectionId }: { sectionId: string }) {
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const router = useRouter()

  const { loading, error, fn: fetchCreateGroup, data } = useFetch(createGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchCreateGroup(sectionId, groupName);
    setGroupName("")
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Creating Group' : 'Create Group'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 