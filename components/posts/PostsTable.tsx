import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from '@/components/ui/table';
import Link from 'next/link';
import posts from '@/data/posts';
import { Post } from '@/types/posts';

interface PostsTableProps {
    limit?: number;
    title?: string;
};

const sortedPosts: Post[] = [...posts].sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
);

const PostsTable = ({limit, title}: PostsTableProps) => {
    const filteredPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;
    
    return (
        <>
            <div className='mt-10'>
                <h3 className="text-2xl mb-4 font-semibold">
                    { title ? title:'Posting'}
                </h3>
                <Table>
                    <TableCaption>Daftar posting terbaru</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead className='hidden md:table-cell'>Penulis</TableHead>
                            <TableHead className='hidden text-right md:table-cell'>Tanggal</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell className='hidden md:table-cell'>{post.author}</TableCell>
                                <TableCell className='text-right hidden md:table-cell'>{post.date}</TableCell>
                                <TableCell>
                                    <Link
                                        href={`/posts/edit/${post.id}`}
                                        className='inline-flex min-h-9 items-center rounded-md bg-sky-700 px-3 text-xs font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:bg-sky-500 dark:hover:bg-sky-400'
                                    >
                                        Ubah
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default PostsTable;
