import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productAPI } from "../api/api";
import { FiChevronDown, FiChevronUp, FiPlus, FiMinus } from "react-icons/fi";

const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [selectedCaffeine, setSelectedCaffeine] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Expanded filter sections
  const [expanded, setExpanded] = useState({
    collections: true, origin: false, flavor: false, qualities: false, caffeine: false, allergens: false,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await productAPI.getFilters();
        setFilterOptions(data.filters);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedOrigins, selectedFlavors, selectedQualities, selectedCaffeine, selectedAllergens, organicOnly, sortBy, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const page = searchParams.get("page") || 1;
      const params = { page, limit: 9, sort: sortBy };
      if (selectedCategories.length) params.category = selectedCategories;
      if (selectedOrigins.length) params.origin = selectedOrigins;
      if (selectedFlavors.length) params.flavor = selectedFlavors;
      if (selectedQualities.length) params.qualities = selectedQualities;
      if (selectedCaffeine.length) params.caffeine = selectedCaffeine;
      if (selectedAllergens.length) params.allergens = selectedAllergens;
      if (organicOnly) params.organic = "true";

      const { data } = await productAPI.getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleFilter = (list, setList, value) => {
    setList((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
    setSearchParams({ page: "1" });
  };

  const toggleSection = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const goToPage = (p) => {
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterSection = ({ title, sectionKey, options, selected, setSelected }) => (
    <div className="border-b border-gray-100 py-3">
      <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between py-1 text-left">
        <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">{title}</span>
        {expanded[sectionKey] ? <FiMinus size={14} className="text-gray-500" /> : <FiPlus size={14} className="text-gray-500" />}
      </button>
      {expanded[sectionKey] && (
        <div className="mt-2 space-y-1.5 max-h-[200px] overflow-y-auto">
          {options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleFilter(selected, setSelected, opt)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 accent-gray-900"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const breadcrumbCategory = selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : "ALL";

  return (
    <div>
      {/* Banner */}
      <div className="h-[200px] md:h-[280px] bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=1400&h=300&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-24">
        {/* Breadcrumb */}
        <div className="mb-6">
          <span className="text-xs text-gray-500 tracking-wider">
            <Link to="/" className="hover:text-gray-900 no-underline text-gray-500">HOME</Link>
            {" / "}
            <Link to="/collections" className="hover:text-gray-900 no-underline text-gray-500">COLLECTIONS</Link>
            {" / "}
            <span className="text-gray-900">{breadcrumbCategory}</span>
          </span>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-[200px] shrink-0">
            <FilterSection title="Collections" sectionKey="collections" options={filterOptions.categories} selected={selectedCategories} setSelected={setSelectedCategories} />
            <FilterSection title="Origin" sectionKey="origin" options={filterOptions.origins} selected={selectedOrigins} setSelected={setSelectedOrigins} />
            <FilterSection title="Flavour" sectionKey="flavor" options={filterOptions.flavors} selected={selectedFlavors} setSelected={setSelectedFlavors} />
            <FilterSection title="Qualities" sectionKey="qualities" options={filterOptions.qualities} selected={selectedQualities} setSelected={setSelectedQualities} />
            <FilterSection title="Caffeine" sectionKey="caffeine" options={filterOptions.caffeines} selected={selectedCaffeine} setSelected={setSelectedCaffeine} />
            <FilterSection title="Allergens" sectionKey="allergens" options={filterOptions.allergens} selected={selectedAllergens} setSelected={setSelectedAllergens} />

            <div className="py-3 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wider text-gray-900">ORGANIC</span>
              <button
                onClick={() => { setOrganicOnly(!organicOnly); setSearchParams({ page: "1" }); }}
                className={`w-10 h-5 rounded-full transition-colors relative ${organicOnly ? "bg-gray-900" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${organicOnly ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden fixed bottom-4 left-4 z-40 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium"
          >
            Filters
          </button>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-500 text-2xl">&times;</button>
              </div>
              <FilterSection title="Collections" sectionKey="collections" options={filterOptions.categories} selected={selectedCategories} setSelected={setSelectedCategories} />
              <FilterSection title="Origin" sectionKey="origin" options={filterOptions.origins} selected={selectedOrigins} setSelected={setSelectedOrigins} />
              <FilterSection title="Flavour" sectionKey="flavor" options={filterOptions.flavors} selected={selectedFlavors} setSelected={setSelectedFlavors} />
              <FilterSection title="Qualities" sectionKey="qualities" options={filterOptions.qualities} selected={selectedQualities} setSelected={setSelectedQualities} />
              <FilterSection title="Caffeine" sectionKey="caffeine" options={filterOptions.caffeines} selected={selectedCaffeine} setSelected={setSelectedCaffeine} />
              <FilterSection title="Allergens" sectionKey="allergens" options={filterOptions.allergens} selected={selectedAllergens} setSelected={setSelectedAllergens} />
              <div className="py-3 flex items-center justify-between">
                <span className="text-sm font-semibold">ORGANIC</span>
                <button onClick={() => setOrganicOnly(!organicOnly)} className={`w-10 h-5 rounded-full transition-colors relative ${organicOnly ? "bg-gray-900" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${organicOnly ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-4 bg-gray-900 text-white py-3 font-semibold">Apply Filters</button>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 lg:pl-8">
            {/* Sort */}
            <div className="flex justify-end mb-6 relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-sm tracking-wider text-gray-700 hover:text-gray-900"
              >
                SORT BY <FiChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-lg py-1 z-20 min-w-[180px]">
                  {[
                    { label: "Newest", value: "newest" },
                    { label: "Price: Low to High", value: "price_asc" },
                    { label: "Price: High to Low", value: "price_desc" },
                    { label: "Name: A-Z", value: "name_asc" },
                    { label: "Top Rated", value: "rating" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === opt.value ? "font-bold text-gray-900" : "text-gray-600"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-[200px] md:h-[260px] rounded" />
                    <div className="mt-3 space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4 mx-auto" />
                      <div className="bg-gray-200 h-4 rounded w-1/2 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group no-underline">
                      <div className="overflow-hidden rounded-sm bg-gray-50">
                        <img
                          src={product.images?.[0] || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop"}
                          alt={product.name}
                          className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="text-center mt-3">
                        <p className="text-sm font-medium text-gray-900 leading-tight">{product.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-bold">€{product.price.toFixed(2)}</span>
                          <span className="text-gray-400"> / 50 g</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-8 h-8 text-sm rounded ${p === pagination.page ? "bg-gray-900 text-white" : "border border-gray-300 hover:bg-gray-50"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
