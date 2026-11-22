import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Database,
  ExternalLink,
  LogOut,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { getPaApiStatus } from '../lib/affiliate';
import { signInWithGoogle, signOutUser } from '../lib/firebase';
import { usePageSeo } from '../lib/seo';
import { Article, ArticleSection } from '../types/article';
import { CategorySlug, Product, ProductReview } from '../types/product';

type AdminTab = 'overview' | 'products' | 'reviews' | 'articles' | 'inbox';

const STUDIO_IMAGES = [
  {
    label: 'Workspace Hero',
    path: '/src/assets/images/hero_tech_workspace_1795317155650.jpg',
  },
  {
    label: 'Computer Accessories',
    path: '/src/assets/images/prod_computer_accessories_1795317157440.jpg',
  },
  {
    label: 'Networking Equipment',
    path: '/src/assets/images/prod_networking_gear_1795317158228.jpg',
  },
  {
    label: 'PC Hardware & Storage',
    path: '/src/assets/images/prod_pc_hardware_1795317157419.jpg',
  },
  {
    label: 'IT Technician Tools',
    path: '/src/assets/images/prod_it_tools_1795317158619.jpg',
  },
  {
    label: 'Desk & Docking Stations',
    path: '/src/assets/images/prod_desk_docking_1795317158393.jpg',
  },
];

const DEFAULT_CATEGORY_OPTIONS: { slug: CategorySlug; name: string }[] = [
  { slug: 'computer-accessories', name: 'Computer Accessories' },
  { slug: 'networking-equipment', name: 'Networking Equipment' },
  { slug: 'pc-hardware', name: 'PC Hardware & Upgrades' },
  { slug: 'it-technician-tools', name: 'IT Technician Tools' },
  { slug: 'desk-productivity', name: 'Desk & Productivity' },
  { slug: 'tech-gadgets', name: 'Tech Gadgets' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatFirestoreTimestamp(ts: unknown): string {
  if (!ts) return 'Just now';
  if (
    typeof ts === 'object' &&
    ts !== null &&
    'toDate' in ts &&
    typeof (ts as { toDate: () => Date }).toDate === 'function'
  ) {
    return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return 'Recorded';
}

export function AdminPage() {
  const {
    loading,
    authReady,
    user,
    isAdmin,
    categories,
    products,
    reviews,
    comparisons,
    guides,
    articles,
    subscribers,
    inquiries,
    saveProduct,
    deleteProduct,
    saveReview,
    deleteReview,
    saveArticle,
    deleteArticle,
    updateInquiryStatus,
    deleteSubscriber,
    importStarterCatalog,
  } = useCatalog();

  usePageSeo({
    title: 'Admin Editorial CMS',
    description: 'Manage TechGear Picks products, hardware reviews, articles, and editorial inbox.',
    canonicalPath: '/admin',
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState<CategorySlug>('computer-accessories');
  const [pSubcategory, setPSubcategory] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState(STUDIO_IMAGES[1].path);
  const [pImageAlt, setPImageAlt] = useState('');
  const [pAmazonUrl, setPAmazonUrl] = useState('https://www.amazon.com/dp/');
  const [pAsin, setPAsin] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pRating, setPRating] = useState('');
  const [pAvailability, setPAvailability] = useState<Product['availability']>('Widely Available');
  const [pFeatured, setPFeatured] = useState(false);
  const [pSpecsText, setPSpecsText] = useState('');
  const [pFeaturesText, setPFeaturesText] = useState('');
  const [pProsText, setPProsText] = useState('');
  const [pConsText, setPConsText] = useState('');
  const [pKeywordsText, setPKeywordsText] = useState('');

  // Review Form State
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rProductId, setRProductId] = useState('');
  const [rTitle, setRTitle] = useState('');
  const [rSlug, setRSlug] = useState('');
  const [rSummary, setRSummary] = useState('');
  const [rIntroduction, setRIntroduction] = useState('');
  const [rPerformance, setRPerformance] = useState('');
  const [rBestUseCases, setRBestUseCases] = useState('');
  const [rWhoShouldBuy, setRWhoShouldBuy] = useState('');
  const [rWhoShouldAvoid, setRWhoShouldAvoid] = useState('');
  const [rVerdict, setRVerdict] = useState('');
  const [rAuthorName, setRAuthorName] = useState('TechGear Editorial Desk');
  const [rAuthorRole, setRAuthorRole] = useState('Hardware Research Analyst');
  const [rReadingTime, setRReadingTime] = useState('6');

  // Article Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [aTitle, setATitle] = useState('');
  const [aSlug, setASlug] = useState('');
  const [aCategorySlug, setACategorySlug] = useState<CategorySlug>('pc-hardware');
  const [aExcerpt, setAExcerpt] = useState('');
  const [aImage, setAImage] = useState(STUDIO_IMAGES[3].path);
  const [aImageAlt, setAImageAlt] = useState('');
  const [aFeatured, setAFeatured] = useState(false);
  const [aReadingTime, setAReadingTime] = useState('6');
  const [aAuthorName, setAAuthorName] = useState('TechGear Editorial Desk');
  const [aAuthorRole, setAAuthorRole] = useState('Senior Hardware Editor');
  const [aAuthorBio, setAAuthorBio] = useState(
    'Covers workstation hardware architecture, storage standards, and practical networking infrastructure.',
  );
  const [aSectionHeading, setASectionHeading] = useState('Technical Overview');
  const [aSectionBody, setASectionBody] = useState('');
  const [aSectionBullets, setASectionBullets] = useState('');

  const categoryChoices = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((c) => ({ slug: c.slug, name: c.name }));
    }
    return DEFAULT_CATEGORY_OPTIONS;
  }, [categories]);

  const paApiStatus = getPaApiStatus();

  const clearAlerts = () => {
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleSignIn = async () => {
    clearAlerts();
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Google sign-in could not be completed.');
    }
  };

  const handleSignOut = async () => {
    clearAlerts();
    await signOutUser();
  };

  const handleImportStarter = async () => {
    clearAlerts();
    setBusyAction(true);
    try {
      await importStarterCatalog();
      setStatusMessage(
        'Starter hardware catalog imported into Cloud Firestore (categories, products, reviews, comparisons, guides, and articles).',
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to import starter catalog.');
    } finally {
      setBusyAction(false);
    }
  };

  // Product Form Helpers
  const openNewProductForm = () => {
    clearAlerts();
    setEditingProductId(null);
    setPName('');
    setPSlug('');
    setPBrand('');
    setPCategory('computer-accessories');
    setPSubcategory('Keyboards');
    setPDescription('');
    setPImage(STUDIO_IMAGES[1].path);
    setPImageAlt('');
    setPAmazonUrl('https://www.amazon.com/dp/');
    setPAsin('');
    setPPrice('');
    setPRating('');
    setPAvailability('Widely Available');
    setPFeatured(false);
    setPSpecsText('Interface: USB-C\nWarranty: 2 Years');
    setPFeaturesText('');
    setPProsText('');
    setPConsText('');
    setPKeywordsText('');
    setShowProductForm(true);
  };

  const openEditProductForm = (product: Product) => {
    clearAlerts();
    setEditingProductId(product.id);
    setPName(product.name);
    setPSlug(product.slug);
    setPBrand(product.brand);
    setPCategory(product.category);
    setPSubcategory(product.subcategory);
    setPDescription(product.description);
    setPImage(product.image);
    setPImageAlt(product.imageAlt);
    setPAmazonUrl(product.amazonUrl);
    setPAsin(product.amazonAsin || '');
    setPPrice(typeof product.price === 'number' ? String(product.price) : '');
    setPRating(typeof product.rating === 'number' ? String(product.rating) : '');
    setPAvailability(product.availability);
    setPFeatured(product.featured);
    setPSpecsText(product.specifications.map((s) => `${s.label}: ${s.value}`).join('\n'));
    setPFeaturesText(product.features.join('\n'));
    setPProsText(product.pros.join('\n'));
    setPConsText(product.cons.join('\n'));
    setPKeywordsText(product.keywords.join(', '));
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    clearAlerts();

    const finalSlug = slugify(pSlug || pName);
    if (finalSlug.length < 2 || pName.trim().length < 2 || pBrand.trim().length < 1) {
      setErrorMessage('Product name, slug, and brand are required.');
      return;
    }
    if (pDescription.trim().length < 10) {
      setErrorMessage('Description must be at least 10 characters.');
      return;
    }
    if (pAmazonUrl.trim().length < 8) {
      setErrorMessage('Please enter a valid Amazon product URL.');
      return;
    }

    const matchedCat = categoryChoices.find((c) => c.slug === pCategory);
    const parsedSpecs = pSpecsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return { label: 'Spec', value: line };
        return {
          label: line.slice(0, idx).trim() || 'Spec',
          value: line.slice(idx + 1).trim() || '-',
        };
      });

    const splitLines = (raw: string) =>
      raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    const parsedPrice = pPrice.trim() ? Number(pPrice.trim()) : undefined;
    const parsedRating = pRating.trim() ? Number(pRating.trim()) : undefined;

    if (parsedPrice !== undefined && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
      setErrorMessage('Price must be a positive number or left blank.');
      return;
    }
    if (parsedRating !== undefined && (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5)) {
      setErrorMessage('Rating must be between 0 and 5 or left blank.');
      return;
    }

    const existing = editingProductId ? products.find((p) => p.id === editingProductId) : undefined;
    const payload: Product = {
      id: editingProductId || `prod-${finalSlug}`,
      slug: finalSlug,
      name: pName.trim(),
      brand: pBrand.trim(),
      category: pCategory,
      categoryName: matchedCat?.name || pCategory,
      subcategory: pSubcategory.trim() || 'General Hardware',
      description: pDescription.trim(),
      image: pImage.trim() || STUDIO_IMAGES[0].path,
      imageAlt: pImageAlt.trim() || `${pName.trim()} product view`,
      currency: 'USD',
      amazonUrl: pAmazonUrl.trim(),
      affiliateUrl: pAmazonUrl.trim(),
      amazonAsin: pAsin.trim() || undefined,
      price: parsedPrice,
      rating: parsedRating,
      specifications: parsedSpecs,
      features: splitLines(pFeaturesText),
      pros: splitLines(pProsText),
      cons: splitLines(pConsText),
      availability: pAvailability,
      featured: pFeatured,
      publicationDate: existing?.publicationDate || todayIso(),
      keywords: pKeywordsText
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    };

    setBusyAction(true);
    try {
      await saveProduct(payload, !editingProductId);
      setShowProductForm(false);
      setStatusMessage(editingProductId ? `Updated "${payload.name}".` : `Created "${payload.name}".`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setBusyAction(false);
    }
  };

  // Review Form Helpers
  const openNewReviewForm = () => {
    clearAlerts();
    setEditingReviewId(null);
    setRProductId(products[0]?.id || '');
    setRTitle('');
    setRSlug('');
    setRSummary('');
    setRIntroduction('');
    setRPerformance('');
    setRBestUseCases('');
    setRWhoShouldBuy('');
    setRWhoShouldAvoid('');
    setRVerdict('');
    setRAuthorName('TechGear Editorial Desk');
    setRAuthorRole('Hardware Research Analyst');
    setRReadingTime('6');
    setShowReviewForm(true);
  };

  const openEditReviewForm = (review: ProductReview) => {
    clearAlerts();
    setEditingReviewId(review.id);
    setRProductId(review.productId);
    setRTitle(review.title);
    setRSlug(review.slug);
    setRSummary(review.summary);
    setRIntroduction(review.introduction);
    setRPerformance(review.performanceOverview);
    setRBestUseCases(review.bestUseCases.join('\n'));
    setRWhoShouldBuy(review.whoShouldBuy.join('\n'));
    setRWhoShouldAvoid(review.whoShouldAvoid.join('\n'));
    setRVerdict(review.finalVerdict);
    setRAuthorName(review.authorName);
    setRAuthorRole(review.authorRole);
    setRReadingTime(String(review.readingTimeMinutes));
    setShowReviewForm(true);
  };

  const handleSaveReview = async (e: FormEvent) => {
    e.preventDefault();
    clearAlerts();
    const finalSlug = slugify(rSlug || rTitle);

    if (!rProductId) {
      setErrorMessage('Select an existing product in Firestore before saving a review.');
      return;
    }
    if (
      rTitle.trim().length < 5 ||
      rSummary.trim().length < 10 ||
      rIntroduction.trim().length < 10 ||
      rPerformance.trim().length < 10 ||
      rVerdict.trim().length < 10
    ) {
      setErrorMessage('Title (5+ chars), summary, introduction, performance overview, and verdict (10+ chars each) are required.');
      return;
    }

    const splitLines = (raw: string) =>
      raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    const existing = editingReviewId ? reviews.find((r) => r.id === editingReviewId) : undefined;
    const payload: ProductReview = {
      id: editingReviewId || `rev-${finalSlug}`,
      slug: finalSlug,
      productId: rProductId,
      title: rTitle.trim(),
      methodologyLabel: 'Research-Based Technical Analysis',
      summary: rSummary.trim(),
      introduction: rIntroduction.trim(),
      performanceOverview: rPerformance.trim(),
      bestUseCases: splitLines(rBestUseCases),
      whoShouldBuy: splitLines(rWhoShouldBuy),
      whoShouldAvoid: splitLines(rWhoShouldAvoid),
      alternativeSlugs: existing?.alternativeSlugs || [],
      finalVerdict: rVerdict.trim(),
      authorName: rAuthorName.trim() || 'TechGear Editorial Desk',
      authorRole: rAuthorRole.trim() || 'Hardware Research Analyst',
      publishedAt: existing?.publishedAt || todayIso(),
      updatedAt: todayIso(),
      readingTimeMinutes: Math.max(1, Number(rReadingTime) || 6),
    };

    setBusyAction(true);
    try {
      await saveReview(payload, !editingReviewId);
      setShowReviewForm(false);
      setStatusMessage(editingReviewId ? `Updated review "${payload.title}".` : `Published review "${payload.title}".`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save review.');
    } finally {
      setBusyAction(false);
    }
  };

  // Article Form Helpers
  const openNewArticleForm = () => {
    clearAlerts();
    setEditingArticleId(null);
    setATitle('');
    setASlug('');
    setACategorySlug('pc-hardware');
    setAExcerpt('');
    setAImage(STUDIO_IMAGES[3].path);
    setAImageAlt('');
    setAFeatured(false);
    setAReadingTime('6');
    setAAuthorName('TechGear Editorial Desk');
    setAAuthorRole('Senior Hardware Editor');
    setAAuthorBio('Covers workstation hardware architecture, storage standards, and practical networking infrastructure.');
    setASectionHeading('Technical Overview');
    setASectionBody('');
    setASectionBullets('');
    setShowArticleForm(true);
  };

  const openEditArticleForm = (article: Article) => {
    clearAlerts();
    setEditingArticleId(article.id);
    setATitle(article.title);
    setASlug(article.slug);
    setACategorySlug(article.categorySlug);
    setAExcerpt(article.excerpt);
    setAImage(article.image);
    setAImageAlt(article.imageAlt);
    setAFeatured(article.featured);
    setAReadingTime(String(article.readingTimeMinutes));
    setAAuthorName(article.author.name);
    setAAuthorRole(article.author.role);
    setAAuthorBio(article.author.bio);
    const firstSec = article.sections[0];
    setASectionHeading(firstSec?.heading || 'Technical Overview');
    setASectionBody(firstSec?.paragraphs.join('\n\n') || '');
    setASectionBullets(firstSec?.bulletPoints?.join('\n') || '');
    setShowArticleForm(true);
  };

  const handleSaveArticle = async (e: FormEvent) => {
    e.preventDefault();
    clearAlerts();
    const finalSlug = slugify(aSlug || aTitle);
    if (aTitle.trim().length < 5 || aExcerpt.trim().length < 10) {
      setErrorMessage('Article title (5+ chars) and excerpt (10+ chars) are required.');
      return;
    }

    const matchedCat = categoryChoices.find((c) => c.slug === aCategorySlug);
    const existing = editingArticleId ? articles.find((a) => a.id === editingArticleId) : undefined;
    const paragraphs = aSectionBody
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const bullets = aSectionBullets
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const firstSection: ArticleSection = {
      id: 'section-1',
      heading: aSectionHeading.trim() || 'Technical Overview',
      paragraphs: paragraphs.length > 0 ? paragraphs : [aExcerpt.trim()],
      ...(bullets.length > 0 ? { bulletPoints: bullets } : {}),
    };

    const remainingSections = existing && existing.sections.length > 1 ? existing.sections.slice(1) : [];
    const allSections = [firstSection, ...remainingSections];

    const payload: Article = {
      id: editingArticleId || `art-${finalSlug}`,
      slug: finalSlug,
      title: aTitle.trim(),
      excerpt: aExcerpt.trim(),
      category: matchedCat?.name || aCategorySlug,
      categorySlug: aCategorySlug,
      publishedAt: existing?.publishedAt || todayIso(),
      updatedAt: todayIso(),
      readingTimeMinutes: Math.max(1, Number(aReadingTime) || 6),
      featured: aFeatured,
      image: aImage.trim() || STUDIO_IMAGES[0].path,
      imageAlt: aImageAlt.trim() || `${aTitle.trim()} editorial cover`,
      author: {
        name: aAuthorName.trim() || 'TechGear Editorial Desk',
        role: aAuthorRole.trim() || 'Senior Hardware Editor',
        bio: aAuthorBio.trim() || 'Hardware research and buying guide editorial contributor.',
      },
      tableOfContents: allSections.map((s) => ({ id: s.id, title: s.heading })),
      sections: allSections,
      relatedSlugs: existing?.relatedSlugs || [],
    };

    setBusyAction(true);
    try {
      await saveArticle(payload, !editingArticleId);
      setShowArticleForm(false);
      setStatusMessage(editingArticleId ? `Updated article "${payload.title}".` : `Published article "${payload.title}".`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save article.');
    } finally {
      setBusyAction(false);
    }
  };

  const handleConfirmDelete = async (type: 'product' | 'review' | 'article' | 'subscriber', id: string) => {
    clearAlerts();
    setBusyAction(true);
    try {
      if (type === 'product') await deleteProduct(id);
      if (type === 'review') await deleteReview(id);
      if (type === 'article') await deleteArticle(id);
      if (type === 'subscriber') await deleteSubscriber(id);
      setConfirmDeleteId(null);
      setStatusMessage('Record deleted from Cloud Firestore.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete record.');
    } finally {
      setBusyAction(false);
    }
  };

  if (!authReady) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-10 space-y-3">
          <p className="font-display text-lg font-semibold text-slate-900">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Editorial CMS
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Sign in to TechGear Picks Admin
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Manage the live Cloud Firestore hardware catalog, publish reviews and articles, bootstrap starter data, and review contact inquiries.
            </p>
          </div>

          {errorMessage && (
            <p role="alert" className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors min-h-[46px]"
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Sign in with Google</span>
          </button>

          <p className="text-xs text-slate-500">
            Administrator access is restricted to verified editorial accounts configured in Firestore Security Rules.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Administrator Access Required
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              You are signed in as <strong className="text-slate-900">{user.email}</strong>, which does not have editorial administrator permissions on this site.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Live Cloud Firestore CMS
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            TechGear Picks Editorial Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Signed in as <span className="font-mono text-slate-800">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busyAction}
            onClick={handleImportStarter}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors min-h-[40px]"
          >
            <Database className="w-4 h-4" aria-hidden="true" />
            <span>{busyAction ? 'Working...' : 'Import Starter Catalog'}</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[40px]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Status & Error Banners */}
      {statusMessage && (
        <div
          role="status"
          className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div
          role="alert"
          className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm"
        >
          {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <nav aria-label="Admin sections" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
            { id: 'articles', label: `Articles (${articles.length})` },
            { id: 'inbox', label: `Inbox (${inquiries.length + subscribers.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              clearAlerts();
              setConfirmDeleteId(null);
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors min-h-[40px] ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Products
              </p>
              <p className="font-display text-3xl font-bold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : products.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">{categories.length} categories</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Reviews
              </p>
              <p className="font-display text-3xl font-bold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : reviews.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Research-based analyses</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Editorial &amp; Guides
              </p>
              <p className="font-display text-3xl font-bold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : articles.length + guides.length + comparisons.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {articles.length} articles · {guides.length} guides · {comparisons.length} matchups
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Audience Inbox
              </p>
              <p className="font-display text-3xl font-bold text-slate-900 mt-1 tabular-nums">
                {inquiries.length + subscribers.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {inquiries.filter((i) => i.status === 'new').length} unread inquiries ·{' '}
                {subscribers.length} subscribers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Database Bootstrap &amp; Seeding
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Public pages read exclusively from Cloud Firestore. On a fresh database, use the Starter Catalog import to populate verified hardware listings, categories, technical reviews, comparisons, buying guides, and articles in two atomic batches.
              </p>
              <button
                type="button"
                disabled={busyAction}
                onClick={handleImportStarter}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 disabled:opacity-60 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" aria-hidden="true" />
                <span>{busyAction ? 'Importing...' : 'Import Initial Hardware Catalog'}</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Amazon Associates Configuration
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100">
                  <dt className="text-slate-500">Associate Tag (VITE_AMAZON_ASSOCIATE_TAG)</dt>
                  <dd className="font-mono text-slate-900">{paApiStatus.partnerTag}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100">
                  <dt className="text-slate-500">Marketplace</dt>
                  <dd className="font-mono text-slate-900">{paApiStatus.marketplace}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5">
                  <dt className="text-slate-500">PA-API Server Sync</dt>
                  <dd className="font-mono text-slate-900">
                    {paApiStatus.credentialsConfigured ? 'Active' : 'Manual / Firestore Managed'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Product Directory</h2>
            <button
              type="button"
              onClick={openNewProductForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[40px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Product</span>
            </button>
          </div>

          {showProductForm && (
            <form
              onSubmit={handleSaveProduct}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <h3 className="font-display text-lg font-bold text-slate-900">
                {editingProductId ? 'Edit Product' : 'New Product'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => {
                      setPName(e.target.value);
                      if (!editingProductId) setPSlug(slugify(e.target.value));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={pSlug}
                    onChange={(e) => setPSlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as CategorySlug)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {categoryChoices.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subcategory *
                  </label>
                  <input
                    type="text"
                    required
                    value={pSubcategory}
                    onChange={(e) => setPSubcategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={pAvailability}
                    onChange={(e) => setPAvailability(e.target.value as Product['availability'])}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Widely Available">Widely Available</option>
                    <option value="Check Availability">Check Availability</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amazon Product / Affiliate URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={pAmazonUrl}
                    onChange={(e) => setPAmazonUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amazon ASIN (optional)
                  </label>
                  <input
                    type="text"
                    value={pAsin}
                    onChange={(e) => setPAsin(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Verified Price USD (leave blank if dynamic)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sourced Rating 0-5 (leave blank if unverified)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={pRating}
                    onChange={(e) => setPRating(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image Asset Preset
                  </label>
                  <select
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {STUDIO_IMAGES.map((img) => (
                      <option key={img.path} value={img.path}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={pImageAlt}
                    onChange={(e) => setPImageAlt(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description (10+ characters) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specifications (Label: Value per line)
                  </label>
                  <textarea
                    rows={4}
                    value={pSpecsText}
                    onChange={(e) => setPSpecsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Features (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={pFeaturesText}
                    onChange={(e) => setPFeaturesText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pros (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={pProsText}
                    onChange={(e) => setPProsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cons / Trade-offs (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={pConsText}
                    onChange={(e) => setPConsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Feature in Homepage Top Picks</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busyAction}
                    className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 disabled:opacity-60 rounded-lg"
                  >
                    {busyAction ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {products.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No products in Firestore yet. Click “Add Product” or “Import Starter Catalog”.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-blue-600">{product.categoryName}</span>
                        <span className="mx-1.5">·</span>
                        <span>{product.brand}</span>
                        {product.featured && (
                          <>
                            <span className="mx-1.5">·</span>
                            <span className="font-semibold text-slate-800">Featured</span>
                          </>
                        )}
                      </p>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">/{product.slug}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditProductForm(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      {confirmDeleteId === product.id ? (
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => handleConfirmDelete('product', product.id)}
                          className="px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                        >
                          Confirm Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(product.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Hardware Reviews</h2>
            <button
              type="button"
              disabled={products.length === 0}
              onClick={openNewReviewForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors min-h-[40px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Review</span>
            </button>
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleSaveReview}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <h3 className="font-display text-lg font-bold text-slate-900">
                {editingReviewId ? 'Edit Hardware Review' : 'New Hardware Review'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Linked Product *
                  </label>
                  <select
                    required
                    value={rProductId}
                    onChange={(e) => setRProductId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={rReadingTime}
                    onChange={(e) => setRReadingTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={rTitle}
                    onChange={(e) => {
                      setRTitle(e.target.value);
                      if (!editingReviewId) setRSlug(slugify(e.target.value));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={rSlug}
                    onChange={(e) => setRSlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={rAuthorName}
                    onChange={(e) => setRAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={rAuthorRole}
                    onChange={(e) => setRAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary (10+ characters) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={rSummary}
                  onChange={(e) => setRSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Introduction (10+ characters) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rIntroduction}
                  onChange={(e) => setRIntroduction(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Performance &amp; Architecture Overview (10+ characters) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rPerformance}
                  onChange={(e) => setRPerformance(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Best Use Cases (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={rBestUseCases}
                    onChange={(e) => setRBestUseCases(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Who Should Buy (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={rWhoShouldBuy}
                    onChange={(e) => setRWhoShouldBuy(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Who Should Avoid (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={rWhoShouldAvoid}
                    onChange={(e) => setRWhoShouldAvoid(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Final Verdict (10+ characters) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={rVerdict}
                  onChange={(e) => setRVerdict(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyAction}
                  className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 disabled:opacity-60 rounded-lg"
                >
                  {busyAction ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No reviews published yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {reviews.map((review) => {
                  const prod = products.find((p) => p.id === review.productId);
                  return (
                    <div
                      key={review.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold text-blue-600">
                            {review.methodologyLabel}
                          </span>
                          {prod && (
                            <>
                              <span className="mx-1.5">·</span>
                              <span>{prod.name}</span>
                            </>
                          )}
                        </p>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {review.title}
                        </h3>
                        <p className="text-xs text-slate-500">Updated {review.updatedAt}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/reviews/${review.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>View</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditReviewForm(review)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>
                        {confirmDeleteId === review.id ? (
                          <button
                            type="button"
                            disabled={busyAction}
                            onClick={() => handleConfirmDelete('review', review.id)}
                            className="px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                          >
                            Confirm Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(review.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Editorial Articles</h2>
            <button
              type="button"
              onClick={openNewArticleForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[40px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>New Article</span>
            </button>
          </div>

          {showArticleForm && (
            <form
              onSubmit={handleSaveArticle}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <h3 className="font-display text-lg font-bold text-slate-900">
                {editingArticleId ? 'Edit Article' : 'Publish New Article'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={aTitle}
                    onChange={(e) => {
                      setATitle(e.target.value);
                      if (!editingArticleId) setASlug(slugify(e.target.value));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={aSlug}
                    onChange={(e) => setASlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={aCategorySlug}
                    onChange={(e) => setACategorySlug(e.target.value as CategorySlug)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {categoryChoices.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={aReadingTime}
                    onChange={(e) => setAReadingTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Image Asset
                  </label>
                  <select
                    value={aImage}
                    onChange={(e) => setAImage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {STUDIO_IMAGES.map((img) => (
                      <option key={img.path} value={img.path}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={aImageAlt}
                    onChange={(e) => setAImageAlt(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Excerpt (10+ characters) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={aExcerpt}
                  onChange={(e) => setAExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Section Heading
                  </label>
                  <input
                    type="text"
                    value={aSectionHeading}
                    onChange={(e) => setASectionHeading(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={aAuthorName}
                    onChange={(e) => setAAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Section Paragraphs (separate paragraphs with blank line)
                </label>
                <textarea
                  rows={4}
                  value={aSectionBody}
                  onChange={(e) => setASectionBody(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Takeaways Bullet Points (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={aSectionBullets}
                  onChange={(e) => setASectionBullets(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={aFeatured}
                    onChange={(e) => setAFeatured(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Pin as Featured Blog Lead</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowArticleForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busyAction}
                    className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 disabled:opacity-60 rounded-lg"
                  >
                    {busyAction ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {articles.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No articles published yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-blue-600">{article.category}</span>
                        <span className="mx-1.5">·</span>
                        <span>{article.publishedAt}</span>
                        {article.featured && (
                          <>
                            <span className="mx-1.5">·</span>
                            <span className="font-semibold text-slate-800">Featured</span>
                          </>
                        )}
                      </p>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {article.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditArticleForm(article)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      {confirmDeleteId === article.id ? (
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => handleConfirmDelete('article', article.id)}
                          className="px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                        >
                          Confirm Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(article.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INBOX TAB */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Contact Inquiries ({inquiries.length})
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No contact inquiries received yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                          {inq.topic}
                        </p>
                        <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                          {inq.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {inq.email} · {formatFirestoreTimestamp(inq.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateInquiryStatus(inq.id, inq.status === 'new' ? 'reviewed' : 'new')
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          inq.status === 'reviewed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-900 text-white border-slate-900 hover:bg-blue-600'
                        }`}
                      >
                        {inq.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {inq.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="lg:col-span-5 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Newsletter Subscribers ({subscribers.length})
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
              {subscribers.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No newsletter subscribers recorded yet.
                </div>
              ) : (
                subscribers.map((sub) => (
                  <div key={sub.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span className="truncate">{sub.email}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Source: {sub.source} · {formatFirestoreTimestamp(sub.createdAt)}
                      </p>
                    </div>

                    {confirmDeleteId === sub.id ? (
                      <button
                        type="button"
                        disabled={busyAction}
                        onClick={() => handleConfirmDelete('subscriber', sub.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg shrink-0"
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(sub.id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
