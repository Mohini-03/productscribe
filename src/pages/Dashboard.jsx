import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../api.js";
import "./Pages.css";
import "./Dashboard.css";

const TONES = ["friendly", "professional", "festive"];

export default function Dashboard() {
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [searchQ, setSearchQ]           = useState("");
  const [filterTone, setFilterTone]     = useState("");

  // ── toasts ──────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── fetch list ───────────────────────────────────────────────────────────
  const fetchDescriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = searchQ.trim()
        ? await api.searchDescriptions(searchQ.trim())
        : await api.listDescriptions(filterTone || undefined);
      setDescriptions(result.data);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterTone]);

  useEffect(() => { fetchDescriptions(); }, [fetchDescriptions]);

  // ── create form ──────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ productName:"", category:"", tone:"friendly", price:"", rawNotes:"" });
  const [saving, setSaving]     = useState(false);
  const [formErrors, setFormErrors] = useState({});

  function setField(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    setFormErrors(e => ({ ...e, [k]: "" }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Required";
    if (!form.rawNotes.trim())    errs.rawNotes    = "Required";
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await api.createDescription(form);
      showToast("Description created!", "success");
      setShowForm(false);
      setForm({ productName:"", category:"", tone:"friendly", price:"", rawNotes:"" });
      fetchDescriptions();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  // ── delete ───────────────────────────────────────────────────────────────
  const [deleting, setDeleting] = useState(null);
  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.deleteDescription(id);
      showToast("Deleted", "info");
      fetchDescriptions();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "48px 0 80px", minHeight: "60vh" }}>
        <div className="container">

          {/* header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:32 }}>
            <div>
              <p className="eyebrow">Your dashboard</p>
              <h1 style={{ fontSize:"clamp(1.6rem,3vw,2.1rem)", marginTop:10 }}>Every description you've written</h1>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              {showForm ? "✕ Cancel" : "+ New description"}
            </button>
          </div>

          {/* create form */}
          {showForm && (
            <form onSubmit={handleCreate} style={{ background:"var(--white)", border:"1px solid var(--line)", borderRadius:16, padding:28, marginBottom:32, display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ margin:0 }}>New product description</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={{ fontSize:".76rem", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:".07em", color:"var(--ink-soft)", display:"block", marginBottom:6 }}>Product name *</label>
                  <input value={form.productName} onChange={e => setField("productName", e.target.value)}
                    placeholder="e.g. Breezy Red Cotton Kurta"
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${formErrors.productName ? "#e0654f" : "var(--line-strong)"}`, background:"var(--white)", color:"var(--ink)", fontFamily:"var(--font-body)", fontSize:".95rem", boxSizing:"border-box" }} />
                  {formErrors.productName && <p style={{ color:"#e0654f", fontSize:".82rem", margin:"4px 0 0" }}>{formErrors.productName}</p>}
                </div>
                <div>
                  <label style={{ fontSize:".76rem", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:".07em", color:"var(--ink-soft)", display:"block", marginBottom:6 }}>Category</label>
                  <input value={form.category} onChange={e => setField("category", e.target.value)}
                    placeholder="e.g. Clothing"
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid var(--line-strong)", background:"var(--white)", color:"var(--ink)", fontFamily:"var(--font-body)", fontSize:".95rem", boxSizing:"border-box" }} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={{ fontSize:".76rem", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:".07em", color:"var(--ink-soft)", display:"block", marginBottom:6 }}>Price</label>
                  <input value={form.price} onChange={e => setField("price", e.target.value)}
                    placeholder="e.g. ₹599"
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid var(--line-strong)", background:"var(--white)", color:"var(--ink)", fontFamily:"var(--font-body)", fontSize:".95rem", boxSizing:"border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize:".76rem", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:".07em", color:"var(--ink-soft)", display:"block", marginBottom:6 }}>Tone</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {TONES.map(t => (
                      <button key={t} type="button" onClick={() => setField("tone", t)}
                        style={{ padding:"8px 14px", borderRadius:999, border:"1px solid var(--line-strong)", background: form.tone===t ? "var(--ink)" : "transparent", color: form.tone===t ? "var(--paper)" : "var(--ink-soft)", cursor:"pointer", fontSize:".85rem", fontFamily:"var(--font-body)", textTransform:"capitalize" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize:".76rem", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:".07em", color:"var(--ink-soft)", display:"block", marginBottom:6 }}>Product notes *</label>
                <textarea value={form.rawNotes} onChange={e => setField("rawNotes", e.target.value)}
                  rows={3} placeholder="red cotton kurta, size m, ₹599, soft fabric, good for summer"
                  style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${formErrors.rawNotes ? "#e0654f" : "var(--line-strong)"}`, background:"var(--white)", color:"var(--ink)", fontFamily:"var(--font-body)", fontSize:".95rem", boxSizing:"border-box", resize:"vertical" }} />
                {formErrors.rawNotes && <p style={{ color:"#e0654f", fontSize:".82rem", margin:"4px 0 0" }}>{formErrors.rawNotes}</p>}
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end", gap:12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Generate & Save"}
                </button>
              </div>
            </form>
          )}

          {/* search + filter */}
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28, alignItems:"center" }}>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search descriptions…"
              style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid var(--line-strong)", background:"var(--white)", color:"var(--ink)", fontFamily:"var(--font-body)", fontSize:".95rem" }} />
            <div style={{ display:"flex", gap:8 }}>
              {["", ...TONES].map(t => (
                <button key={t||"all"} onClick={() => { setFilterTone(t); setSearchQ(""); }}
                  style={{ padding:"8px 16px", borderRadius:999, border:"1px solid var(--line-strong)", background: filterTone===t ? "var(--ink)" : "transparent", color: filterTone===t ? "var(--paper)" : "var(--ink-soft)", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:".88rem", textTransform:"capitalize" }}>
                  {t || "All"}
                </button>
              ))}
            </div>
          </div>

          {/* content */}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:80 }}>
              <div style={{ width:40, height:40, border:"3px solid var(--line)", borderTopColor:"var(--sage)", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : error ? (
            <div style={{ textAlign:"center", padding:60, color:"#e0654f" }}>
              <p>⚠ {error}</p>
              <button className="btn btn-ghost" onClick={fetchDescriptions}>Retry</button>
            </div>
          ) : descriptions.length === 0 ? (
            <div style={{ textAlign:"center", padding:80, color:"var(--ink-soft)" }}>
              <p>No descriptions yet.</p>
              <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => setShowForm(true)}>+ New description</button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
              {descriptions.map(d => (
                <article key={d.id} style={{ background:"var(--white)", border:"1px solid var(--line)", borderRadius:16, padding:22, display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ padding:"3px 10px", borderRadius:999, fontFamily:"var(--font-mono)", fontSize:".72rem", textTransform:"uppercase", background: d.tone==="friendly" ? "rgba(63,114,104,.14)" : d.tone==="festive" ? "rgba(232,163,61,.18)" : "rgba(75,86,112,.12)", color: d.tone==="friendly" ? "var(--sage-deep)" : d.tone==="festive" ? "var(--saffron-deep)" : "var(--ink-soft)" }}>
                      {d.tone}
                    </span>
                    <span style={{ fontFamily:"var(--font-mono)", fontSize:".85rem", color:"var(--ink-soft)" }}>{d.price}</span>
                  </div>
                  <h3 style={{ fontSize:"1.08rem", margin:0 }}>{d.productName}</h3>
                  <p style={{ color:"var(--ink-soft)", fontSize:".93rem", flex:1 }}>{d.generatedDescription}</p>
                  <div style={{ display:"flex", gap:8, paddingTop:10, borderTop:"1px solid var(--line)" }}>
                    <button className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:".85rem" }}
                      onClick={() => { navigator.clipboard.writeText(d.generatedDescription); showToast("Copied!", "success"); }}>
                      Copy
                    </button>
                    <button className="btn" style={{ padding:"7px 14px", fontSize:".85rem", background:"#e0654f", color:"#fff", border:"none", borderRadius:999 }}
                      disabled={deleting === d.id}
                      onClick={() => handleDelete(d.id, d.productName)}>
                      {deleting === d.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, padding:"13px 20px", borderRadius:14, fontFamily:"var(--font-body)", fontSize:".93rem", boxShadow:"0 8px 24px -6px rgba(31,42,68,.3)", background: toast.type==="success" ? "#f0faf6" : toast.type==="error" ? "#fef3f0" : "#f0f4ff", color: toast.type==="success" ? "#1f4038" : toast.type==="error" ? "#7a2718" : "#1e3060", borderLeft: `4px solid ${toast.type==="success" ? "#3f7268" : toast.type==="error" ? "#e0654f" : "#4a72c0"}`, zIndex:300, minWidth:240 }}>
          {toast.message}
        </div>
      )}

      <Footer />
    </>
  );
}