import PostsTable from "@/components/posts/PostsTable";
import PostsPagination from "@/components/posts/PostsPagination";
import { requireAdmin } from "@/lib/auth";

const PostsPage = async () => {
    await requireAdmin();

    return ( 
        <>
            <PostsTable />
            <PostsPagination />
        </>
     );
};

export default PostsPage;
