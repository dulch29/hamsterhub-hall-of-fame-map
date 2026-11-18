import { useEffect, useId, useRef, useState } from 'react';
import type { Kid } from '../types';
import { MOCK_PROVINCE_NAMES } from '../mock/generate';
import { safeExternalUrl } from './links';

export function initialsFor(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((word) => Array.from(word)[0]).join('').toLocaleUpperCase() || '?';
}

function CardImage({ url, initials }: { url: string | null; initials?: string }) {
  const [failed, setFailed] = useState(false);
  const safeUrl = safeExternalUrl(url);
  return safeUrl && !failed ? (
    <img src={safeUrl} alt="" referrerPolicy="no-referrer" loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <span className="pin-card__placeholder" aria-hidden="true">{initials ?? 'No preview'}</span>
  );
}

export function PinCard({ kid, onClose }: { kid: Kid; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const project = kid.featuredProject;
  const projectUrl = safeExternalUrl(project?.url);
  const profileUrl = safeExternalUrl(kid.profileUrl);

  useEffect(() => {
    const element = dialog.current;
    const invoker = document.activeElement;
    if (element && !element.open) element.showModal();
    return () => {
      if (element?.open) element.close();
      if (invoker instanceof HTMLElement && invoker.isConnected) invoker.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="pin-card"
      aria-labelledby={headingId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="pin-card__content">
        <button className="pin-card__close" type="button" autoFocus onClick={onClose}>
          Close<span className="visually-hidden"> student card</span>
        </button>
        <div className="pin-card__identity">
          <div className="pin-card__avatar">
            <CardImage key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} />
          </div>
          <div>
            <h2 id={headingId}>{kid.displayName}</h2>
            <p>{MOCK_PROVINCE_NAMES[kid.province] ?? kid.province}</p>
          </div>
        </div>
        {project ? (
          <section className="pin-card__project" aria-label="Featured project">
            <div className="pin-card__thumbnail">
              <CardImage key={project.thumbnailUrl} url={project.thumbnailUrl} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            {projectUrl && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                View project<span className="visually-hidden">: {project.title} (opens in a new tab)</span>
              </a>
            )}
          </section>
        ) : <p>No featured project yet</p>}
        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            See more<span className="visually-hidden"> from {kid.displayName} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </dialog>
  );
}
