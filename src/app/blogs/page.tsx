import { redirect } from "next/navigation";

export default async function BlogsPage() {
  // Redirect to the first page to maintain consistent URL structure
  redirect("/blogs/page-1");
}