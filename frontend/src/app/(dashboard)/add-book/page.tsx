"use client"

import { useMe, useCreateBook } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Upload, X } from "lucide-react"

interface AddBookFormInputs {
  title: string
  author: string
  category: string
  description: string
  totalCopies: string
}

export default function AddBookPage() {
  const { data: user, isLoading: userLoading } = useMe()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddBookFormInputs>()

  const { mutate: createBook, isPending } = useCreateBook()

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const categories = [
    "fiction",
    "non-fiction",
    "technology",
    "science",
    "history",
    "biography",
    "architecture",
    "medical",
    "law",
    "business",
    "philosophy",
    "education",
  ]

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  if (userLoading) return null

  if (user?.role === "student") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Only librarians and admins can add books
          </p>
        </div>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setImage(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  const onSubmit = (data: AddBookFormInputs) => {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("author", data.author)
    formData.append("category", data.category)
    formData.append("description", data.description)
    formData.append("totalCopies", data.totalCopies)

    if (image) {
      formData.append("coverImage", image)
    }

    createBook(formData, {
      onSuccess: () => {
        reset()
        setImage(null)
        setImagePreview("")
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-emerald">
          Add New Book
        </h1>
        <p className="text-muted-foreground mt-1">
          Add a new book to your library collection
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>

                <Input
                  placeholder="Book title"
                  {...register("title", { required: "Title is required" })}
                  className="bg-background border-border"
                />

                {errors.title && (
                  <p className="text-xs text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>

                <Input
                  placeholder="Author name"
                  {...register("author", { required: "Author is required" })}
                  className="bg-background border-border"
                />

                {errors.author && (
                  <p className="text-xs text-red-500">
                    {errors.author.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>

                <Select
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <input
                  type="hidden"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />

                {errors.category && (
                  <p className="text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Copies</label>

                <Input
                  type="number"
                  placeholder="Number of copies"
                  {...register("totalCopies", {
                    required: "Total copies is required",
                  })}
                  className="bg-background border-border"
                />

                {errors.totalCopies && (
                  <p className="text-xs text-red-500">
                    {errors.totalCopies.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                placeholder="Book description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="bg-background border-border"
              />

              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>

              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative w-32 h-40 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setImagePreview("")
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />

                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>

                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:opacity-90"
            >
              {isPending ? "Adding Book..." : "Add Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}