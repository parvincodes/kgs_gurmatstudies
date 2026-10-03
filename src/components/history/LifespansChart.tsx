"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent } from "react";
import {
  ANCHOR_EVENTS,
  AXIS_END,
  AXIS_START,
  EMPIRE_YEARS,
  PERSON_GROUPS,
  formatLifeYears,
  type Person,
} from "@/lib/sikh-empire-chronology";
import styles from "./LifespansChart.module.css";

/** Drawn length, in years, of the dashed lead-in when a birth year is not known. */
const UNKNOWN_BIRTH_SPAN = 40;
/** On a narrow screen the chart opens scrolled to about this year. */
const OPENING_YEAR = 1772;

const DECADES: number[] = [];
for (let y = AXIS_START; y <= AXIS_END; y += 10) DECADES.push(y);

/** Position of a year along the axis, as a percentage, clamped to the axis. */
function pct(year: number): number {
  const clamped = Math.min(Math.max(year, AXIS_START), AXIS_END);
  return ((clamped - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
}

function barStart(person: Person): number {
  return person.birth === null ? person.death - UNKNOWN_BIRTH_SPAN : person.birth;
}

function extraNote(person: Person): string | null {
  if (person.birth === null) {
    return "Birth year not known. The dashed line does not mark a starting point.";
  }
  if (person.birthCertainty === "approximate") return "Birth year is approximate.";
  if (person.birth < AXIS_START) return `Born ${person.birth}, before the chart begins.`;
  if (person.death > AXIS_END) return `Died ${person.death}, after the chart ends.`;
  return null;
}

type Shown = { person: Person; group: string };

function AxisRow() {
  return (
    <div className={styles.headRow} aria-hidden="true">
      <div className={styles.headName} />
      <div className={`${styles.headCell} ${styles.axisCell}`}>
        {DECADES.map((y) => (
          <span
            key={y}
            className={`${styles.tick} ${y % 50 === 0 ? styles.tickMajor : ""}`}
            style={{ left: `${pct(y)}%` }}
          >
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LifespansChart() {
  const [shown, setShown] = useState<Shown | null>(null);
  const pinnedRef = useRef<string | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  /** Put the tooltip above its anchor (or below, if there is no room), inside the viewport. */
  const placeTip = useCallback(() => {
    const tip = tipRef.current;
    const anchor = anchorRef.current;
    const scroller = scrollRef.current;
    if (!tip || !anchor || !scroller) return;

    const r = anchor.getBoundingClientRect();
    const sc = scroller.getBoundingClientRect();
    let left = Math.max(r.left, sc.left);
    const right = Math.min(r.right, sc.right);
    if (anchor.dataset.kind === "bar") {
      // Keep clear of the sticky name column, which covers the left of the track.
      const name = anchor.closest("[data-row]")?.firstElementChild;
      if (name) left = Math.max(left, name.getBoundingClientRect().right);
    }
    const cx = right > left ? (left + right) / 2 : (sc.left + sc.right) / 2;
    const vw = document.documentElement.clientWidth;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const x = Math.min(Math.max(cx - tw / 2, 12), Math.max(12, vw - tw - 12));
    let y = r.top - th - 8;
    if (y < 76) y = r.bottom + 8; // 76px clears the sticky site header
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }, []);

  const show = useCallback((info: Shown, anchor: HTMLElement) => {
    anchorRef.current = anchor;
    setShown(info);
  }, []);

  const hide = useCallback(() => {
    pinnedRef.current = null;
    anchorRef.current = null;
    setShown(null);
  }, []);

  useLayoutEffect(() => {
    if (shown) placeTip();
  }, [shown, placeTip]);

  useEffect(() => {
    const scroller = scrollRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    // A click anywhere else closes the tooltip. Clicks on a name or bar are
    // handled by that button, so they are ignored here.
    const onDocClick = (e: globalThis.MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("[data-kind]")) return;
      hide();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", placeTip, { passive: true });
    window.addEventListener("resize", placeTip);
    scroller?.addEventListener("scroll", placeTip, { passive: true });
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", placeTip);
      window.removeEventListener("resize", placeTip);
      scroller?.removeEventListener("scroll", placeTip);
    };
  }, [hide, placeTip]);

  // On a narrow screen, open the chart on the empire years rather than on 1700.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 4) return;
    const track = scroller.querySelector<HTMLElement>("[data-track]");
    const name = track?.previousElementSibling as HTMLElement | null;
    if (!track || !name) return;
    scroller.scrollLeft =
      track.offsetLeft - name.offsetWidth + (track.offsetWidth * pct(OPENING_YEAR)) / 100;
  }, []);

  const handlers = (info: Shown) => ({
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && !pinnedRef.current) show(info, e.currentTarget);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && !pinnedRef.current) hide();
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      if (!pinnedRef.current) show(info, e.currentTarget);
    },
    onBlur: () => {
      if (!pinnedRef.current) hide();
    },
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (pinnedRef.current === info.person.name && anchorRef.current === e.currentTarget) {
        hide();
      } else {
        pinnedRef.current = info.person.name;
        show(info, e.currentTarget);
      }
    },
  });

  const empireLeft = pct(EMPIRE_YEARS[0]);
  const empireWidth = pct(EMPIRE_YEARS[1]) - empireLeft;
  const note = shown ? extraNote(shown.person) : null;

  return (
    <div>
      <ul className={styles.key} aria-label="Chart key">
        <li>
          <i className={`${styles.keyMark} ${styles.keyBand}`} />
          Sikh Empire, {EMPIRE_YEARS[0]}–{EMPIRE_YEARS[1]}
        </li>
        <li>
          <i className={`${styles.keyMark} ${styles.keyMarker}`} />
          Turning point
        </li>
        <li>
          <i className={`${styles.keyMark} ${styles.keyApprox}`} />
          Birth year approximate (c.)
        </li>
        <li>
          <i className={`${styles.keyMark} ${styles.keyUnknown}`} />
          Birth year not known
        </li>
        <li>
          <i className={`${styles.keyMark} ${styles.keyOff}`} />
          Life runs past the axis
        </li>
      </ul>
      <p className={styles.swipeHint}>
        Swipe the chart sideways to move through the years. The names stay in place.
      </p>

      <div
        ref={scrollRef}
        className={styles.scroll}
        tabIndex={0}
        role="region"
        aria-label={`Lifespans chart, ${AXIS_START} to ${AXIS_END}. Scrolls sideways on narrow screens.`}
      >
        <div className={styles.chart}>
          <div className={styles.under} aria-hidden="true">
            <div
              className={styles.empire}
              style={{ left: `${empireLeft}%`, width: `${empireWidth}%` }}
            />
            {DECADES.map((y) => (
              <div
                key={y}
                className={`${styles.gridline} ${y % 50 === 0 ? styles.gridlineMajor : ""}`}
                style={y === AXIS_END ? { right: 0 } : { left: `${pct(y)}%` }}
              />
            ))}
          </div>

          <AxisRow />

          <div className={styles.headRow} aria-hidden="true">
            <div className={styles.headName} />
            <div className={`${styles.headCell} ${styles.bandCell}`}>
              <span
                className={styles.bandLabel}
                style={{ left: `${empireLeft}%`, width: `${empireWidth}%` }}
              >
                Sikh Empire
              </span>
            </div>
          </div>

          {/* One label per tier, latest on top, so no label crosses another line. */}
          <div className={styles.headRow} aria-hidden="true">
            <div className={`${styles.headName} ${styles.headNameTop}`}>Turning points</div>
            <div className={`${styles.headCell} ${styles.markerCell}`}>
              {ANCHOR_EVENTS.map((m, i) => (
                <div
                  key={m.when}
                  className={styles.markerLabel}
                  style={{
                    right: `${100 - pct(m.year)}%`,
                    top: `calc(var(--tier-h) * ${ANCHOR_EVENTS.length - 1 - i})`,
                  }}
                >
                  <b>{m.when}</b> {m.label}
                </div>
              ))}
            </div>
          </div>

          {PERSON_GROUPS.map((group, gi) => {
            const colour = { "--c": `var(--g${gi + 1})` } as CSSProperties;
            return (
              <div key={group.name} style={colour}>
                <div className={styles.group}>
                  <h3 className={styles.groupLabel}>
                    <i className={styles.swatch} />
                    <span>{group.name}</span>
                    <small className={styles.groupCount}>{group.people.length} people</small>
                  </h3>
                </div>
                {group.people.map((person) => {
                  const info = { person, group: group.name };
                  const start = barStart(person);
                  const years = formatLifeYears(person);
                  const fill = [
                    styles.fill,
                    person.birthCertainty === "approximate" ? styles.fillApprox : "",
                    person.birthCertainty === "unknown" ? styles.fillUnknown : "",
                    start < AXIS_START ? styles.fillClipLeft : "",
                    person.death > AXIS_END ? styles.fillClipRight : "",
                  ].join(" ");
                  const on = shown?.person.name === person.name;
                  return (
                    <div
                      key={person.name}
                      data-row=""
                      className={`${styles.row} ${on ? styles.rowOn : ""}`}
                    >
                      <button
                        type="button"
                        data-kind="name"
                        className={styles.name}
                        aria-label={`${person.name}, ${years}. ${person.role}`}
                        {...handlers(info)}
                      >
                        <span className={styles.nameText}>{person.name}</span>
                        <span className={styles.years}>{years}</span>
                      </button>
                      <div className={styles.track} data-track="">
                        <button
                          type="button"
                          data-kind="bar"
                          tabIndex={-1}
                          aria-hidden="true"
                          className={styles.bar}
                          style={{
                            left: `${pct(start)}%`,
                            width: `${pct(person.death) - pct(start)}%`,
                          }}
                          {...handlers(info)}
                        >
                          <span className={fill} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <AxisRow />

          <div className={styles.over} aria-hidden="true">
            {ANCHOR_EVENTS.map((m, i) => (
              <div
                key={m.when}
                className={`${styles.marker} ${m.endYear ? styles.markerSpan : ""}`}
                style={{
                  left: `${pct(m.year)}%`,
                  top: `calc(var(--tier-h) * ${ANCHOR_EVENTS.length - 1 - i})`,
                  width: m.endYear ? `${pct(m.endYear) - pct(m.year)}%` : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {shown && (
        <div ref={tipRef} className={styles.tip} role="tooltip">
          <strong className={styles.tipName}>{shown.person.name}</strong>
          <span className={styles.tipMeta}>
            {formatLifeYears(shown.person)} · {shown.group}
          </span>
          <span>{shown.person.role}</span>
          {note && <span className={styles.tipExtra}>{note}</span>}
        </div>
      )}
    </div>
  );
}
