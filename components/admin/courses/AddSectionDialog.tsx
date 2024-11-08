'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createSection } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";

type SectionFormData = {
  name: string;
};

export default function AddSectionDialog({ semesterId }: { semesterId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionFormData>();
  const { loading, error, fn: fetchCreateSection, data:res } = useFetch(createSection);

  const onSubmit = async (data: SectionFormData) => {
    await fetchCreateSection(semesterId, data.name);
  };

  useEffect(()=>{
    if(res){
        setOpen(false);
        reset();
        router.refresh();
    }
  },[res]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Section Name (e.g., A, B, C)"
              {...register("name", {
                required: "Section name is required",
                pattern: {
                  value: /^[A-Za-z]$/,
                  message: "Must be a single alphabet character"
                },
              })}
              disabled={loading}
              className="uppercase"
              maxLength={1}
            />
            {!loading && errors && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          {!loading && error && <p className="text-sm text-red-500">Failed to create section</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Section'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 