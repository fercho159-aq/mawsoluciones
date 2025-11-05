import { portfolioItems } from "@/lib/portfolio-data";
import PortfolioItemPageContent from './portfolio-item-content';

// Generate static paths for each portfolio item
export async function generateStaticParams() {
  return portfolioItems.map((item) => ({
    id: item.id,
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <PortfolioItemPageContent params={params} />;
}
