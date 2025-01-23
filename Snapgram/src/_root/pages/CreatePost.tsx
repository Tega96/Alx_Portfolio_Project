import PostForm from "@/components/form/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start
        w-full">
        <img 
          src="/assets/icons/add-post.svg"
          alt="Create post"
          width={36}
          height={36}
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Create posts</h2>
        </div>
        <PostForm />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
};

export default CreatePost;
