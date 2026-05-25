import connectDB from '@/lib/db';
import { BlogPost } from '@/models';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCMS } from '@/lib/cms';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const post = await BlogPost.findOne({ slug, published: true });
  const cms = await getAllCMS();

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-emerald mb-8 sm:mb-10 lg:mb-12 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Insights
          </Link>

          <header className="mb-10 sm:mb-12 lg:mb-14">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-brand-gold mb-4 uppercase tracking-widest">
              <span>{post.category}</span>
              <span className="text-zinc-200">&middot;</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 leading-[1.05] break-words">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-3xl mb-6 sm:mb-8 break-words">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-brand-emerald">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">{post.author}</p>
                <p className="text-xs text-zinc-400">Senior Property Advisor</p>
              </div>
            </div>
          </header>

          <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden mb-10 sm:mb-12 border border-zinc-100 shadow-xl">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div
            className="prose prose-sm sm:prose-base lg:prose-lg prose-emerald max-w-none overflow-hidden break-words prose-headings:font-heading prose-headings:text-brand-emerald prose-headings:break-words prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:break-words prose-li:break-words prose-strong:break-words prose-a:break-all prose-img:max-w-full prose-img:rounded-2xl prose-pre:overflow-x-auto prose-code:break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-zinc-100">
            <div className="bg-brand-cream p-6 sm:p-10 rounded-3xl border border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2">Ready to take the next step?</h3>
                <p className="text-zinc-600">
                  Our experts are ready to help you navigate the investment landscape safely.
                </p>
              </div>
              <Link
                href="/prequalify"
                className="btn-gold px-8 sm:px-10 py-4 whitespace-nowrap w-full sm:w-auto text-center"
              >
                Check My Eligibility
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer initialCms={cms} />
    </>
  );
}
