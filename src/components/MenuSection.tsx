import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Plus, Info, Check } from 'lucide-react';
import { MenuItem, CategoryType, Language } from '../types';
import { MENU_ITEMS } from '../data/menuData';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  lang: Language;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItem,
  onQuickAdd,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelRo: 'Toate (19)', labelEn: 'All (19)', labelIt: 'Tutti (19)' },
    { id: 'panini', labelRo: 'Panini schiacciata', labelEn: 'Schiacciata panini', labelIt: 'Panini schiacciata' },
    { id: 'sandwich', labelRo: 'Sandwichuri & baghete', labelEn: 'Sandwiches & baguettes', labelIt: 'Panini & baguette' },
    { id: 'wrap', labelRo: 'Wraps calde', labelEn: 'Hot wraps', labelIt: 'Wrap caldi' },
    { id: 'sides_drinks', labelRo: 'Garnituri & băuturi', labelEn: 'Sides & drinks', labelIt: 'Contorni & bevande' },
  ];

  const filterTags = [
    { id: 'all', labelRo: 'Toate', labelEn: 'All', labelIt: 'Tutti' },
    { id: 'popular', labelRo: '⭐ Best sellers', labelEn: '⭐ Best sellers', labelIt: '⭐ Più venduti' },
    { id: 'spicy', labelRo: '🌶️ Picant', labelEn: '🌶️ Piccante', labelIt: '🌶️ Piccante' },
    { id: 'chicken', labelRo: '🍗 Pui crocant', labelEn: '🍗 Crispy chicken', labelIt: '🍗 Pollo croccante' },
    { id: 'beef', labelRo: '🥩 Vită smashed', labelEn: '🥩 Smashed beef', labelIt: '🥩 Manzo smashed' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory === 'panini' && item.category !== 'panini') return false;
      if (selectedCategory === 'sandwich' && item.category !== 'sandwich') return false;
      if (selectedCategory === 'wrap' && item.category !== 'wrap') return false;
      if (selectedCategory === 'sides_drinks' && !['sides', 'drinks'].includes(item.category))
        return false;

      // Tag filter
      if (activeFilterTag === 'popular' && !item.isPopular) return false;
      if (activeFilterTag === 'spicy' && !item.isSpicy) return false;
      if (
        activeFilterTag === 'chicken' &&
        !item.name.toLowerCase().includes('pui') &&
        !item.name.toLowerCase().includes('șnițel') &&
        !item.ingredients.some((i) => i.toLowerCase().includes('pui'))
      )
        return false;
      if (
        activeFilterTag === 'beef' &&
        !item.name.toLowerCase().includes('vită') &&
        !item.ingredients.some((i) => i.toLowerCase().includes('vită'))
      )
        return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          item.name.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          (item.nameIt && item.nameIt.toLowerCase().includes(q));
        const matchesDesc =
          item.description.toLowerCase().includes(q) ||
          item.descriptionEn.toLowerCase().includes(q) ||
          (item.descriptionIt && item.descriptionIt.toLowerCase().includes(q));
        const matchesIngredients =
          item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          (item.ingredientsIt && item.ingredientsIt.some((ing) => ing.toLowerCase().includes(q)));
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredients && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedCategory, activeFilterTag, searchQuery]);

  const handleQuickAddClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(item, e);
    setAddedAnimationId(item.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <section id="menu" className="py-12 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C44E36] bg-[#C44E36]/10 mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ro'
              ? 'Meniu Sandwichef 2024 - 2026'
              : lang === 'it'
              ? 'Menu Sandwichef Craiova'
              : 'Sandwichef Menu'}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#241813] tracking-tight mb-2 sm:mb-3">
            {lang === 'ro'
              ? 'Descoperă toate rețetele'
              : lang === 'it'
              ? 'Scopri tutte le nostre ricette'
              : 'Explore all artisan recipes'}
          </h2>
          <p className="text-xs sm:text-base text-[#6B5E55] leading-relaxed px-2">
            {lang === 'ro'
              ? 'Fiecare sandwich este preparat proaspăt la comandă, cu ingrediente cântărite exact și sosuri artizanale.'
              : lang === 'it'
              ? 'Ogni panino viene preparato al momento su ordinazione, con ingredienti accuratamente pesati e salse artigianali.'
              : 'Freshly prepared to order with weighed ingredients and house sauces.'}
          </p>
        </div>

        {/* Search Bar & Quick Dietary Tags - Mobile Optimized */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-col gap-3 bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-[#E7DDCE]">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7E74]" />
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ro'
                  ? 'Caută (gorgonzola, pui, smash, bacon...)'
                  : lang === 'it'
                  ? 'Cerca (mortadella, gorgonzola, pollo, smash...)'
                  : 'Search (gorgonzola, chicken, smash...)'
              }
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E7DDCE] rounded-xl focus:outline-none focus:border-[#C44E36] text-[#241813] placeholder-[#8C7E74] min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 p-1"
                aria-label="Șterge căutarea"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Tag Pills - Smooth Touch Scrolling */}
          <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pb-1">
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                id={`filter-tag-${tag.id}`}
                onClick={() => setActiveFilterTag(tag.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[36px] flex items-center ${
                  activeFilterTag === tag.id
                    ? 'bg-[#241813] text-white shadow-2xs'
                    : 'bg-[#F0EAE1] text-[#4A3B32] hover:bg-[#E4D9CA]'
                }`}
              >
                {lang === 'ro' ? tag.labelRo : lang === 'it' ? tag.labelIt : tag.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs - Mobile Scrollable */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto touch-scroll pb-3 mb-6 sm:mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id as CategoryType)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 min-h-[40px] flex items-center ${
                  isSelected
                    ? 'bg-[#C44E36] text-white shadow-md'
                    : 'bg-white text-[#4A3B32] border border-[#E7DDCE] hover:border-[#C44E36] hover:text-[#C44E36]'
                }`}
              >
                {lang === 'ro' ? cat.labelRo : lang === 'it' ? cat.labelIt : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Results Banner */}
        <div className="flex items-center justify-between text-xs text-[#6B5E55] mb-4 px-1">
          <span>
            {lang === 'ro'
              ? `Afișăm ${filteredItems.length} din ${MENU_ITEMS.length} preparate`
              : lang === 'it'
              ? `Mostrando ${filteredItems.length} di ${MENU_ITEMS.length} piatti`
              : `Showing ${filteredItems.length} of ${MENU_ITEMS.length} dishes`}
          </span>
          {(searchQuery || activeFilterTag !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilterTag('all');
                setSelectedCategory('all');
              }}
              className="text-[#C44E36] font-bold hover:underline cursor-pointer"
            >
              {lang === 'ro' ? 'Resetează filtrele' : lang === 'it' ? 'Azzera filtri' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* Menu Items Grid - Single Column on Mobile, 2 on Tablet, 3 on Desktop */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E7DDCE] max-w-md mx-auto">
            <p className="text-3xl mb-3">🥪</p>
            <h3 className="font-serif text-lg font-bold text-[#241813] mb-2">
              {lang === 'ro' ? 'Nu am găsit preparate' : lang === 'it' ? 'Nessun piatto trovato' : 'No items found'}
            </h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              {lang === 'ro'
                ? 'Încearcă să cauți alt ingredient sau resetează filtrele.'
                : lang === 'it'
                ? 'Prova a cercare un altro ingrediente o azzera i filtri.'
                : 'Try searching for another ingredient or reset filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilterTag('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2.5 bg-[#C44E36] text-white rounded-full text-xs font-bold"
            >
              {lang === 'ro' ? 'Vezi tot meniul' : lang === 'it' ? 'Vedi tutto il menu' : 'View full menu'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const isAdded = addedAnimationId === item.id;
              const isSchiacciata = item.category === 'panini';
              const displayName = lang === 'ro' ? item.name : lang === 'it' ? (item.nameIt || item.name) : item.nameEn;
              const displayDesc = lang === 'ro' ? item.description : lang === 'it' ? (item.descriptionIt || item.description) : item.descriptionEn;
              const displayIngredients =
                lang === 'ro'
                  ? item.ingredients
                  : lang === 'it' && item.ingredientsIt
                  ? item.ingredientsIt
                  : item.ingredientsEn || item.ingredients;

              return (
                <div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md active:scale-[0.99] transition-all duration-200 border border-[#E7DDCE] flex flex-col justify-between cursor-pointer"
                >
                  {/* Top Portion: Image & Badges */}
                  <div>
                    <div className="relative h-44 sm:h-56 overflow-hidden bg-[#F0EAE1]">
                      <img
                        src={item.image}
                        alt={displayName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://sandwichef.vercel.app/${item.image.replace(/^\//, '')}`;
                        }}
                      />
                      {/* Weight pill */}
                      <div className="absolute top-2.5 right-2.5 bg-[#241813]/85 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs tracking-wide">
                        {item.weight} G
                      </div>

                      {/* Highlight badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {isSchiacciata && (
                          <span className="bg-[#C44E36] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                            Schiacciata 180g
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="bg-[#F0BE2C] text-[#241813] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                            {lang === 'ro' ? '⭐ Best seller' : lang === 'it' ? '⭐ Più venduto' : '⭐ Best seller'}
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                            {lang === 'ro' ? '🌶️ Picant' : lang === 'it' ? '🌶️ Piccante' : '🌶️ Spicy'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 sm:p-5">
                      {/* Title & Price Header */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241813] group-hover:text-[#C44E36] transition-colors leading-tight">
                          {item.number}. {displayName}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-lg sm:text-xl text-[#C44E36] whitespace-nowrap">
                            {item.price} RON
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#6B5E55] line-clamp-2 leading-relaxed mb-3">
                        {displayDesc}
                      </p>

                      {/* Ingredients chips */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {displayIngredients.slice(0, 4).map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-[#F5EFE6] text-[#4A3B32] text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#E5DACB]"
                          >
                            {ing}
                          </span>
                        ))}
                        {displayIngredients.length > 4 && (
                          <span className="text-[10px] sm:text-[11px] text-[#8C7E74] font-medium self-center pl-1">
                            +{displayIngredients.length - 4} {lang === 'ro' ? 'altele' : lang === 'it' ? 'altri' : 'more'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer - Mobile Thumb Targets */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto flex items-center gap-2">
                    <button
                      id={`details-btn-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="flex-1 py-2.5 px-3 bg-[#FAF7F2] hover:bg-[#F0EAE1] active:bg-[#E4D9CA] text-[#241813] border border-[#E7DDCE] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <Info className="w-3.5 h-3.5 text-[#8C7E74]" />
                      <span>{lang === 'ro' ? 'Opțiuni' : lang === 'it' ? 'Dettagli' : 'Details'}</span>
                    </button>

                    <button
                      id={`quick-add-${item.id}`}
                      onClick={(e) => handleQuickAddClick(item, e)}
                      className={`py-2.5 px-4 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs min-h-[44px] shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#C44E36] hover:bg-[#A63B25] text-white active:scale-95'
                      }`}
                      title={lang === 'ro' ? 'Adaugă rapid în coș' : lang === 'it' ? 'Aggiungi al carrello' : 'Quick add to cart'}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ro' ? 'Adăugat!' : lang === 'it' ? 'Aggiunto!' : 'Added!'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{lang === 'ro' ? 'Adaugă' : lang === 'it' ? 'Aggiungi' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
