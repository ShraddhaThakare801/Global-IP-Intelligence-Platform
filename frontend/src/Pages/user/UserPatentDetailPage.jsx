import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function UserPatentDetailPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const { lensId } = useParams();

  const patent = location.state?.patent;

  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (!lensId) return;
    api.get(`/api/subscriptions/${lensId}/status`)
      .then(res => setSubscribed(res.data.subscribed))
      .catch(() => {});
  }, [lensId]);

  const handleSubscribe = async () => {
    setSubLoading(true);
    try {
      await api.post(`/api/subscriptions/${lensId}`, {
        title: patent?.title || "",
        jurisdiction: patent?.jurisdiction || "",
        datePub: patent?.datePublished || "",
      });
      setSubscribed(true);
      toast.success("Subscribed successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Already subscribed.");
        setSubscribed(true);
      } else {
        toast.error("Failed to subscribe.");
      }
    } finally {
      setSubLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setSubLoading(true);
    try {
      await api.delete(`/api/subscriptions/${lensId}`);
      setSubscribed(false);
      toast.success("Unsubscribed successfully!");
    } catch {
      toast.error("Failed to unsubscribe.");
    } finally {
      setSubLoading(false);
    }
  };

  if (!patent) {
    return (
      <div className="text-center text-red-400 p-10">
        Patent not found  
        <br />
        <button onClick={() => navigate(-1)} className="text-indigo-400 underline mt-2">
          Go Back
        </button>
      </div>
    );
  }

  return (

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* TOP BAR */}
      <div className="flex justify-between items-center flex-wrap gap-4">

        <button onClick={() => navigate(-1)} className="btn">
          ← Back
        </button>

        <button
          onClick={subscribed ? handleUnsubscribe : handleSubscribe}
          disabled={subLoading}
          className={`btn ${subscribed ? "btn-red" : "btn-green"}`}
        >
          {subLoading ? "..." : subscribed ? "🔔 Unsubscribe" : "🔔 Subscribe"}
        </button>

      </div>

      {/* TITLE CARD */}
      <div className="glass-card">

        <h1 className="title">{patent.title}</h1>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">

          <span>📄 {patent.docNumber}</span>
          <span>🌍 {patent.jurisdiction}</span>
          <span>📅 {patent.datePublished}</span>

        </div>

      </div>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="Lens ID" value={patent.lensId}/>
        <Info label="Kind Code" value={patent.kind}/>
        <Info label="Publication Type" value={patent.publicationType}/>
        <Info label="Legal Status" value={patent.legalStatusCode}/>
      </div>

      {/* APPLICANTS */}
      <Section title="Applicants">
        {patent.applicants?.map((a,i)=>(<Tag key={i} text={a}/>))}
      </Section>

      {/* INVENTORS */}
      <Section title="Inventors">
        {patent.inventors?.map((i,index)=>(<Tag key={index} text={i}/>))}
      </Section>

      {/* ABSTRACT */}
      <Section title="Abstract">
        <p className="text-gray-300 leading-relaxed">{patent.abstract}</p>
      </Section>

      {/* STYLE */}
      <style jsx>{`

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .title {
          font-size:22px;
          font-weight:bold;
          color:#818cf8;
        }

        .btn {
          padding:10px 20px;
          border-radius:10px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover {
          background:#6366f1;
          transform:scale(1.05);
        }

        .btn-green {
          background:#16a34a;
        }

        .btn-red {
          background:#dc2626;
        }

      `}</style>

    </div>

  );
}

/* INFO */
function Info({label,value}) {
  return (
    <div className="card">
      <p className="label">{label}</p>
      <p className="value">{value || "N/A"}</p>

      <style jsx>{`
        .card {
          background:#020617;
          padding:15px;
          border-radius:12px;
          transition:0.3s;
        }
        .card:hover {
          box-shadow:0 0 20px rgba(99,102,241,0.3);
        }
        .label {
          color:#9ca3af;
          font-size:12px;
        }
        .value {
          font-weight:600;
        }
      `}</style>
    </div>
  );
}

/* SECTION */
function Section({title,children}) {
  return (
    <div className="glass-card">
      <h3 className="section-title">{title}</h3>
      {children}

      <style jsx>{`
        .section-title {
          color:#818cf8;
          margin-bottom:10px;
        }
      `}</style>
    </div>
  );
}

/* TAG */
function Tag({text}) {
  return (
    <span className="tag">{text}

      <style jsx>{`
        .tag {
          display:inline-block;
          background:#6366f1;
          padding:5px 12px;
          border-radius:999px;
          margin:4px;
          font-size:12px;
        }
      `}</style>

    </span>
  );
}