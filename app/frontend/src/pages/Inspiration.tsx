import InspirationHero from "@/components/inspiration/InspirationHero";
import EditorialGrid, { allLooks } from "@/components/inspiration/EditorialGrid";
import DesignerBanner from "@/components/inspiration/DesignerBanner";
import CuratedCollections from "@/components/inspiration/CuratedCollections";
import DesignNotes from "@/components/inspiration/DesignNotes";

const Inspiration = () => (
  <>
    <InspirationHero />
    <EditorialGrid items={allLooks} />
    <DesignerBanner />
    <CuratedCollections />
    <DesignNotes />
  </>
);

export default Inspiration;
