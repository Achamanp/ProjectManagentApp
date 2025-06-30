import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { tags } from '../ProjectList/ProjectList' 
import { useDispatch } from 'react-redux'
import { createProject } from '../../Redux/Project/Action'

const ProjectForm = () => {

  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      tags: ['javascript', 'react']
    }
  })

   const handleTagsChange = (newValue)=>{
    const currentTags = form.getValues("tags");
    const updatedTags = currentTags.includes(newValue)?
    currentTags.filter(tag=> tag!==newValue):[...currentTags, newValue];
    form.setValue("tags", updatedTags);
  }

  const onSubmit = (data) => {
    dispatch(createProject(data))
  }

  const projectLimitReached = false

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="project name"
                    type="text"
                    className="border w-full border-gray-300 py-2 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="project description..."
                    className="border w-full border-gray-300 py-3 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category (Select) */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Fullstack</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                    {/* Category (Select) */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <Select
                  onValueChange={(value)=>{
                    handleTagsChange(value);
                  }}
                  // defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  {tags.map((item)=> <SelectItem key={item} value={item}>{item}</SelectItem>)}
                 
                  </SelectContent>
                </Select>
                <FormMessage />
                <div className='flex gap-1 flex-wrap'>
              {field.value.map((item, index) => (
                  <div
                    key={item}
                    onClick={() => handleTagsChange(item)}
                    className='cursor-pointer flex rounded-full items-center border gap-2 py-1 px-4'
                  >
                    <span className='text-sm flex items-center justify-center'>{item}</span>
                    <Cross1Icon className='h-3 w-3' />
                  </div>
                ))}

                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          {projectLimitReached ? (
            <p className="text-sm text-red-600">
              You can create only 3 projects with the free plan. Please upgrade your plan.
            </p>
          ) : (
            <DialogClose asChild>
              <Button type="submit" className="w-full py-5">
                Create Project
              </Button>
            </DialogClose>
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProjectForm
