import connectDB from '@/lib/db';
import { BlogPost } from '@/models';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { getAllCMS } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Investment Insights | Expert Real Estate Advice',
  description: 'Read the latest trends in Nigerian and UK property markets. Expert advice for diaspora investors and local buyers.',
};

export const dynamic = 'force-dynamic';

export default async function BlogListing() {
  await connectDB();
  const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
  const cms = await getAllCMS();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <header className="bg-brand-emerald py-24 mb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">{cms['blog.hero.title'] || 'Investment Insights'}</h1>
            <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg leading-relaxed">
              {cms['blog.hero.subtitle'] || 'Strategic advice on real estate investment, capital growth, and securing your future through property.'}
            </p>
          </div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </header>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-700 mb-2">{cms['blog.empty.title'] || 'Insights Coming Soon'}</h3>
              <p className="text-zinc-400 font-medium">{cms['blog.empty.text'] || 'Our editorial team is preparing expert content.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post: any) => (
                <div 
                  key={post._id.toString()}
                  className="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-emerald uppercase tracking-widest">
                        {post.category}
                      </div>
                    </div>
                  </Link>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold mb-4 hover:text-brand-emerald transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-zinc-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all duration-300">
                      Explore Article <ArrowRight className="h-4 w-4 text-brand-gold" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer initialCms={cms} />
    </>
  );
}
