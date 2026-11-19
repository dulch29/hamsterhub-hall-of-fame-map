import { useEffect, useId, useRef, useState } from "react";
import type { Kid } from "../types";
import { provinceNames } from "../geo/provinces";
import { safeExternalUrl, safeImageUrl } from "./links";

export function initialsFor(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => Array.from(word)[0])
      .join("")
      .toLocaleUpperCase() || "?"
  );
}

export function CardImage({
  url,
  initials,
  fallback = "No preview",
  allowLocal = false,
}: {
  url: string | null;
  initials?: string;
  fallback?: string;
  allowLocal?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const safeUrl = allowLocal ? safeImageUrl(url) : safeExternalUrl(url);
  return safeUrl && !failed ? (
    <img
      src={safeUrl}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="pin-card__placeholder" aria-hidden="true">
      {initials ?? fallback}
    </span>
  );
}

export function PinCard({ kid, onClose, restoreFocus }: { kid: Kid; onClose: () => void; restoreFocus?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const requestClose = useRef(() => {});
  const callbacks = useRef({ onClose, restoreFocus });
  const headingId = useId();
  const project = kid.featuredProject;
  const projectUrl = safeExternalUrl(project?.url);
  const profileUrl = safeExternalUrl(kid.profileUrl);

  useEffect(() => {
    callbacks.current = { onClose, restoreFocus };
  }, [onClose, restoreFocus]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const invoker = document.activeElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let closing = false;
    let closed = false;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    const finishClose = () => {
      if (!active || closed) return;
      closed = true;
      clearTimeout(closeTimer);
      // The parent unmounts the dialog; cleanup closes it and restores focus.
      callbacks.current.onClose();
    };

    requestClose.current = () => {
      if (!active || closing || closed) return;
      closing = true;
      backdropPress.current = false;
      element.dataset.motion = "closing";
      if (reducedMotion.matches) {
        finishClose();
        return;
      }
      // A hidden tab may suspend transition completion events.
      closeTimer = setTimeout(finishClose, 300);

      // Flush the new target so interrupted entrance transitions retarget from
      // their current values. Include ::backdrop, which belongs to the dialog.
      const transitions = element
        .getAnimations({ subtree: true })
        .filter((animation) => (animation.effect as KeyframeEffect | null)?.target === element);
      if (transitions.length === 0) {
        finishClose();
        return;
      }
      void Promise.allSettled(transitions.map((animation) => animation.finished))
        .then(finishClose);
    };

    const handleMotionChange = () => {
      if (!reducedMotion.matches) return;
      if (closing) finishClose();
      else element.dataset.motion = "open";
    };
    reducedMotion.addEventListener("change", handleMotionChange);

    element.dataset.motion = reducedMotion.matches ? "open" : "starting";
    if (!element.open) element.showModal();
    if (!reducedMotion.matches) {
      // Establish both starting styles in the top layer before transitioning.
      try {
        getComputedStyle(element).opacity;
        getComputedStyle(element, "::backdrop").opacity;
      } catch {
        // Older engines may not expose computed pseudo-element styles.
      } finally {
        element.dataset.motion = "open";
      }
    }
    // StrictMode can reopen before the previous close event is delivered.
    const handleNativeClose = () => {
      if (!element.open) finishClose();
    };
    element.addEventListener("close", handleNativeClose);

    return () => {
      active = false;
      clearTimeout(closeTimer);
      element.removeEventListener("close", handleNativeClose);
      requestClose.current = () => {};
      backdropPress.current = false;
      reducedMotion.removeEventListener("change", handleMotionChange);
      if (element.open) element.close();
      if (invoker instanceof HTMLElement && invoker.isConnected)
        invoker.focus();
      else callbacks.current.restoreFocus?.();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="pin-card"
      data-motion="starting"
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose.current();
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onPointerUp={(event) => {
        backdropPress.current =
          backdropPress.current && event.target === event.currentTarget;
      }}
      onPointerCancel={() => {
        backdropPress.current = false;
      }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget)
          requestClose.current();
        backdropPress.current = false;
      }}
    >
      <div className="pin-card__content">
        <button
          className="pin-card__close"
          type="button"
          autoFocus
          onClick={() => requestClose.current()}
        >
          Close<span className="visually-hidden"> student card</span>
        </button>
        <div className="pin-card__identity">
          <div className="pin-card__avatar">
            <CardImage
              key={kid.avatarUrl}
              url={kid.avatarUrl}
              initials={initialsFor(kid.displayName)}
            />
          </div>
          <div>
            <h2 id={headingId}>{kid.displayName}</h2>
            <p>{provinceNames[kid.province] ?? kid.province}</p>
          </div>
        </div>
        {project ? (
          <section className="pin-card__project" aria-label="Featured project">
            <div className="pin-card__thumbnail">
              <CardImage
                key={project.thumbnailUrl}
                url={project.thumbnailUrl}
              />
            </div>
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            {projectUrl && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                View project
                <span className="visually-hidden">
                  : {project.title} (opens in a new tab)
                </span>
              </a>
            )}
          </section>
        ) : (
          <p>No featured project yet</p>
        )}
        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            See more
            <span className="visually-hidden">
              {" "}
              from {kid.displayName} (opens in a new tab)
            </span>
          </a>
        )}
      </div>
    </dialog>
  );
}
