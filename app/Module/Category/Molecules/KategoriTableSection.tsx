import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { HistoryButton } from "../../Common/Components/Molecules/HistoryButton";
import { Pagination } from "../../Common/Components/Molecules/Pagination";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { useCategoryContext } from "../Context/CategoryProvider";
import { CategoryTable } from "../Organisms/CategoryTable";

interface Props {
  onOpenFilter: () => void;
  openDelete: (item: any) => void;
  openForceDelete: (item: any) => void;
}

export function KategoriTableSection({
  onOpenFilter,
  openDelete,
  openForceDelete,
}: Props) {
  const {
    state,
    current,
    setCurrent,
    setQuery,
    filterCount,
    query,
    toggleFlag,
  } = useCategoryContext();

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
            <HistoryButton
              onClick={() => {
                console.log("ganti flag");
                toggleFlag();
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <CategoryTable
          data={state.data}
          loading={state.loading}
          openDelete={openDelete}
          openForceDelete={openForceDelete}
        />
      </div>

      <div className="p-4 md:p-8 bg-surface-container-low/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-surface-container">
        <Pagination
            currentPage={query.page}
            totalPages={
              state.total < 0 ? 1 : Math.ceil(state.total / query.limit)
            }
            totalItems={state.total}
            showing={query.limit}
            onChange={(page) => setQuery((prev: any) => ({ ...prev, page }))}
          />
      </div>
    </section>
  );
}
