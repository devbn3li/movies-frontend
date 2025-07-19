import type { Metadata } from "next";
import PersonPage from "./PersonPage";

type Props = {
  params: Promise<{ personId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { personId } = await params;

  // You could fetch person data here for better SEO, but for now we'll use generic metadata
  return {
    title: `Actor Details - Movie Zone`,
    description: `View detailed information about this talented actor including biography, filmography, and career highlights.`,
    keywords: ["actor", "biography", "filmography", "movies", "TV shows", "career"],
    alternates: {
      canonical: `https://moviezonee.mooo.com/person/${personId}`,
    },
    openGraph: {
      title: `Actor Details - Movie Zone`,
      description: `View detailed information about this talented actor including biography, filmography, and career highlights.`,
      url: `https://moviezonee.mooo.com/person/${personId}`,
      type: "profile",
    },
  };
}

export default async function Page({ params }: Props) {
  const { personId } = await params;
  return <PersonPage personId={parseInt(personId)} />;
}
