import EditPostForm from '@/components/EditPostForm'; // Client Component
import posts from '@/data/posts';

interface PostEditPageProps {
  params: {
    id: string;
  };
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const post = posts.find((post) => post.id === params.id);

  // Opsional: handle jika post tidak ditemukan
  if (!post) {
    return <div>Post not found.</div>;
  }

  return <EditPostForm post={post} />;
};

export default PostEditPage;
