import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Copy,
  Download,
  Eye,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  consumePurchaseAccess,
  downloadPurchase,
  getPurchasePage,
  recordPurchaseDeliveryEvent,
  revealPurchaseDelivery,
} from "payz-sdk";
import type { PurchaseDelivery, PurchasePage } from "payz-sdk";
import { brandAssetUrl, getBrandArtwork } from "./brand-artwork";
import PayzLogo from "./PayzLogo";
import PayzBrandText from "./PayzBrandText";
import "./purchase-delivery.css";

type LeaveChecklist = {
  copiedCode: boolean;
  downloadedFile: boolean;
  savedInformation: boolean;
};

const EMPTY_CHECKLIST: LeaveChecklist = {
  copiedCode: false,
  downloadedFile: false,
  savedInformation: false,
};

function PurchaseUnavailable() {
  return (
    <main className="purchase-unavailable">
      <a className="purchase-delivery-wordmark" href="/app" aria-label="payz home"><PayzLogo decorative /></a>
      <section aria-labelledby="purchase-unavailable-title" data-testid="status-purchase-unavailable">
        <ShieldCheck aria-hidden="true" />
        <h1 id="purchase-unavailable-title" data-testid="text-purchase-unavailable">This purchase is no longer available through its one-time access page.</h1>
        <a className="purchase-delivery-secondary" href="/app" data-testid="link-return-to-explore">
          <ArrowLeft aria-hidden="true" /> Return to Explore
        </a>
      </section>
    </main>
  );
}

function ProductLogo({ page }: { page: PurchasePage }) {
  const [imageFailed, setImageFailed] = useState(false);
  const artwork = getBrandArtwork(page.brand);
  const BrandIcon = artwork.Icon;
  const image = !imageFailed
    ? (artwork.asset ? brandAssetUrl(artwork.asset) : page.productImageUrl)
    : null;

  return (
    <div
      className="purchase-delivery-product-logo"
      style={{ "--brand-color": artwork.background, "--logo-color": artwork.color } as React.CSSProperties}
      role="img"
      aria-label={`${page.brand} purchase`}
      data-testid="img-purchase-brand"
    >
      {image ? (
        <img src={image} alt="" onError={() => setImageFailed(true)} />
      ) : BrandIcon ? (
        <BrandIcon aria-hidden="true" />
      ) : (
        <ShieldCheck aria-hidden="true" />
      )}
    </div>
  );
}

export default function PurchaseDeliveryPage() {
  const { purchaseToken = "" } = useParams<{ purchaseToken: string }>();
  const [page, setPage] = useState<PurchasePage | null>(null);
  const [delivery, setDelivery] = useState<PurchaseDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasDownloadedFile, setHasDownloadedFile] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [leaveDestination, setLeaveDestination] = useState<string | null>(null);
  const [leaveChecklist, setLeaveChecklist] = useState(EMPTY_CHECKLIST);
  const [consumeError, setConsumeError] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const consumedRef = useRef(false);
  const historyLeaveRef = useRef(false);
  const sensitiveResponseOptions = {
    cache: "no-store" as RequestCache,
    referrerPolicy: "no-referrer" as ReferrerPolicy,
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setPage(null);
    setDelivery(null);
    setHasCopiedCode(false);
    setHasDownloadedFile(false);
    setIsUnavailable(false);
    void getPurchasePage(purchaseToken, sensitiveResponseOptions)
      .then((response) => {
        if (!cancelled) setPage(response);
      })
      .catch(() => {
        if (!cancelled) setIsUnavailable(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [purchaseToken]);

  useEffect(() => {
    document.title = "payz — Purchase ready";
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (showLeaveDialog && !dialog.open) dialog.showModal();
    if (!showLeaveDialog && dialog.open) dialog.close();
  }, [showLeaveDialog]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const guardState = { ...(history.state ?? {}), payzPurchaseGuard: true };
    history.replaceState(guardState, "", currentUrl);

    const onPopState = () => {
      if (consumedRef.current) return;
      const attemptedDestination = window.location.href;
      history.pushState(guardState, "", currentUrl);
      setLeaveDestination(attemptedDestination);
      historyLeaveRef.current = true;
      setLeaveChecklist(EMPTY_CHECKLIST);
      setConsumeError(false);
      setShowLeaveDialog(true);
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.href === currentUrl || destination.protocol === "javascript:") return;
      event.preventDefault();
      setLeaveDestination(destination.href);
      historyLeaveRef.current = false;
      setLeaveChecklist(EMPTY_CHECKLIST);
      setConsumeError(false);
      setShowLeaveDialog(true);
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (consumedRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("popstate", onPopState, true);
    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("popstate", onPopState, true);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [purchaseToken]);

  const recordEvent = useCallback((eventType:
    | "CODE_COPIED"
    | "REDEMPTION_LINK_OPENED") => {
    void recordPurchaseDeliveryEvent(purchaseToken, { eventType }, sensitiveResponseOptions).catch(() => undefined);
  }, [purchaseToken]);

  const openLeaveDialog = (destination = "/app") => {
    setLeaveDestination(destination);
    historyLeaveRef.current = false;
    setLeaveChecklist(EMPTY_CHECKLIST);
    setConsumeError(false);
    setShowLeaveDialog(true);
  };

  const revealDetails = async () => {
    if (delivery) {
      setDelivery(null);
      setCopyError(false);
      setActionError(false);
      return;
    }
    setIsRevealing(true);
    setCopyError(false);
    setActionError(false);
    try {
      const details = await revealPurchaseDelivery(purchaseToken, sensitiveResponseOptions);
      setDelivery(details);
    } catch {
      setActionError(true);
    } finally {
      setIsRevealing(false);
    }
  };

  const copyValue = async (value: string, isRedemptionCode = false) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      if (isRedemptionCode) {
        setHasCopiedCode(true);
        recordEvent("CODE_COPIED");
      }
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  const downloadFile = async () => {
    setIsDownloading(true);
    setActionError(false);
    try {
      const file = await downloadPurchase(purchaseToken, sensitiveResponseOptions);
      const objectUrl = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "payz-purchase.pdf";
      anchor.rel = "noreferrer";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
      setHasDownloadedFile(true);
      setActionError(false);
    } catch {
      setActionError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const confirmLeave = async () => {
    if (!page || isConsuming) return;
    setIsConsuming(true);
    setConsumeError(false);
    try {
      const result = await consumePurchaseAccess(
        purchaseToken,
        {
          copiedCode: leaveChecklist.copiedCode,
          downloadedFile: leaveChecklist.downloadedFile,
          savedInformation: leaveChecklist.savedInformation,
        },
        sensitiveResponseOptions,
      );
      if (!result.consumed) throw new Error("Purchase access was not consumed.");
      consumedRef.current = true;
      setDelivery(null);
      setPage(null);
      setShowLeaveDialog(false);
      if (historyLeaveRef.current) {
        historyLeaveRef.current = false;
        window.history.back();
      } else {
        window.location.replace(leaveDestination || "/app");
      }
    } catch {
      setConsumeError(true);
    } finally {
      setIsConsuming(false);
    }
  };

  if (isLoading) {
    return (
      <main className="purchase-delivery-loading" aria-live="polite">
        <span className="purchase-delivery-wordmark" data-testid="text-payz-wordmark"><PayzLogo /></span>
        <span className="purchase-loading-indicator" />
        <p data-testid="status-purchase-loading">Securing your purchase details…</p>
      </main>
    );
  }
  if (isUnavailable || !page) return <PurchaseUnavailable />;

  const needsConfirmation = page.hasCode || page.hasDownload || page.hasManualDetails;
  const canLeave =
    (!page.hasCode || leaveChecklist.copiedCode) &&
    (!page.hasDownload || leaveChecklist.downloadedFile) &&
    (!page.hasManualDetails || leaveChecklist.savedInformation);

  return (
    <main className="purchase-delivery-page">
      <header className="purchase-delivery-header">
        <a className="purchase-delivery-wordmark" href="/app" aria-label="payz home" data-testid="link-payz-home"><PayzLogo decorative /></a>
        <button className="purchase-close-button" type="button" onClick={() => openLeaveDialog()} aria-label="Close purchase" data-testid="button-close-purchase">
          <X aria-hidden="true" />
        </button>
      </header>

      <article className="purchase-delivery-content">
        <section className="purchase-ready-card">
          <h1>Your purchase is ready to use.</h1>
          <p><PayzBrandText text="Payz has completed payment settlement and prepared the delivery information for this purchase. Review the details and save what you need before leaving this protected page." /></p>
          <div className="purchase-delivery-product">
            <ProductLogo page={page} />
            <div>
              <strong data-testid="text-purchase-product">{page.productName || page.brand}</strong>
              {page.productName !== page.brand && <span>{page.brand}</span>}
              <span data-testid="text-purchase-total">{new Intl.NumberFormat(undefined, { style: "currency", currency: page.currency }).format(page.amount)} · {page.region}</span>
            </div>
          </div>
          <div className="purchase-payment-confirmed">
            <span data-testid="status-purchase-payment"><Check aria-hidden="true" /> Payment confirmed</span>
            <strong data-testid="text-purchase-payment-route">{page.paymentAsset} · {page.paymentNetwork}</strong>
          </div>
        </section>

        <section className="purchase-delivery-section" aria-labelledby="purchase-information-title">
          <div className="purchase-delivery-section-heading">
            <div>
              <h2 id="purchase-information-title">Redemption information</h2>
            </div>
            <LockKeyhole aria-hidden="true" />
          </div>

          {page.hasCode && (
            <div className="purchase-secret-field">
              <span>Your redemption code</span>
              <code>{delivery?.redemptionCode || "••••••••••••••••"}</code>
              <div className="purchase-secret-actions">
                <button type="button" className="purchase-delivery-primary" onClick={() => void revealDetails()} disabled={isRevealing} aria-expanded={Boolean(delivery)} aria-busy={isRevealing} data-testid="button-reveal-code">
                  <Eye aria-hidden="true" /> {isRevealing ? "Opening…" : delivery ? "Hide code" : "Reveal code"}
                </button>
                {delivery?.redemptionCode && (
                  <button type="button" className="purchase-delivery-secondary" onClick={() => void copyValue(delivery.redemptionCode!, true)} data-testid="button-copy-code">
                    <Copy aria-hidden="true" /> {hasCopiedCode ? "Copied" : "Copy code"}
                  </button>
                )}
              </div>
              {copyError && <p className="purchase-action-error" role="status">We couldn't copy the code. Please try again or copy it manually.</p>}
            </div>
          )}

          {!page.hasCode && (
              <button type="button" className="purchase-delivery-secondary purchase-reveal-details" onClick={() => void revealDetails()} disabled={isRevealing} aria-expanded={Boolean(delivery)} aria-busy={isRevealing} data-testid="button-reveal-purchase-details">
              <Eye aria-hidden="true" /> {isRevealing ? "Opening…" : delivery ? "Hide purchase details" : "Reveal purchase details"}
            </button>
          )}

          {delivery?.redemptionPin && (
            <div className="purchase-secret-field">
              <span>Redemption PIN</span>
              <code>{delivery.redemptionPin}</code>
              <div className="purchase-secret-actions">
                <button type="button" className="purchase-delivery-secondary" onClick={() => void copyValue(delivery.redemptionPin!)} data-testid="button-copy-pin">
                  <Copy aria-hidden="true" /> Copy PIN
                </button>
              </div>
            </div>
          )}

          {delivery?.redemptionInstructions && (
            <div className="purchase-redemption-instructions">
              <h3>How to redeem</h3>
              <p>{delivery.redemptionInstructions}</p>
            </div>
          )}
          {delivery?.redemptionUrl && (
            <a
              className="purchase-delivery-secondary purchase-redemption-link"
              href={delivery.redemptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordEvent("REDEMPTION_LINK_OPENED")}
              data-testid="link-redemption-page"
            >
              Open redemption page <ArrowRight aria-hidden="true" />
            </a>
          )}
          {(delivery?.expirationDate || page.expirationDate) && <p className="purchase-expiration" data-testid="text-purchase-expiration"><Clock3 aria-hidden="true" /> Expires {delivery?.expirationDate || page.expirationDate}</p>}
          {actionError && <p className="purchase-action-error" role="status" data-testid="status-purchase-action-error">Purchase details are temporarily unavailable. Please try again.</p>}
        </section>

        {page.hasDownload && (
          <section className="purchase-download-panel">
            <div><Download aria-hidden="true" /><span><strong>Keep a copy</strong><small>Download your purchase details before leaving.</small></span></div>
            <button type="button" className="purchase-delivery-secondary" onClick={() => void downloadFile()} disabled={isDownloading} aria-busy={isDownloading} data-testid="button-download-purchase">
              {isDownloading ? "Preparing…" : hasDownloadedFile ? "Downloaded" : "Download purchase"}
            </button>
          </section>
        )}

        <aside className="purchase-once-notice">
          <LockKeyhole aria-hidden="true" />
          <div>
            <strong>This purchase is available only once.</strong>
            <p>Make sure you copy your redemption information and download any available purchase file before leaving this page.</p>
          </div>
        </aside>
      </article>

      <dialog
        className="purchase-leave-dialog"
        ref={dialogRef}
        aria-labelledby="purchase-leave-title"
        aria-describedby="purchase-leave-description"
        data-testid="dialog-confirm-leave-purchase"
        onCancel={(event) => {
          event.preventDefault();
          setShowLeaveDialog(false);
          setLeaveDestination(null);
        }}
        onClose={() => {
          if (!isConsuming) setShowLeaveDialog(false);
        }}
      >
        <h2 id="purchase-leave-title">Are you ready to leave?</h2>
        <p id="purchase-leave-description">{needsConfirmation ? "Your purchase is available only once. Before leaving, make sure you have:" : "Leaving permanently ends your access to this purchase."}</p>
        <div className="purchase-leave-checklist">
          {page.hasCode && (
            <label>
              <input type="checkbox" checked={leaveChecklist.copiedCode} onChange={(event) => setLeaveChecklist((current) => ({ ...current, copiedCode: event.target.checked }))} data-testid="checkbox-confirm-code-copied" />
              <span>I have copied the redemption code</span>
            </label>
          )}
          {page.hasDownload && (
            <label>
              <input type="checkbox" checked={leaveChecklist.downloadedFile} onChange={(event) => setLeaveChecklist((current) => ({ ...current, downloadedFile: event.target.checked }))} data-testid="checkbox-confirm-file-downloaded" />
              <span>I have downloaded the purchase file</span>
            </label>
          )}
          {page.hasManualDetails && (
            <label>
              <input type="checkbox" checked={leaveChecklist.savedInformation} onChange={(event) => setLeaveChecklist((current) => ({ ...current, savedInformation: event.target.checked }))} data-testid="checkbox-confirm-details-saved" />
              <span>I have saved the redemption instructions and details</span>
            </label>
          )}
        </div>
        {consumeError && (
          <div className="purchase-consume-error" role="alert" data-testid="status-consume-error">
            <strong>We couldn't securely close this purchase.</strong>
            <span>Your purchase is still available. Please try again.</span>
          </div>
        )}
        <div className="purchase-leave-actions">
          <button
            type="button"
            className="purchase-delivery-secondary"
            data-testid="button-stay-on-purchase"
            onClick={() => {
              setShowLeaveDialog(false);
              setLeaveDestination(null);
              setLeaveChecklist(EMPTY_CHECKLIST);
              setConsumeError(false);
            }}
            disabled={isConsuming}
          >
            Go Back
          </button>
          <button
            type="button"
            className="purchase-delete-access-button"
            data-testid="button-leave-and-delete-access"
            onClick={() => void confirmLeave()}
            disabled={!canLeave || isConsuming}
            aria-busy={isConsuming}
          >
            {isConsuming ? "Closing securely…" : "Leave & Delete Access"}
          </button>
        </div>
        {consumeError && (
          <div className="purchase-leave-retry">
            <button type="button" onClick={() => void confirmLeave()} disabled={isConsuming} data-testid="button-retry-consume">Try Again</button>
            <button type="button" onClick={() => {
              setShowLeaveDialog(false);
              setLeaveDestination(null);
              setConsumeError(false);
            }} data-testid="button-dismiss-consume-error">Stay Here</button>
          </div>
        )}
      </dialog>
    </main>
  );
}
