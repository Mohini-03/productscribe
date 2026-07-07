import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, Modal, ToastContainer, useToast } from "../components/ui/index.js";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Dashboard.css";

const TONES = ["friendly", "professional", "festive"];

export default function Dashboard() {
  const { seller, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQ, setSearchQ]           = useState("");
  const [filterTone, setFilterTone]     = useState("");

  // Redirect to login if there's no session once auth has finished restoring.
  useEffect(() => {
    if (!authLoading && !seller) navigate("/login");
  }, [authLoading, seller, navigate]);

  const fetchDescriptions = useCallback(async () => {
    if (!seller) return;
    setLoading(true);
    try {
      let result;
      if (searchQ.trim()) {
        result = await api.searchDescriptions(searchQ.trim());
      } else {
        result = await api.listDescriptions(filterTone || undefined);
      }
      setDescriptions(result.data);
    } catch (err) {
      showToast(err.message || "Failed to load descriptions", "error");
    } finally {
      setLoading(false);
    }
  }, [seller, searchQ, filterTone, showToast]);

  useEffect(() => { fetchDescriptions(); }, [fetchDescriptions]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm]             = useState({ productName:"", category:"", tone:"friendly", price:"", rawNotes:"" });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setFormErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateForm() {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    if (!form.rawNotes.trim())    errs.rawNotes    = "Product notes are required";
    return errs;
  }

  async function handleCreate(e) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await api.createDescription(form);
      showToast("Description created!", "success");
      setCreateOpen(false);
      setForm({ productName:"", category:"", tone:"friendly", price:"", rawNotes:"" });
      fetchDescriptions();
    } catch (err) {
      showToast(err.message || "Failed to create description", "error");
    } finally {
      setSaving(false);
    }
  }

  const [deleting, setDeleting] = useState(null);
  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.deleteDescription(id);
      showToast("Description deleted", "info");
      fetchDescriptions();
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setDeleting(null);
    }
  }

  if (authLoading || !seller) {
    return (
      <>
        <Navbar />
        <main className="dashboard">
          <div className="container"><Loader size="lg" /></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="container">
          <div className="dashboard__head">
            <div>
              <p className="eyebrow">{seller.businessName}</p>
              <h1 className="dashboard__title">Every description you've written</h1>
            </div>
            <div className="dashboard__head-actions">
              <Button onClick={() => setCreateOpen(true)}>+ New description</Button>
              <Button variant="ghost" onClick={handleLogout}>Log out</Button>
            </div>
          </div>

          <div className="dashboard__toolbar">
            <Input
              placeholder="Search descriptions…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="dashboard__search"
            />
            <div className="dashboard__filters">
              {["", ...TONES].map((t) => (
                <button key={t || "all"} className={`filter-pill ${filterTone === t ? "filter-pill--active" : ""}`}
                  onClick={() => { setFilterTone(t); setSearchQ(""); }}>
                  {t || "All"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Loader size="lg" />
          ) : descriptions.length === 0 ? (
            <div className="dashboard__empty">
              <p>No descriptions yet. Create your first one!</p>
              <Button onClick={() => setCreateOpen(true)}>+ New description</Button>
            </div>
          ) : (
            <div className="desc-grid">
              {descriptions.map((d) => (
                <article key={d.id} className="desc-card">
                  <div className="desc-card__top">
                    <span className={`tone-badge tone-badge--${d.tone}`}>{d.tone}</span>
                    <span className="desc-card__price">{d.price}</span>
                  </div>
                  <h3 className="desc-card__name">{d.productName}</h3>
                  <p className="desc-card__body">{d.generatedDescription}</p>
                  <div className="desc-card__actions">
                    <Button variant="ghost" size="sm"
                      onClick={() => { navigator.clipboard.writeText(d.generatedDescription); showToast("Copied!", "success"); }}>
                      Copy
                    </Button>
                    <Button variant="danger" size="sm" loading={deleting === d.id}
                      onClick={() => handleDelete(d.id, d.productName)}>
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New product description" size="md">
        <form onSubmit={handleCreate} className="create-form">
          <Input label="Product name" value={form.productName}
            onChange={(e) => setField("productName", e.target.value)}
            error={formErrors.productName} placeholder="e.g. Breezy Red Cotton Kurta" />
          <div className="create-form__row">
            <Input label="Category" value={form.category}
              onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Clothing" />
            <Input label="Price" value={form.price}
              onChange={(e) => setField("price", e.target.value)} placeholder="e.g. ₹599" />
          </div>
          <div className="create-form__tones">
            <p className="create-form__tone-label">Tone</p>
            <div className="create-form__tone-row">
              {TONES.map((t) => (
                <button key={t} type="button"
                  className={`tone-pill ${form.tone === t ? "tone-pill--active" : ""}`}
                  onClick={() => setField("tone", t)}>{t}</button>
              ))}
            </div>
          </div>
          <Input label="Product notes" multiline rows={3} value={form.rawNotes}
            onChange={(e) => setField("rawNotes", e.target.value)}
            error={formErrors.rawNotes}
            hint="Jot down details — material, size, colour, price. No need for full sentences."
            placeholder="red cotton kurta, size m, ₹599, soft fabric, good for summer" />
          <div className="create-form__footer">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Generate &amp; Save</Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </>
  );
}