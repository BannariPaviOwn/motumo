import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Lock, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import {
  getCategoryLabel,
  PRODUCT_CATEGORIES,
  type ProductCategoryId,
} from '../data/products'
import { Logo } from '../components/Logo'
import { useProducts } from '../context/ProductsContext'
import { fileToProductImageDataUrl } from '../lib/customProducts'
import {
  ADMIN_PASSWORD,
  isAdminUnlocked,
  setAdminUnlocked,
} from '../lib/productActive'
import {
  getEffectivePrice,
  hasActiveDiscount,
  MAX_DISCOUNT_PERCENT,
  MIN_DISCOUNT_PERCENT,
} from '../lib/productPricing'

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

const emptyForm = {
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  weight: '',
  category: 'spreads' as ProductCategoryId,
  categoryLabel: '',
  discountEnabled: false,
  discountPercent: '10',
}

export function AdminPage() {
  const {
    products,
    setProductActive,
    setProductDiscount,
    addProduct,
    deleteCustomProduct,
    isCustomProduct,
  } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [unlocked, setUnlocked] = useState(() => isAdminUnlocked())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [photoDataUrl, setPhotoDataUrl] = useState('')
  const [photoBusy, setPhotoBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => {
    const unlockParam = searchParams.get('unlock')
    if (unlockParam === ADMIN_PASSWORD) {
      setAdminUnlocked(true)
      setUnlocked(true)
      const next = new URLSearchParams(searchParams)
      next.delete('unlock')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const counts = useMemo(() => {
    const active = products.filter((p) => p.active).length
    const custom = products.filter((p) => isCustomProduct(p.id)).length
    return {
      active,
      inactive: products.length - active,
      total: products.length,
      custom,
    }
  }, [products, isCustomProduct])

  function handleUnlock(e: FormEvent) {
    e.preventDefault()
    if (password.trim() === ADMIN_PASSWORD) {
      setAdminUnlocked(true)
      setUnlocked(true)
      setError('')
      setPassword('')
      return
    }
    setError('Incorrect password. Use the demo unlock password.')
  }

  function handleLock() {
    setAdminUnlocked(false)
    setUnlocked(false)
  }

  async function handlePhotoChange(file: File | null) {
    setFormError('')
    if (!file) {
      setPhotoDataUrl('')
      return
    }
    setPhotoBusy(true)
    const result = await fileToProductImageDataUrl(file)
    setPhotoBusy(false)
    if ('error' in result) {
      setFormError(result.error)
      setPhotoDataUrl('')
      return
    }
    setPhotoDataUrl(result.dataUrl)
  }

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    const name = form.name.trim()
    const price = Number(form.price)
    if (!name) {
      setFormError('Name is required.')
      return
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Enter a valid price in INR.')
      return
    }
    if (!form.category) {
      setFormError('Choose a category.')
      return
    }

    let discountPercent = 0
    if (form.discountEnabled) {
      discountPercent = Number(form.discountPercent)
      if (
        !Number.isFinite(discountPercent) ||
        discountPercent < MIN_DISCOUNT_PERCENT ||
        discountPercent > MAX_DISCOUNT_PERCENT
      ) {
        setFormError(`Discount must be between ${MIN_DISCOUNT_PERCENT}–${MAX_DISCOUNT_PERCENT}%.`)
        return
      }
    }

    const image = photoDataUrl || form.imageUrl.trim()

    const created = addProduct({
      name,
      price,
      description: form.description.trim(),
      image,
      weight: form.weight.trim(),
      category: form.category,
      categoryLabel: form.categoryLabel.trim(),
      discountEnabled: form.discountEnabled,
      discountPercent,
    })

    if (!created) {
      setFormError('Could not create product. Check the fields and try again.')
      return
    }

    setForm(emptyForm)
    setPhotoDataUrl('')
    setFormSuccess(`“${created.name}” added and is live on the shop.`)
  }

  function handleDelete(id: string, name: string) {
    if (!isCustomProduct(id)) return
    const ok = window.confirm(
      `Delete “${name}”? This removes the custom product from localStorage. Seed catalog SKUs cannot be deleted.`,
    )
    if (!ok) return
    deleteCustomProduct(id)
    setFormSuccess(`“${name}” deleted.`)
  }

  if (!unlocked) {
    return (
      <div className="min-h-svh bg-gradient-to-b from-lavender-100 via-cream to-cream">
        <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-plum-soft hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_18px_50px_-28px_rgba(61,26,92,0.45)] ring-1 ring-plum/10 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-plum uppercase">
              <Lock className="h-3.5 w-3.5" />
              Dev admin
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-plum">
              Unlock Motumo Admin
            </h1>
            <p className="mt-2 text-sm text-plum-soft">
              Soft gate for demos — not real auth. Password:{' '}
              <code className="rounded bg-lavender-100 px-1.5 py-0.5 font-mono text-xs text-plum">
                {ADMIN_PASSWORD}
              </code>
            </p>
            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <label className="block">
                <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                  placeholder="Enter admin password"
                />
              </label>
              {error && <p className="text-sm text-motumo-red">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-plum px-4 py-3 font-display text-sm font-semibold text-white transition hover:bg-motumo-red"
              >
                Unlock admin
              </button>
            </form>
            <p className="mt-4 text-xs text-plum-soft">
              Tip: open{' '}
              <code className="rounded bg-lavender-100 px-1 py-0.5 font-mono text-[11px]">
                /admin?unlock={ADMIN_PASSWORD}
              </code>{' '}
              to unlock automatically.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const previewImage = photoDataUrl || form.imageUrl.trim()

  return (
    <div className="min-h-svh bg-gradient-to-b from-lavender-100 via-cream to-cream">
      <header className="border-b border-plum/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-plum px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/#shop"
              className="rounded-full bg-lavender-100 px-4 py-2 font-display text-xs font-semibold text-plum transition hover:bg-lavender-200"
            >
              View shop
            </Link>
            <button
              type="button"
              onClick={handleLock}
              className="rounded-full bg-white px-4 py-2 font-display text-xs font-semibold text-plum-soft ring-1 ring-plum/15 transition hover:text-plum"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-plum-soft uppercase">
              Catalog control
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-plum">
              Products
            </h1>
            <p className="mt-2 max-w-xl text-sm text-plum-soft">
              Add products with photo + category, toggle discounts, and show/hide SKUs.
              Changes persist in localStorage.
            </p>
          </div>
          <p className="text-sm text-plum-soft">
            <span className="font-semibold text-plum">{counts.active}</span> active ·{' '}
            <span className="font-semibold text-plum">{counts.inactive}</span> inactive ·{' '}
            <span className="font-semibold text-plum">{counts.custom}</span> custom ·{' '}
            {counts.total} total
          </p>
        </div>

        <section
          className="mt-8 rounded-[1.5rem] bg-white p-5 shadow-[0_12px_36px_-28px_rgba(61,26,92,0.4)] ring-1 ring-plum/8 sm:p-6"
          aria-labelledby="add-product-heading"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lavender-100 text-plum">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2
                id="add-product-heading"
                className="font-display text-lg font-semibold text-plum"
              >
                Add new product
              </h2>
              <p className="text-xs text-plum-soft">
                Starts active so it appears on the shop immediately.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                Name <span className="text-motumo-red">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                placeholder="e.g. Cashew Spread Delight"
                required
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                Price (INR) <span className="text-motumo-red">*</span>
              </span>
              <input
                type="number"
                min={1}
                step={1}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                placeholder="299"
                required
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                Category <span className="text-motumo-red">*</span>
              </span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as ProductCategoryId,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                required
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                Weight / size
              </span>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                placeholder="200g"
              />
            </label>

            {form.category === 'other' && (
              <label className="block sm:col-span-2">
                <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                  Custom category label
                </span>
                <input
                  type="text"
                  value={form.categoryLabel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryLabel: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                  placeholder="e.g. Festival special"
                />
              </label>
            )}

            <div className="sm:col-span-2 rounded-2xl bg-cream/70 p-4 ring-1 ring-plum/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                    Discount
                  </p>
                  <p className="mt-0.5 text-xs text-plum-soft">
                    Effective price = price × (1 − % / 100) when enabled.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.discountEnabled}
                  onClick={() =>
                    setForm((f) => ({ ...f, discountEnabled: !f.discountEnabled }))
                  }
                  className={`relative h-8 w-14 rounded-full transition ${
                    form.discountEnabled ? 'bg-plum' : 'bg-plum/25'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition ${
                      form.discountEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {form.discountEnabled && (
                <label className="mt-3 block max-w-xs">
                  <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                    Discount % ({MIN_DISCOUNT_PERCENT}–{MAX_DISCOUNT_PERCENT})
                  </span>
                  <input
                    type="number"
                    min={MIN_DISCOUNT_PERCENT}
                    max={MAX_DISCOUNT_PERCENT}
                    step={1}
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, discountPercent: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                  />
                </label>
              )}
            </div>

            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <label className="block">
                  <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                    Product photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handlePhotoChange(e.target.files?.[0] ?? null)}
                    className="mt-1.5 block w-full text-sm text-plum file:mr-3 file:rounded-full file:border-0 file:bg-plum file:px-4 file:py-2 file:font-display file:text-xs file:font-semibold file:text-white hover:file:bg-motumo-red"
                  />
                  <span className="mt-1 block text-xs text-plum-soft">
                    Uploaded photos are compressed and stored as a data URL in localStorage.
                    {photoBusy ? ' Processing…' : ''}
                  </span>
                </label>
                <label className="block">
                  <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                    Image URL (optional fallback)
                  </span>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                    placeholder="Used if no photo is uploaded"
                  />
                </label>
              </div>
              <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-lavender-100/60 ring-1 ring-plum/10 sm:w-36">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Product preview"
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-plum-soft">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-[11px] font-semibold uppercase">Preview</span>
                  </div>
                )}
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                Short description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="mt-1.5 w-full resize-y rounded-xl border border-plum/15 bg-cream/60 px-3.5 py-2.5 text-plum outline-none ring-plum/20 focus:ring-2"
                placeholder="Shown as the shop card tagline"
              />
            </label>

            <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-[1.25rem] text-sm">
                {formError && <p className="text-motumo-red">{formError}</p>}
                {!formError && formSuccess && (
                  <p className="text-plum">{formSuccess}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={photoBusy}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-plum px-5 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-motumo-red disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Add product
              </button>
            </div>
          </form>
        </section>

        <ul className="mt-8 space-y-3">
          {products.map((product) => {
            const custom = isCustomProduct(product.id)
            const discounted = hasActiveDiscount(product)
            const effective = getEffectivePrice(product)
            return (
              <li
                key={product.id}
                className="flex flex-col gap-4 rounded-[1.25rem] bg-white p-4 shadow-[0_12px_36px_-28px_rgba(61,26,92,0.4)] ring-1 ring-plum/8 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl sm:h-24 sm:w-24"
                    style={{
                      background: `linear-gradient(165deg, ${product.accent}55 0%, #fff8e8 100%)`,
                    }}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="h-16 w-auto object-contain sm:h-20"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold text-plum">
                        {product.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                          product.active
                            ? 'bg-motumo-green/20 text-plum'
                            : 'bg-plum/10 text-plum-soft'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="rounded-full bg-lavender-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-plum uppercase">
                        {getCategoryLabel(product)}
                      </span>
                      {custom && (
                        <span className="rounded-full bg-plum/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-plum uppercase">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-plum-soft">
                      {product.weight} ·{' '}
                      {discounted ? (
                        <>
                          <span className="font-semibold text-plum">
                            {formatINR(effective)}
                          </span>{' '}
                          <span className="line-through">{formatINR(product.price)}</span>
                          <span className="ml-1 text-motumo-red">
                            −{product.discountPercent}%
                          </span>
                        </>
                      ) : (
                        formatINR(product.price)
                      )}
                    </p>
                    <p className="mt-1 truncate text-xs text-plum-soft/80">{product.id}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
                    {custom && (
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-display text-xs font-semibold text-motumo-red ring-1 ring-motumo-red/25 transition hover:bg-motumo-red/5"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-3">
                      <span className="font-display text-xs font-semibold text-plum-soft uppercase">
                        {product.active ? 'On shop' : 'Hidden'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={product.active}
                        aria-label={`${product.active ? 'Deactivate' : 'Activate'} ${product.name}`}
                        onClick={() => setProductActive(product.id, !product.active)}
                        className={`relative h-8 w-14 rounded-full transition ${
                          product.active ? 'bg-plum' : 'bg-plum/25'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition ${
                            product.active ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-cream/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xs font-semibold tracking-wide text-plum uppercase">
                      Discount
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={product.discountEnabled}
                      aria-label={`${product.discountEnabled ? 'Disable' : 'Enable'} discount for ${product.name}`}
                      onClick={() =>
                        setProductDiscount(
                          product.id,
                          !product.discountEnabled,
                          product.discountPercent || 10,
                        )
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        product.discountEnabled ? 'bg-motumo-red' : 'bg-plum/25'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                          product.discountEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-plum-soft">
                      {product.discountEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                  {product.discountEnabled && (
                    <label className="inline-flex items-center gap-2">
                      <span className="text-xs font-semibold text-plum-soft">%</span>
                      <input
                        type="number"
                        min={MIN_DISCOUNT_PERCENT}
                        max={MAX_DISCOUNT_PERCENT}
                        value={product.discountPercent || ''}
                        onChange={(e) => {
                          const next = Number(e.target.value)
                          if (!Number.isFinite(next)) return
                          setProductDiscount(product.id, true, next)
                        }}
                        className="w-20 rounded-lg border border-plum/15 bg-white px-2.5 py-1.5 text-sm text-plum outline-none ring-plum/20 focus:ring-2"
                      />
                    </label>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
