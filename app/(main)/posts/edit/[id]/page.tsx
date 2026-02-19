import EditPostForm from '@/components/EditPostForm';
import posts from '@/data/posts';

interface PostEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PostEditPage = async ({ params }: PostEditPageProps) => {
  const { id } = await params;

  const post = posts.find((post) => post.id === id);

  if (!post) {
    return <div>Post not found.</div>;
  }

  return <EditPostForm post={post} />;
};

export default PostEditPage;
