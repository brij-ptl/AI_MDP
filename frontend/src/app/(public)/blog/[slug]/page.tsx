import Container from "@/components/ui/Container";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return (
    <Container className="py-20">
      <article className="mx-auto max-w-2xl">
        <p className="text-sm text-primary">Nidaan+ Health Blog</p>
        <h1 className="mt-2 font-display text-3xl font-bold capitalize">{title}</h1>
        <p className="mt-6 text-muted">
          This article is coming soon. Check back shortly for clinically-reviewed insights on this topic.
        </p>
      </article>
    </Container>
  );
}
