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

          <header className="max-w-[46rem] mx-auto mb-10 sm:mb-12 lg:mb-14">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-bold text-brand-gold mb-5 uppercase tracking-[0.24em]">
              <span className="rounded-full bg-brand-gold/10 px-3 py-1.5">{post.category}</span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 leading-[1.08] tracking-tight">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 leading-[1.75] max-w-3xl mb-8">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-6 border-t border-zinc-200">
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-brand-emerald">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">{post.author}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-[0.18em]">Senior Property Advisor</p>
              </div>
            </div>
          </header>

          <div className="max-w-5xl mx-auto mb-10 sm:mb-12 lg:mb-14">
            <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-[1.75rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-950/5">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="max-w-[46rem] mx-auto">
            <div className="article-richtext" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-zinc-100">
            <div className="rounded-3xl border border-zinc-200/80 px-6 py-6 sm:px-10 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2">Ready to take the next step?</h3>
                <p className="text-zinc-600 leading-relaxed">
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
