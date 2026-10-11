import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FlaskConical,
  Globe,
  Server,
  Code2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  ShieldAlert,
  ChevronDown,
  Monitor,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────── */

type Platform = 'facebook' | 'tiktok';
type Method = 'iframe' | 'proxy' | 'embed';
type TestStatus =
  | 'READY'
  | 'TESTING'
  | 'SUCCESS'
  | 'BLOCKED'
  | 'UNSUPPORTED'
  | 'INCONCLUSIVE'
  | 'ERROR';

interface StatusInfo {
  status: TestStatus;
  message: string;
  detail?: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; border: string; url: string; icon: string }> = {
  facebook: {
    label: 'Facebook',
    color: 'text-[#1877F2]',
    bg: 'bg-[#1877F2]/10',
    border: 'border-[#1877F2]/30',
    url: 'https://www.facebook.com/',
    icon: '📘',
  },
  tiktok: {
    label: 'TikTok',
    color: 'text-[#010101]',
    bg: 'bg-[#25F4EE]/10',
    border: 'border-[#FE2C55]/30',
    url: 'https://www.tiktok.com/',
    icon: '🎵',
  },
};

const METHOD_META: Record<Method, { label: string; description: string; icon: React.ComponentType<{ className?: string }> }> = {
  iframe: {
    label: 'Method 1: Direct iframe',
    description: 'Attempts to load the full platform inside an HTML iframe',
    icon: Globe,
  },
  proxy: {
    label: 'Method 2: Reverse Proxy Feasibility',
    description: 'Analyzes whether a reverse proxy could serve content through your domain',
    icon: Server,
  },
  embed: {
    label: 'Method 3: Official Embed',
    description: 'Uses official embedding SDKs for public posts and videos',
    icon: Code2,
  },
};

const STATUS_STYLES: Record<TestStatus, { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  READY: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: Info },
  TESTING: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: Loader2 },
  SUCCESS: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 },
  BLOCKED: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: XCircle },
  UNSUPPORTED: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300', icon: AlertTriangle },
  INCONCLUSIVE: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', icon: AlertTriangle },
  ERROR: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: XCircle },
};

/* ─── Status Badge ───────────────────────────────────────────────────── */

const StatusBadge: React.FC<{ status: TestStatus }> = ({ status }) => {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold ${s.bg} ${s.text} border ${s.border}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'TESTING' ? 'animate-spin' : ''}`} />
      {status}
    </span>
  );
};

/* ─── CopyButton ─────────────────────────────────────────────────────── */

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded hover:bg-slate-200/80 transition-colors"
      title="Copy URL"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   METHOD 1: Direct iframe Test
   ═══════════════════════════════════════════════════════════════════════ */

const IframeTest: React.FC<{ platform: Platform }> = ({ platform }) => {
  const meta = PLATFORM_META[platform];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'READY',
    message: 'Click "Run Test" to attempt loading the platform in an iframe.',
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runTest = useCallback(() => {
    setIsRunning(true);
    setShowIframe(true);
    setStatusInfo({
      status: 'TESTING',
      message: `Attempting to load ${meta.label} in an iframe…`,
      detail: 'The browser is sending a request to the platform. This may take a few seconds.',
    });

    // Set a timeout: if the iframe fires neither load nor error within 15s,
    // we report it as inconclusive.
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsRunning(false);
      setStatusInfo({
        status: 'INCONCLUSIVE',
        message: `The iframe did not complete loading within 15 seconds.`,
        detail:
          'This may indicate the platform blocked the request via X-Frame-Options or Content-Security-Policy, ' +
          'or the network request is still pending. Cross-origin restrictions prevent JavaScript from inspecting ' +
          'whether the iframe actually rendered content.',
      });
    }, 15000);
  }, [meta.label]);

  const handleIframeLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunning(false);

    // The load event fires even for blocked iframes (blank page).
    // We CANNOT inspect the iframe content due to cross-origin restrictions.
    // We must report this honestly.
    setStatusInfo({
      status: 'INCONCLUSIVE',
      message: `The iframe's "load" event fired, but this does NOT guarantee the content was displayed.`,
      detail:
        'Cross-origin security restrictions prevent JavaScript from inspecting the iframe content. ' +
        'Both Facebook and TikTok set X-Frame-Options: DENY (or frame-ancestors: none in CSP), ' +
        'which instructs the browser to refuse rendering. The iframe likely shows a blank page or an error page generated by the platform. ' +
        'Check the browser\'s developer console (F12 → Console) for "Refused to display" errors to confirm.',
    });
  }, []);

  const handleIframeError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setStatusInfo({
      status: 'BLOCKED',
      message: `The browser refused to load ${meta.label} in this iframe.`,
      detail:
        'The platform\'s server returned headers that block embedding:\n' +
        '• X-Frame-Options: DENY or SAMEORIGIN\n' +
        '• Content-Security-Policy: frame-ancestors \'self\'\n' +
        'This is an intentional security measure by the platform.',
    });
  }, [meta.label]);

  const resetTest = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setShowIframe(false);
    setStatusInfo({
      status: 'READY',
      message: 'Click "Run Test" to attempt loading the platform in an iframe.',
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reset when platform changes
  useEffect(() => {
    resetTest();
  }, [platform, resetTest]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runTest}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bc-navy-800 hover:bg-bc-navy-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Monitor className="w-4 h-4 text-bc-teal-300" />
          )}
          {isRunning ? 'Testing…' : 'Run Test'}
        </button>
        <button
          type="button"
          onClick={resetTest}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
        >
          <ExternalLink className="w-3.5 h-3.5 text-bc-teal-600" />
          Open {meta.label} in new tab
        </a>
      </div>

      {/* Status Panel */}
      <StatusPanel info={statusInfo} platform={platform} method="iframe" />

      {/* Iframe Container */}
      {showIframe && (
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Loading overlay */}
          {isRunning && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-slate-600">
                <Loader2 className="w-8 h-8 animate-spin text-bc-teal-500" />
                <span className="text-xs font-bold">Loading {meta.label}…</span>
              </div>
            </div>
          )}
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] truncate">{meta.url}</span>
            <CopyButton text={meta.url} />
          </div>
          <iframe
            ref={iframeRef}
            src={meta.url}
            title={`${meta.label} iframe test`}
            className="w-full h-[500px] border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      )}

      {/* Technical explanation */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Why iframe embedding usually fails
        </div>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>X-Frame-Options: DENY</strong> — The server explicitly tells the browser not to render the page in any iframe.</li>
          <li><strong>Content-Security-Policy: frame-ancestors 'none'</strong> — A newer header with the same effect, preventing any parent frame.</li>
          <li><strong>Third-party cookie restrictions</strong> — Modern browsers block third-party cookies, breaking authentication in iframes.</li>
          <li><strong>Authentication requirements</strong> — Social platforms require login, which cannot work securely inside a third-party iframe.</li>
        </ul>
        <p className="mt-2 text-slate-500 italic">
          These restrictions are security features, not bugs. They protect users from clickjacking and credential theft.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   METHOD 2: Reverse Proxy Feasibility Report
   ═══════════════════════════════════════════════════════════════════════ */

const ProxyFeasibility: React.FC<{ platform: Platform }> = ({ platform }) => {
  const meta = PLATFORM_META[platform];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedSection(prev => prev === id ? null : id);

  const sections = [
    {
      id: 'architecture',
      title: '1. Architecture Comparison',
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                name: 'Frontend iframe',
                desc: 'The browser loads the original platform URL inside an <iframe>. Your server is not involved — the browser talks directly to the platform\'s servers. Subject to X-Frame-Options and CSP restrictions.',
                verdict: 'Blocked by both platforms',
                verdictColor: 'text-red-700 bg-red-50',
              },
              {
                name: 'Reverse Proxy',
                desc: 'Your server (e.g. Cloudflare Worker) fetches pages from the platform on behalf of the user and serves them under your domain. The browser sees content from your origin.',
                verdict: 'Technically complex, legally prohibited',
                verdictColor: 'text-orange-700 bg-orange-50',
              },
              {
                name: 'Server-Side Redirect',
                desc: 'Your server responds with HTTP 301/302 redirect headers, sending the browser directly to the original platform. The user leaves your site entirely.',
                verdict: 'Works but defeats the purpose',
                verdictColor: 'text-amber-700 bg-amber-50',
              },
              {
                name: 'Same-Origin App',
                desc: 'You build your own application that consumes data via official APIs and renders it with your own UI on your domain. Fully same-origin.',
                verdict: 'Requires official API access',
                verdictColor: 'text-emerald-700 bg-emerald-50',
              },
            ].map((item) => (
              <div key={item.name} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${item.verdictColor}`}>
                  {item.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'hosting',
      title: '2. Cloudflare Pages Hosting Analysis',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong>helpseif.pages.dev</strong> is hosted on <strong>Cloudflare Pages</strong>, 
            a static site hosting platform. It serves pre-built files (HTML, JS, CSS) and does not include 
            a general-purpose server-side runtime by default.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <h5 className="font-bold text-amber-900">Cloudflare Pages alone is NOT sufficient for a reverse proxy.</h5>
            <p className="text-amber-800 text-[11px]">
              A reverse proxy requires server-side request handling. Cloudflare Pages Functions 
              (powered by Workers) could theoretically make fetch requests to external origins, but:
            </p>
            <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
              <li>Both Facebook and TikTok employ anti-bot protections (CAPTCHAs, browser fingerprinting)</li>
              <li>JavaScript-heavy SPAs cannot be proxied by simple HTML rewriting</li>
              <li>Relative URLs, API calls, and WebSocket connections would all break</li>
              <li>Session cookies are bound to the original domain and cannot be forwarded</li>
            </ul>
          </div>
          <p>
            <strong>Additional infrastructure required:</strong> A Cloudflare Worker or a dedicated server 
            could handle HTTP-level proxying, but the target platforms' technical and legal protections 
            make this approach non-viable in practice.
          </p>
        </div>
      ),
    },
    {
      id: 'compatibility',
      title: `3. ${meta.label}-Specific Compatibility Issues`,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { issue: 'Authentication & Login', status: '🔴 Blocked', detail: `${meta.label} uses OAuth flows and session cookies bound to its own domain. These cannot be proxied.` },
              { issue: 'Cookies & Sessions', status: '🔴 Blocked', detail: `Cookies are set with Domain=${platform === 'facebook' ? '.facebook.com' : '.tiktok.com'}, SameSite=Lax, and Secure flags. A proxy domain cannot access them.` },
              { issue: 'Content Security Policy', status: '🔴 Blocked', detail: `${meta.label} sends strict CSP headers that whitelist only its own domains for scripts, styles, and connections.` },
              { issue: 'JavaScript & Dynamic Content', status: '🔴 Blocked', detail: `${meta.label} is a JavaScript SPA. All API calls use absolute URLs to the platform's API servers, which reject cross-origin requests.` },
              { issue: 'Relative URLs & Assets', status: '🟠 Complex', detail: 'Static assets (images, fonts, scripts) use CDN URLs that would need rewriting. This is fragile and breaks frequently.' },
              { issue: 'Anti-Bot Protections', status: '🔴 Blocked', detail: `${meta.label} employs browser fingerprinting, CAPTCHAs, and rate limiting that detect and block automated/proxied requests.` },
            ].map((item) => (
              <div key={item.issue} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.issue}</span>
                  <span className="text-[10px] font-bold">{item.status}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'terms',
      title: '4. Terms of Service & Legal Restrictions',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-2">
            <h5 className="font-bold text-red-900">Both platforms explicitly prohibit reverse proxying.</h5>
            <ul className="list-disc list-inside text-[11px] text-red-800 space-y-1">
              <li>
                <strong>Facebook (Meta Platform Terms §3):</strong> Prohibits accessing their service through 
                automated means, scraping, or any method other than their provided interfaces.
              </li>
              <li>
                <strong>TikTok (Terms of Service §7):</strong> Prohibits reproducing, distributing, or creating 
                derivative works from TikTok's service without explicit authorization.
              </li>
              <li>
                Both platforms require use of their official APIs and embed SDKs for legitimate integration.
              </li>
            </ul>
          </div>
          <p className="text-slate-500 italic">
            A reverse proxy that serves another platform's content under your domain could constitute 
            unauthorized reproduction of their service, violating both copyright law and platform terms.
          </p>
        </div>
      ),
    },
    {
      id: 'conclusion',
      title: '5. Feasibility Conclusion',
      content: (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white border-2 border-slate-300 space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h4 className="text-sm font-extrabold text-slate-900">
                Reverse proxy is NOT feasible for {meta.label}
              </h4>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Theoretical feasibility:</strong> A Cloudflare Worker or dedicated server <em>could</em> make 
                HTTP requests to {meta.label}'s servers and return the HTML. However, the resulting page would be 
                non-functional because:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>JavaScript SPAs require API access that validates the requesting domain</li>
                <li>Authentication is impossible without the platform's cookies</li>
                <li>Anti-bot protections would block automated requests</li>
                <li>The platform's Terms of Service explicitly prohibit this approach</li>
              </ul>
              <p>
                <strong>Working, tested implementation:</strong> Not possible. This is a feasibility report only.
              </p>
              <p>
                <strong>Recommended alternative:</strong> Use <strong>Method 3 (Official Embeds)</strong> to display 
                specific public content through the platforms' official embed SDKs.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <StatusPanel
        info={{
          status: 'UNSUPPORTED',
          message: `A reverse proxy for the full ${meta.label} website is not technically or legally feasible.`,
          detail: 'This section presents a detailed feasibility analysis. No proxy was built, and no platform restrictions were bypassed.',
        }}
        platform={platform}
        method="proxy"
      />

      {/* Collapsible Report Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
            >
              <span className="text-xs font-extrabold text-slate-900">{section.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  expandedSection === section.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSection === section.id && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 animate-fade-in">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Open in new tab */}
      <div className="flex items-center gap-2">
        <a
          href={PLATFORM_META[platform].url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bc-navy-800 hover:bg-bc-navy-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-bc-teal-300" />
          Open {meta.label} in new tab (no proxy)
        </a>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   METHOD 3: Official Embed
   ═══════════════════════════════════════════════════════════════════════ */

const OfficialEmbed: React.FC<{ platform: Platform }> = ({ platform }) => {
  return platform === 'facebook' ? <FacebookEmbed /> : <TikTokEmbed />;
};

/* ─── Facebook Official Embed ───────────────────────────────────────── */

const FACEBOOK_SAMPLE_URLS = [
  'https://www.facebook.com/Meta/posts/pfbid02gT9mL9Ls3VrQnpQxjvJQVH7vNQWs4eFmipXj4FfWfZUKkVGP3Cz7GkRQ41VtZMVgl',
  'https://www.facebook.com/watch/?v=1234567890',
];

const FacebookEmbed: React.FC = () => {
  const [url, setUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'READY',
    message: 'Enter a public Facebook post or video URL and click "Embed".',
    detail: 'Supported URL formats:\n• https://www.facebook.com/{page}/posts/{id}\n• https://www.facebook.com/{page}/videos/{id}\n• https://www.facebook.com/watch/?v={id}\n• https://www.facebook.com/photo/?fbid={id}\n• https://www.facebook.com/reel/{id}',
  });
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load the Facebook SDK
  const loadFacebookSDK = useCallback(() => {
    if (document.getElementById('facebook-jssdk')) {
      setSdkLoaded(true);
      return;
    }

    // Set up the fbAsyncInit callback
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        xfbml: true,
        version: 'v21.0',
      });
      setSdkLoaded(true);
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      setStatusInfo({
        status: 'ERROR',
        message: 'Failed to load the Facebook SDK.',
        detail:
          'The Facebook JavaScript SDK could not be loaded. This may be caused by:\n' +
          '• An ad blocker or privacy extension blocking facebook.net\n' +
          '• Network restrictions blocking third-party scripts\n' +
          '• Content Security Policy blocking connect.facebook.net',
      });
    };
    document.body.appendChild(script);
  }, []);

  const validateFacebookUrl = (input: string): boolean => {
    try {
      const u = new URL(input);
      return (
        u.hostname === 'www.facebook.com' ||
        u.hostname === 'facebook.com' ||
        u.hostname === 'web.facebook.com' ||
        u.hostname === 'm.facebook.com'
      );
    } catch {
      return false;
    }
  };

  const handleEmbed = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setStatusInfo({ status: 'ERROR', message: 'Please enter a URL.', detail: 'The URL field is empty.' });
      return;
    }
    if (!validateFacebookUrl(trimmed)) {
      setStatusInfo({
        status: 'ERROR',
        message: 'Invalid Facebook URL.',
        detail: `"${trimmed}" is not a recognized Facebook URL. Please use a URL starting with https://www.facebook.com/`,
      });
      return;
    }

    setStatusInfo({ status: 'TESTING', message: 'Loading Facebook embed…' });

    loadFacebookSDK();

    // Build the embed HTML using Facebook's oEmbed-style xfbml
    const isVideo =
      trimmed.includes('/videos/') ||
      trimmed.includes('/watch') ||
      trimmed.includes('/reel/');

    const html = isVideo
      ? `<div class="fb-video" data-href="${trimmed}" data-width="auto" data-show-text="true"></div>`
      : `<div class="fb-post" data-href="${trimmed}" data-width="auto" data-show-text="true"></div>`;

    setEmbedHtml(html);

    // Use a small delay to let the DOM update, then parse
    setTimeout(() => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse(embedContainerRef.current, () => {
          // Check if the embed container actually rendered content
          const container = embedContainerRef.current;
          if (container) {
            const fbEmbed = container.querySelector('iframe, .fb_iframe_widget');
            if (fbEmbed) {
              setStatusInfo({
                status: 'SUCCESS',
                message: 'Facebook embed loaded successfully!',
                detail:
                  'The content was loaded using Facebook\'s official XFBML embed SDK. ' +
                  'Only public posts and videos can be embedded this way.',
              });
            } else {
              setStatusInfo({
                status: 'INCONCLUSIVE',
                message: 'The Facebook SDK processed the embed, but no visible content was rendered.',
                detail:
                  'This may indicate:\n' +
                  '• The post is private or restricted\n' +
                  '• The post has been deleted\n' +
                  '• The URL format is not supported for embedding\n' +
                  '• The SDK is still rendering (wait a moment)',
              });
            }
          }
        });
      } else {
        // SDK not loaded yet — set up a watcher
        const checkInterval = setInterval(() => {
          if ((window as any).FB) {
            clearInterval(checkInterval);
            (window as any).FB.XFBML.parse(embedContainerRef.current, () => {
              setStatusInfo({
                status: 'SUCCESS',
                message: 'Facebook embed loaded successfully!',
                detail:
                  'The content was loaded using Facebook\'s official XFBML embed SDK after SDK initialization.',
              });
            });
          }
        }, 500);

        // Stop checking after 10s
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!(window as any).FB) {
            setStatusInfo({
              status: 'ERROR',
              message: 'Facebook SDK failed to initialize.',
              detail: 'The SDK script was loaded but FB.init() did not complete within 10 seconds.',
            });
          }
        }, 10000);
      }
    }, 100);
  }, [url, loadFacebookSDK]);

  const handleReset = () => {
    setUrl('');
    setEmbedHtml(null);
    setStatusInfo({
      status: 'READY',
      message: 'Enter a public Facebook post or video URL and click "Embed".',
      detail: 'Supported URL formats:\n• https://www.facebook.com/{page}/posts/{id}\n• https://www.facebook.com/{page}/videos/{id}\n• https://www.facebook.com/watch/?v={id}\n• https://www.facebook.com/photo/?fbid={id}\n• https://www.facebook.com/reel/{id}',
    });
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#1877F2]" />
          Facebook Official Embed (Public Content)
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.facebook.com/Meta/posts/..."
            className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-white placeholder-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleEmbed()}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEmbed}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Sample URLs */}
        <div className="text-[11px] text-slate-500">
          <span className="font-bold">Sample URLs to test: </span>
          {FACEBOOK_SAMPLE_URLS.map((sampleUrl, i) => (
            <React.Fragment key={sampleUrl}>
              {i > 0 && <span className="mx-1">•</span>}
              <button
                type="button"
                onClick={() => setUrl(sampleUrl)}
                className="text-[#1877F2] hover:underline font-mono break-all"
              >
                {sampleUrl.length > 60 ? sampleUrl.substring(0, 60) + '…' : sampleUrl}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Status Panel */}
      <StatusPanel info={statusInfo} platform="facebook" method="embed" />

      {/* Embed container */}
      {embedHtml && (
        <div
          ref={embedContainerRef}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: embedHtml }}
        />
      )}

      {/* Info about official embeds */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Info className="w-4 h-4 text-[#1877F2]" />
          About Facebook Official Embeds
        </div>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Uses the official <strong>Facebook JavaScript SDK</strong> (connect.facebook.net/sdk.js).</li>
          <li>Only <strong>public</strong> posts, videos, and pages can be embedded. Private content is not accessible.</li>
          <li>The embed renders inside a Facebook-controlled iframe — your site does not access the content directly.</li>
          <li>Facebook controls the rendering, styling, and behavior of the embedded content.</li>
          <li>Ad blockers or privacy extensions may block the Facebook SDK, causing embeds to fail.</li>
        </ul>
      </div>
    </div>
  );
};

/* ─── TikTok Official Embed ─────────────────────────────────────────── */

const TIKTOK_SAMPLE_URLS = [
  'https://www.tiktok.com/@tiktok/video/7000000000000000000',
];

const TikTokEmbed: React.FC = () => {
  const [url, setUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'READY',
    message: 'Enter a public TikTok video URL and click "Embed".',
    detail: 'Supported URL format:\n• https://www.tiktok.com/@{user}/video/{id}\n• https://vm.tiktok.com/{shortcode}',
  });
  const embedContainerRef = useRef<HTMLDivElement>(null);

  const validateTikTokUrl = (input: string): boolean => {
    try {
      const u = new URL(input);
      return (
        u.hostname === 'www.tiktok.com' ||
        u.hostname === 'tiktok.com' ||
        u.hostname === 'vm.tiktok.com' ||
        u.hostname === 'm.tiktok.com'
      );
    } catch {
      return false;
    }
  };

  const extractVideoId = (input: string): string | null => {
    // Match /video/DIGITS pattern
    const match = input.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const loadTikTokScript = useCallback(() => {
    // Remove existing script to force re-parse
    const existing = document.getElementById('tiktok-embed-script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'tiktok-embed-script';
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onerror = () => {
      setStatusInfo({
        status: 'ERROR',
        message: 'Failed to load the TikTok embed script.',
        detail:
          'The TikTok embed script (tiktok.com/embed.js) could not be loaded. This may be caused by:\n' +
          '• An ad blocker or privacy extension blocking tiktok.com\n' +
          '• Network restrictions or geographic blocking\n' +
          '• Content Security Policy blocking the script',
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleEmbed = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setStatusInfo({ status: 'ERROR', message: 'Please enter a URL.', detail: 'The URL field is empty.' });
      return;
    }
    if (!validateTikTokUrl(trimmed)) {
      setStatusInfo({
        status: 'ERROR',
        message: 'Invalid TikTok URL.',
        detail: `"${trimmed}" is not a recognized TikTok URL. Please use a URL starting with https://www.tiktok.com/`,
      });
      return;
    }

    setStatusInfo({ status: 'TESTING', message: 'Loading TikTok embed…' });

    const videoId = extractVideoId(trimmed);

    // TikTok official embed uses a <blockquote> element with the embed.js script
    const html = `<blockquote class="tiktok-embed" cite="${trimmed}" data-video-id="${videoId || ''}" style="max-width: 605px; min-width: 325px;">
  <section>
    <a target="_blank" href="${trimmed}" rel="noopener noreferrer">Loading TikTok video…</a>
  </section>
</blockquote>`;

    setEmbedHtml(html);

    // Load/reload the TikTok embed script
    setTimeout(() => {
      loadTikTokScript();

      // Check if the embed rendered after a delay
      setTimeout(() => {
        const container = embedContainerRef.current;
        if (container) {
          const iframe = container.querySelector('iframe');
          if (iframe) {
            setStatusInfo({
              status: 'SUCCESS',
              message: 'TikTok embed loaded successfully!',
              detail:
                'The video was embedded using TikTok\'s official embed.js script. ' +
                'TikTok renders the video inside its own iframe.',
            });
          } else {
            setStatusInfo({
              status: 'INCONCLUSIVE',
              message: 'The TikTok embed script was loaded, but no video iframe appeared.',
              detail:
                'This may indicate:\n' +
                '• The video is private, deleted, or region-restricted\n' +
                '• The video ID in the URL is incorrect\n' +
                '• The embed.js script is blocked by browser extensions\n' +
                '• The embed is still loading (wait a few more seconds)',
            });
          }
        }
      }, 5000);
    }, 100);
  }, [url, loadTikTokScript]);

  const handleReset = () => {
    setUrl('');
    setEmbedHtml(null);
    setStatusInfo({
      status: 'READY',
      message: 'Enter a public TikTok video URL and click "Embed".',
      detail: 'Supported URL format:\n• https://www.tiktok.com/@{user}/video/{id}\n• https://vm.tiktok.com/{shortcode}',
    });
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          <span className="bg-gradient-to-r from-[#25F4EE] via-[#010101] to-[#FE2C55] bg-clip-text text-transparent font-black">
            TikTok
          </span>
          Official Embed (Public Videos)
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username/video/1234567890"
            className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FE2C55] bg-white placeholder-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleEmbed()}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEmbed}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#010101] hover:bg-[#1a1a1a] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Sample URL */}
        <div className="text-[11px] text-slate-500">
          <span className="font-bold">Tip: </span>
          Go to any public TikTok video, copy its URL from the browser address bar, and paste it above.
          Example format: <code className="text-[#FE2C55] font-mono">https://www.tiktok.com/@user/video/1234567890</code>
        </div>
      </div>

      {/* Status Panel */}
      <StatusPanel info={statusInfo} platform="tiktok" method="embed" />

      {/* Embed container */}
      {embedHtml && (
        <div
          ref={embedContainerRef}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[200px] flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: embedHtml }}
        />
      )}

      {/* Info about official embeds */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Info className="w-4 h-4" />
          About TikTok Official Embeds
        </div>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Uses TikTok's official <strong>embed.js</strong> script from tiktok.com/embed.js.</li>
          <li>Only <strong>public</strong> videos can be embedded. Private or deleted videos will not display.</li>
          <li>TikTok renders the video inside its own iframe — your site does not access the video data directly.</li>
          <li>Region restrictions may prevent some videos from loading in certain countries.</li>
          <li>Ad blockers or privacy extensions may block the TikTok embed script.</li>
        </ul>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   Status Panel (shared)
   ═══════════════════════════════════════════════════════════════════════ */

const StatusPanel: React.FC<{
  info: StatusInfo;
  platform: Platform;
  method: Method;
}> = ({ info, platform, method }) => {
  const meta = PLATFORM_META[platform];
  const methodMeta = METHOD_META[method];

  return (
    <div className={`p-4 rounded-2xl border ${STATUS_STYLES[info.status].border} ${STATUS_STYLES[info.status].bg} space-y-3`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <StatusBadge status={info.status} />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`font-bold ${meta.color}`}>{meta.icon} {meta.label}</span>
            <span>•</span>
            <span className="font-bold text-slate-600">{methodMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className={`text-xs font-bold ${STATUS_STYLES[info.status].text}`}>{info.message}</p>
        {info.detail && (
          <pre className="text-[11px] text-slate-600 whitespace-pre-wrap font-sans leading-relaxed mt-1">
            {info.detail}
          </pre>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   Diagnostics Panel
   ═══════════════════════════════════════════════════════════════════════ */

const DiagnosticsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-bc-teal-600" />
          <span className="text-xs font-extrabold text-slate-900">
            🔍 Diagnostics: Origin, Domain & Security Concepts
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-5 border-t border-slate-100 pt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: '🌐 Browser Address Bar',
                desc: 'Shows the URL of the top-level page your browser navigated to. For this website, it shows helpseif.pages.dev. This is the origin the browser considers the "first-party" for cookie and security purposes.',
                example: 'https://helpseif.pages.dev/social-lab',
              },
              {
                title: '📡 Content Origin',
                desc: 'The actual server that responded to a network request. When you load an iframe with facebook.com, the content comes from Facebook\'s servers, even though it appears inside your page. The origin does NOT change.',
                example: 'https://www.facebook.com (third-party origin)',
              },
              {
                title: '🖼️ iframe Host',
                desc: 'Your website (helpseif.pages.dev) is the host of the iframe element. However, the content displayed inside the iframe has its own separate origin. JavaScript on your page cannot access or inspect the iframe content when origins differ.',
                example: 'Host: helpseif.pages.dev → iframe src: facebook.com',
              },
              {
                title: '🔄 Proxy Domain',
                desc: 'A reverse proxy serves content through your domain, making it appear same-origin. However, the content still originates from the target platform\'s servers — the proxy merely relays it. Network-level APIs from the content still point to the original platform.',
                example: 'helpseif.pages.dev/social/fb/ → proxies facebook.com',
              },
            ].map((item) => (
              <div key={item.title} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="text-xs font-extrabold text-slate-900">{item.title}</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                <code className="block text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-500 break-all">
                  {item.example}
                </code>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            <strong className="text-amber-900">Key takeaway:</strong> Displaying content inside your website 
            (via iframe or embed) does <strong>not</strong> change the origin of the underlying network requests. 
            Your domain only controls the top-level page. Embedded content still communicates with its original 
            servers, and security policies are enforced based on those actual origins — not the visual arrangement on screen.
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export const SocialLabPage: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [method, setMethod] = useState<Method>('iframe');

  const activePlatform = PLATFORM_META[platform];
  const activeMethod = METHOD_META[method];
  const MethodIcon = activeMethod.icon;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5 text-bc-navy-900">
          <FlaskConical className="w-7 h-7 text-bc-navy-800" />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Social Platform Testing Lab</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Test embedding Facebook and TikTok content using three different methods. Identify what works, what's blocked, and why.
        </p>
      </div>

      {/* Platform Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">1. Select Platform</h3>
        <div className="flex gap-2">
          {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
            const m = PLATFORM_META[p];
            const isActive = platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all border-2 ${
                  isActive
                    ? `${m.bg} ${m.color} ${m.border} shadow-sm`
                    : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Method Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">2. Select Testing Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(METHOD_META) as Method[]).map((m) => {
            const mm = METHOD_META[m];
            const Icon = mm.icon;
            const isActive = method === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex items-start gap-2.5 p-3 rounded-xl text-left text-xs transition-all border-2 ${
                  isActive
                    ? 'bg-bc-navy-800 text-white border-bc-navy-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-bc-teal-300' : 'text-slate-400'}`} />
                <div>
                  <span className="font-extrabold block">{mm.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {mm.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Test Indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
        <MethodIcon className="w-4 h-4 text-bc-teal-600" />
        <span>
          Testing <strong className={activePlatform.color}>{activePlatform.icon} {activePlatform.label}</strong> with{' '}
          <strong>{activeMethod.label}</strong>
        </span>
      </div>

      {/* Test Area */}
      <div className="animate-fade-in" key={`${platform}-${method}`}>
        {method === 'iframe' && <IframeTest platform={platform} />}
        {method === 'proxy' && <ProxyFeasibility platform={platform} />}
        {method === 'embed' && <OfficialEmbed platform={platform} />}
      </div>

      {/* Diagnostics Panel */}
      <DiagnosticsPanel />

      {/* External Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">External Navigation</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
            const m = PLATFORM_META[p];
            return (
              <a
                key={p}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  p === 'facebook'
                    ? 'bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]'
                    : 'bg-[#010101] hover:bg-[#1a1a1a] text-white border-[#010101]'
                } shadow-xs`}
              >
                <span>{m.icon}</span>
                Open {m.label}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
