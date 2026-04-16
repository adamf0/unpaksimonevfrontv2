import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { HistoryButton } from "../../Common/Components/Molecules/HistoryButton";
import { Pagination } from "../../Common/Components/Molecules/Pagination";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { useCategoryContext } from "../Context/CategoryProvider";
import { CategoryTable } from "../Organisms/CategoryTable";

interface Props {
  onOpenFilter: () => void;
}

export function KategoriTableSection({ onOpenFilter }: Props) {
  const { state, current, setCurrent, setQuery, filterCount, query } = useCategoryContext();

  return (
    <section className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden">
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-xl font-bold font-headline">Kategori Overview</h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <SearchInput
              placeholder="Global search..."
              onChange={(val) =>
                setQuery((prev: any) => ({
                  ...prev,
                  search: val,
                  page: 1,
                }))
              }
            />

            <FilterButton count={filterCount(query)} onClick={onOpenFilter} />
            <HistoryButton/>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <CategoryTable data={state.data} loading={state.loading} />
      </div>

      <div className="p-4 md:p-8 bg-surface-container-low/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-surface-container">
        <Pagination
          currentPage={current}
          totalPages={13}
          totalItems={124}
          showing={2}
          onChange={(page) => setCurrent(page)}
        />
      </div>
    </section>
  );
}
