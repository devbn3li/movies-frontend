import type { Metadata } from "next";
import PersonPage from "./PersonPage";
import { getPersonDetails } from "@/lib/api";

type Props = {
  params: Promise<{ personId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { personId } = await params;

  // Fetch person data for dynamic metadata
  try {
    const person = await getPersonDetails(parseInt(personId));
    const personName = person?.name || "Unknown Actor";

    return {
      title: `${personName}'s Profile - Movie Zone`,
      description: `View detailed information about ${personName} including biography, filmography, and career highlights.`,
      keywords: ["actor", "biography", "filmography", "movies", "TV shows", "career", personName],
      alternates: {
        canonical: `https://moviezone-inky.vercel.app/person/${personId}`,
      },
      openGraph: {
        title: `${personName}'s Profile - Movie Zone`,
        description: `View detailed information about ${personName} including biography, filmography, and career highlights.`,
        url: `https://moviezone-inky.vercel.app/person/${personId}`,
        type: "profile",
      },
    };
  } catch {
    // Fallback metadata if person fetch fails
    return {
      title: `Actor Profile - Movie Zone`,
      description: `View detailed information about this talented actor including biography, filmography, and career highlights.`,
      keywords: ["actor", "biography", "filmography", "movies", "TV shows", "career"],
      alternates: {
        canonical: `https://moviezone-inky.vercel.app/person/${personId}`,
      },
      openGraph: {
        title: `Actor Profile - Movie Zone`,
        description: `View detailed information about this talented actor including biography, filmography, and career highlights.`,
        url: `https://moviezone-inky.vercel.app/person/${personId}`,
        type: "profile",
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const { personId } = await params;
  return <PersonPage personId={parseInt(personId)} />;
}
