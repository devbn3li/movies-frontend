import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PersonPage from "../PersonPage";
import { getPersonDetails } from "@/lib/api";
import { generateSlug } from "@/lib/slug-utils";

type Props = {
  params: Promise<{ personId: string; slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { personId, slug } = await params;
  const id = parseInt(personId);

  try {
    const person = await getPersonDetails(id);
    const personName = person?.name || "Unknown Actor";
    const personSlug = generateSlug(personName);
    const canonicalUrl = personSlug
      ? `https://moviezone-inky.vercel.app/person/${id}/${personSlug}`
      : `https://moviezone-inky.vercel.app/person/${id}`;

    return {
      title: `${personName}'s Profile - Movie Zone`,
      description: `View detailed information about ${personName} including biography, filmography, and career highlights.`,
      keywords: ["actor", "biography", "filmography", "movies", "TV shows", "career", personName],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${personName}'s Profile - Movie Zone`,
        description: `View detailed information about ${personName} including biography, filmography, and career highlights.`,
        url: canonicalUrl,
        type: "profile",
      },
    };
  } catch {
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
  const { personId, slug } = await params;
  const id = parseInt(personId);

  // Fetch person to get the correct slug for redirect
  const person = await getPersonDetails(id);

  if (person) {
    const correctSlug = generateSlug(person.name);
    const currentSlug = slug?.[0] || "";

    // Redirect to correct slug URL if slug is missing or incorrect
    if (correctSlug && correctSlug !== currentSlug) {
      redirect(`/person/${id}/${correctSlug}`);
    }
  }

  return <PersonPage personId={id} />;
}
