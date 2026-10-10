import { ArtsgozTechSquadLogo } from '../branding';

export default function MaintenancePage() {
  return (
    <section className="flex flex-col p-6 items-center justify-center min-h-screen h-full bg-stone-50">
      <div className="flex flex-col font-maintenance max-w-[400px] text-stone-600">
        <ArtsgozTechSquadLogo className="h-auto w-full max-w-48" />
        <h1 className="text-4xl font-semibold pb-2">
          Curating something special for you.
        </h1>
        <p className="pb-2">
          We are building a brand-new digital space for Arts students to
          connect, share big ideas, and shape our campus community. The Artsgoz
          Tech Squad is crafting the ultimate hub for critical thinkers and
          changemakers.
        </p>
        <p className="pb-4">
          Dropping the lore on{' '}
          <a className="bg-[#FFB420]/80 mix-blend-multiply px-1 font-medium">
            Dec 25, 2026
          </a>
        </p>
        <a
          href="https://www.instagram.com/arts_goz#"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Instagram @arts_goz
        </a>
      </div>
    </section>
  );
}
