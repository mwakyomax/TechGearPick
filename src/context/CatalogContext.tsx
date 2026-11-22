import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  ADMIN_EMAIL,
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  STARTER_ARTICLES,
  STARTER_CATEGORIES,
  STARTER_COMPARISONS,
  STARTER_GUIDES,
  STARTER_PRODUCTS,
  STARTER_REVIEWS,
} from '../lib/adminCatalogSeed';
import { CategoryInfo } from '../types/category';
import { ComparisonArticle, Product, ProductReview } from '../types/product';
import { Article, BuyingGuide } from '../types/article';

export interface SubscriberRecord {
  id: string;
  email: string;
  source: string;
  createdAt?: unknown;
}

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: 'new' | 'reviewed';
  createdAt?: unknown;
}

interface CatalogContextValue {
  loading: boolean;
  authReady: boolean;
  user: User | null;
  isAdmin: boolean;
  categories: CategoryInfo[];
  products: Product[];
  reviews: ProductReview[];
  comparisons: ComparisonArticle[];
  guides: BuyingGuide[];
  articles: Article[];
  subscribers: SubscriberRecord[];
  inquiries: ContactInquiryRecord[];
  getCategoryBySlug: (slug: string) => CategoryInfo | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getFeaturedProducts: () => Product[];
  getReviewBySlug: (slug: string) => ProductReview | undefined;
  getReviewByProductId: (productId: string) => ProductReview | undefined;
  getComparisonBySlug: (slug: string) => ComparisonArticle | undefined;
  getGuideBySlug: (slug: string) => BuyingGuide | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  subscribeToNewsletter: (email: string, source?: string) => Promise<void>;
  submitContactInquiry: (payload: {
    name: string;
    email: string;
    topic: string;
    message: string;
  }) => Promise<void>;
  saveProduct: (product: Product, isNew: boolean) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveReview: (review: ProductReview, isNew: boolean) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  saveArticle: (article: Article, isNew: boolean) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  updateInquiryStatus: (inquiryId: string, status: 'new' | 'reviewed') => Promise<void>;
  deleteSubscriber: (subscriberId: string) => Promise<void>;
  importStarterCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function makeSafeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

function slugToId(prefix: string, slug: string): string {
  const cleaned = slug
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
  return `${prefix}-${cleaned || Date.now()}`;
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonArticle[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);

  const [loadedFlags, setLoadedFlags] = useState({
    categories: false,
    products: false,
    reviews: false,
    comparisons: false,
    guides: false,
    articles: false,
  });

  // Track Auth & Admin Role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser || !nextUser.emailVerified) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      if (nextUser.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
        setIsAdmin(adminDoc.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  // Subscribe to Public Catalog Collections
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    unsubs.push(
      onSnapshot(
        query(collection(db, 'categories'), orderBy('name', 'asc')),
        (snap) => {
          setCategories(snap.docs.map((d) => d.data() as CategoryInfo));
          setLoadedFlags((prev) => ({ ...prev, categories: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'categories'),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'products'), orderBy('publicationDate', 'desc')),
        (snap) => {
          setProducts(snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id })));
          setLoadedFlags((prev) => ({ ...prev, products: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'products'),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'reviews'), orderBy('updatedAt', 'desc')),
        (snap) => {
          setReviews(snap.docs.map((d) => ({ ...(d.data() as ProductReview), id: d.id })));
          setLoadedFlags((prev) => ({ ...prev, reviews: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'reviews'),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'comparisons'), orderBy('updatedAt', 'desc')),
        (snap) => {
          setComparisons(
            snap.docs.map((d) => ({ ...(d.data() as ComparisonArticle), id: d.id })),
          );
          setLoadedFlags((prev) => ({ ...prev, comparisons: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'comparisons'),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'guides'), orderBy('updatedAt', 'desc')),
        (snap) => {
          setGuides(snap.docs.map((d) => ({ ...(d.data() as BuyingGuide), id: d.id })));
          setLoadedFlags((prev) => ({ ...prev, guides: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'guides'),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'articles'), orderBy('publishedAt', 'desc')),
        (snap) => {
          setArticles(snap.docs.map((d) => ({ ...(d.data() as Article), id: d.id })));
          setLoadedFlags((prev) => ({ ...prev, articles: true }));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'articles'),
      ),
    );

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, []);

  // Admin-only Inbox Listeners (subscribers & contact inquiries)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setSubscribers([]);
      setInquiries([]);
      return;
    }

    const unsubSubs = onSnapshot(
      query(collection(db, 'newsletter_subscribers'), orderBy('createdAt', 'desc')),
      (snap) => {
        setSubscribers(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SubscriberRecord, 'id'>) })),
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'newsletter_subscribers'),
    );

    const unsubInq = onSnapshot(
      query(collection(db, 'contact_inquiries'), orderBy('createdAt', 'desc')),
      (snap) => {
        setInquiries(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ContactInquiryRecord, 'id'>),
          })),
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'contact_inquiries'),
    );

    return () => {
      unsubSubs();
      unsubInq();
    };
  }, [authReady, isAdmin]);

  const loading = useMemo(
    () => !Object.values(loadedFlags).every(Boolean),
    [loadedFlags],
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((c) => c.slug === slug),
    [categories],
  );

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string) => products.filter((p) => p.category === categorySlug),
    [products],
  );

  const getFeaturedProducts = useCallback(
    () => products.filter((p) => p.featured),
    [products],
  );

  const getReviewBySlug = useCallback(
    (slug: string) => reviews.find((r) => r.slug === slug),
    [reviews],
  );

  const getReviewByProductId = useCallback(
    (productId: string) => reviews.find((r) => r.productId === productId),
    [reviews],
  );

  const getComparisonBySlug = useCallback(
    (slug: string) => comparisons.find((c) => c.slug === slug),
    [comparisons],
  );

  const getGuideBySlug = useCallback(
    (slug: string) => guides.find((g) => g.slug === slug),
    [guides],
  );

  const getArticleBySlug = useCallback(
    (slug: string) => articles.find((a) => a.slug === slug),
    [articles],
  );

  const subscribeToNewsletter = useCallback(async (email: string, source = 'website') => {
    const cleanEmail = email.trim().toLowerCase().slice(0, 254);
    const id = makeSafeId('sub');
    const path = `newsletter_subscribers/${id}`;
    try {
      await setDoc(doc(db, 'newsletter_subscribers', id), {
        email: cleanEmail,
        source: source.slice(0, 80),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const submitContactInquiry = useCallback(
    async (payload: { name: string; email: string; topic: string; message: string }) => {
      const id = makeSafeId('inq');
      const path = `contact_inquiries/${id}`;
      try {
        await setDoc(doc(db, 'contact_inquiries', id), {
          name: payload.name.trim().slice(0, 120),
          email: payload.email.trim().toLowerCase().slice(0, 254),
          topic: payload.topic.trim().slice(0, 100),
          message: payload.message.trim().slice(0, 3000),
          status: 'new',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [],
  );

  const saveProduct = useCallback(async (product: Product, isNew: boolean) => {
    const id = isNew ? slugToId('prod', product.slug) : product.id;
    const path = `products/${id}`;
    const docData: Record<string, unknown> = {
      slug: product.slug.slice(0, 120),
      name: product.name.slice(0, 180),
      brand: product.brand.slice(0, 80),
      category: product.category.slice(0, 80),
      categoryName: product.categoryName.slice(0, 100),
      subcategory: product.subcategory.slice(0, 100),
      description: product.description.slice(0, 1000),
      image: product.image.slice(0, 500),
      imageAlt: product.imageAlt.slice(0, 300),
      currency: 'USD',
      amazonUrl: product.amazonUrl.slice(0, 600),
      affiliateUrl: product.affiliateUrl.slice(0, 600),
      specifications: product.specifications.slice(0, 25),
      features: product.features.slice(0, 20),
      pros: product.pros.slice(0, 15),
      cons: product.cons.slice(0, 15),
      availability: product.availability,
      featured: Boolean(product.featured),
      publicationDate: product.publicationDate.slice(0, 30),
      keywords: product.keywords.slice(0, 20),
      updatedAt: serverTimestamp(),
    };
    if (product.amazonAsin) docData.amazonAsin = product.amazonAsin.slice(0, 20);
    if (typeof product.price === 'number' && !Number.isNaN(product.price)) {
      docData.price = product.price;
    }
    if (typeof product.rating === 'number' && !Number.isNaN(product.rating)) {
      docData.rating = product.rating;
    }

    try {
      if (isNew) {
        await setDoc(doc(db, 'products', id), {
          ...docData,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'products', id), docData);
      }
    } catch (error) {
      handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const saveReview = useCallback(async (review: ProductReview, isNew: boolean) => {
    const id = isNew ? slugToId('rev', review.slug) : review.id;
    const path = `reviews/${id}`;
    const docData = {
      slug: review.slug.slice(0, 140),
      productId: review.productId.slice(0, 128),
      title: review.title.slice(0, 220),
      methodologyLabel: review.methodologyLabel.slice(0, 80),
      summary: review.summary.slice(0, 600),
      introduction: review.introduction.slice(0, 3000),
      performanceOverview: review.performanceOverview.slice(0, 4000),
      bestUseCases: review.bestUseCases.slice(0, 15),
      whoShouldBuy: review.whoShouldBuy.slice(0, 15),
      whoShouldAvoid: review.whoShouldAvoid.slice(0, 15),
      alternativeSlugs: review.alternativeSlugs.slice(0, 10),
      finalVerdict: review.finalVerdict.slice(0, 2000),
      authorName: review.authorName.slice(0, 100),
      authorRole: review.authorRole.slice(0, 100),
      publishedAt: review.publishedAt.slice(0, 30),
      updatedAt: review.updatedAt.slice(0, 30),
      readingTimeMinutes: Math.max(1, Math.min(120, Number(review.readingTimeMinutes) || 5)),
      serverUpdatedAt: serverTimestamp(),
    };

    try {
      if (isNew) {
        await setDoc(doc(db, 'reviews', id), {
          ...docData,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'reviews', id), docData);
      }
    } catch (error) {
      handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    const path = `reviews/${reviewId}`;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const saveArticle = useCallback(async (article: Article, isNew: boolean) => {
    const id = isNew ? slugToId('art', article.slug) : article.id;
    const path = `articles/${id}`;
    const docData = {
      slug: article.slug.slice(0, 140),
      title: article.title.slice(0, 220),
      excerpt: article.excerpt.slice(0, 600),
      category: article.category.slice(0, 100),
      categorySlug: article.categorySlug.slice(0, 100),
      publishedAt: article.publishedAt.slice(0, 30),
      updatedAt: article.updatedAt.slice(0, 30),
      readingTimeMinutes: Math.max(1, Math.min(120, Number(article.readingTimeMinutes) || 5)),
      featured: Boolean(article.featured),
      image: article.image.slice(0, 500),
      imageAlt: article.imageAlt.slice(0, 300),
      author: article.author,
      tableOfContents: article.tableOfContents.slice(0, 25),
      sections: article.sections.slice(0, 25),
      relatedSlugs: article.relatedSlugs.slice(0, 10),
      serverUpdatedAt: serverTimestamp(),
    };

    try {
      if (isNew) {
        await setDoc(doc(db, 'articles', id), {
          ...docData,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'articles', id), docData);
      }
    } catch (error) {
      handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
    }
  }, []);

  const deleteArticle = useCallback(async (articleId: string) => {
    const path = `articles/${articleId}`;
    try {
      await deleteDoc(doc(db, 'articles', articleId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const updateInquiryStatus = useCallback(
    async (inquiryId: string, status: 'new' | 'reviewed') => {
      const path = `contact_inquiries/${inquiryId}`;
      try {
        await updateDoc(doc(db, 'contact_inquiries', inquiryId), {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [],
  );

  const deleteSubscriber = useCallback(async (subscriberId: string) => {
    const path = `newsletter_subscribers/${subscriberId}`;
    try {
      await deleteDoc(doc(db, 'newsletter_subscribers', subscriberId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const importStarterCatalog = useCallback(async () => {
    try {
      const batch1 = writeBatch(db);
      for (const cat of STARTER_CATEGORIES) {
        batch1.set(doc(db, 'categories', cat.slug), {
          ...cat,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const prod of STARTER_PRODUCTS) {
        const { id: _id, ...rest } = prod;
        batch1.set(doc(db, 'products', prod.id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch1.commit();

      const batch2 = writeBatch(db);
      for (const rev of STARTER_REVIEWS) {
        const { id: _id, ...rest } = rev;
        batch2.set(doc(db, 'reviews', rev.id), {
          ...rest,
          createdAt: serverTimestamp(),
          serverUpdatedAt: serverTimestamp(),
        });
      }
      for (const comp of STARTER_COMPARISONS) {
        const { id: _id, ...rest } = comp;
        batch2.set(doc(db, 'comparisons', comp.id), {
          ...rest,
          createdAt: serverTimestamp(),
          serverUpdatedAt: serverTimestamp(),
        });
      }
      for (const guide of STARTER_GUIDES) {
        const { id: _id, ...rest } = guide;
        batch2.set(doc(db, 'guides', guide.id), {
          ...rest,
          createdAt: serverTimestamp(),
          serverUpdatedAt: serverTimestamp(),
        });
      }
      for (const art of STARTER_ARTICLES) {
        const { id: _id, ...rest } = art;
        batch2.set(doc(db, 'articles', art.id), {
          ...rest,
          createdAt: serverTimestamp(),
          serverUpdatedAt: serverTimestamp(),
        });
      }
      await batch2.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch_catalog_import');
    }
  }, []);

  const value = useMemo<CatalogContextValue>(
    () => ({
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
      getCategoryBySlug,
      getProductBySlug,
      getProductsByCategory,
      getFeaturedProducts,
      getReviewBySlug,
      getReviewByProductId,
      getComparisonBySlug,
      getGuideBySlug,
      getArticleBySlug,
      subscribeToNewsletter,
      submitContactInquiry,
      saveProduct,
      deleteProduct,
      saveReview,
      deleteReview,
      saveArticle,
      deleteArticle,
      updateInquiryStatus,
      deleteSubscriber,
      importStarterCatalog,
    }),
    [
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
      getCategoryBySlug,
      getProductBySlug,
      getProductsByCategory,
      getFeaturedProducts,
      getReviewBySlug,
      getReviewByProductId,
      getComparisonBySlug,
      getGuideBySlug,
      getArticleBySlug,
      subscribeToNewsletter,
      submitContactInquiry,
      saveProduct,
      deleteProduct,
      saveReview,
      deleteReview,
      saveArticle,
      deleteArticle,
      updateInquiryStatus,
      deleteSubscriber,
      importStarterCatalog,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used inside a CatalogProvider');
  }
  return ctx;
}
