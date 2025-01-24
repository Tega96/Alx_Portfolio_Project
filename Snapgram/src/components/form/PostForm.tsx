import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Navigate, useNavigate } from "react-router-dom";
import { Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
  } from "../ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import FileUploader from "../ui/shared/FileUploader";


type PostFormProps = {
	post?: Models.Document; //Models here comes from the database
	action: "Create" | "Update";
} 
 

const PostForm = ({ post, action }: PostFormProps) => {
	const navigate = useNavigate();
	const { toast }	= useToast();
	const { user } = useUserContext(); // This produce the user id from the database
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
			file: [],
			location: post ? post.location : "",
			tags: post ? post.tags.join(",") : "",
    },
  })

	// function onSubmit(values: z.infer<typeof PostValidation>) {
	// 	console.log(values)
	// }


  // 2. Handler.
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
		// ACTION = UPDATE
		if (post && action === "Update") {
			const updatePost = await updatePost({
				...value,
				postId: post.$id,
				imageId: post.imageId,
				imageUrl: post.imageUrl,
			});

			if (!updatedPost) {
				renderToStaticMarkup({
					title: `${action} post failed. Please try again.`,
				});
			}
			return navigate(`/posts/${postMessage.$id}`); // define a postMessage to say something like "Post update fail, please try again"
		}

		// ACTION = CREATE
		const newPost = await createPost({
			...value,
			userId:user.id,
		});

		if (!newPost) {
			renderToStaticMarkup({
				title: `${action} post failed. Please try again.`,
			});
		}
		navigate("/");
	};  


  return (
    <Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} 
				className="flex flex-col gap-9 w-full max-w-5xl">
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
					<FormItem>
							<FormLabel className="shad-form label">Caption</FormLabel>
							<FormControl>
								<Textarea className="shad-textarea custom-scrollbar" {...field} />
							</FormControl>
							<FormMessage className="shad-form message" />
					</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
					<FormItem>
						<FormLabel className="shad-form label">Add Photos</FormLabel>
						<FormControl>
							<FileUploader 
								fieldChange={field.onChange}
								mediaUrl={post?.imageUrl}
							/>
						</FormControl>
						<FormMessage className="shad-form message" />
					</FormItem>
					)}
				/>

				<FormField 
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Location</FormLabel>
							<FormControl>
								<Input type="text" className="shad-input" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField 
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">
								Add Tags (separated by comma " , ")
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Art, Expression, Learn"
									type="text"
									className="shad-input"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<div className="flex gap-4 items-center justify-end">
					<Button
						type="button"
						className="shad-button_dark_4"
						onClick={() => Navigate(-1)}>
						Cancel
					</Button>
					{/* <Button
						type="submit"
						className="shad-button_primary_whitespace-nowrap"
						disable={isLoadingCreate || isLoadingUpdate}>
						{(isLoadingCreate || isLoadingUpdate) && <Loader />}	
						{action} Post
					</Button> */}
				</div>
			</form>
		</Form>
  );
};

export default PostForm;