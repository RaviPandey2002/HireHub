import { CompaniesView } from "@/components/dash-components/companies-view";
import { fetchDistinctCompanies } from "data/user";

async function CompaniesPage() {
  const companies = await fetchDistinctCompanies();
  return <CompaniesView companies={companies} />;
}

export default CompaniesPage;
