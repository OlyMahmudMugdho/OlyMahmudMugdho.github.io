export type DiagramStatus = 'default' | 'hit' | 'accent' | 'muted';

const ISO_DX = 13;
const ISO_DY = 8;
const MONO_FONT =
    'var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace';

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function hashString(input: string): string {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}

function estimateTextWidth(text: string, asciiCharWidth: number): number {
    let width = 0;
    for (const ch of text) {
        const code = ch.codePointAt(0) ?? 0;
        if (code > 0x7f) {
            // Combining marks (e.g. Bengali vowel signs / hasanta) add less width
            if (
                (code >= 0x09bc && code <= 0x09cd) ||
                code === 0x0981 ||
                code === 0x0982 ||
                code === 0x0983
            ) {
                width += asciiCharWidth * 0.45;
            } else {
                width += asciiCharWidth * 1.15;
            }
        } else {
            width += asciiCharWidth;
        }
    }
    return Math.ceil(width);
}

function extractStatus(raw: string): { text: string; status: DiagramStatus } {
    const match = raw.match(/\s+!(hit|accent|muted)\s*$/);
    if (!match) {
        return { text: raw.trim(), status: 'default' };
    }
    return {
        text: raw.slice(0, match.index).trim(),
        status: match[1] as DiagramStatus,
    };
}

function getPalette(status: DiagramStatus, uid: string) {
    const hatchOrangeId = `iso-hatch-orange-${uid}`;
    const hatchGreenId = `iso-hatch-green-${uid}`;
    const hatchMutedId = `iso-hatch-muted-${uid}`;

    const topFill =
        status === 'hit'
            ? '#DCF7C8'
            : status === 'accent'
            ? '#FDE4D8'
            : status === 'muted'
            ? '#EFE9DF'
            : '#FFFDF8';

    const frontFill =
        status === 'hit'
            ? '#C7F2A7'
            : status === 'accent'
            ? '#F16C38'
            : status === 'muted'
            ? '#E7E0D4'
            : '#FFFDF8';

    const rightFill =
        status === 'hit'
            ? `url(#${hatchGreenId})`
            : status === 'muted'
            ? `url(#${hatchMutedId})`
            : `url(#${hatchOrangeId})`;

    const textColor =
        status === 'accent'
            ? '#FFFDF8'
            : status === 'muted'
            ? '#5C554C'
            : '#191715';

    const strokeColor = status === 'muted' ? '#7A7267' : '#191715';

    return { topFill, frontFill, rightFill, textColor, strokeColor };
}

function renderIsoBox(
    x: number,
    y: number,
    w: number,
    h: number,
    status: DiagramStatus,
    uid: string
): string {
    const { topFill, frontFill, rightFill, strokeColor } = getPalette(status, uid);
    const topPoints = `${x.toFixed(1)},${y.toFixed(1)} ${(x + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w).toFixed(1)},${y.toFixed(1)}`;
    const rightPoints = `${(x + w).toFixed(1)},${y.toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y + h - ISO_DY).toFixed(1)} ${(x + w).toFixed(1)},${(y + h).toFixed(1)}`;

    return (
        `<polygon points="${topPoints}" fill="${topFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />` +
        `<polygon points="${rightPoints}" fill="${rightFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />` +
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" fill="${frontFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />`
    );
}

function wrapDiagramSvg(
    uid: string,
    width: number,
    height: number,
    ariaLabel: string,
    bodyLines: string[]
): string {
    const gridId = `iso-grid-${uid}`;
    const hatchOrangeId = `iso-hatch-orange-${uid}`;
    const hatchGreenId = `iso-hatch-green-${uid}`;
    const hatchMutedId = `iso-hatch-muted-${uid}`;

    return [
        `<figure class="iso-diagram not-prose my-6">`,
        `<div class="iso-diagram-inner">`,
        `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(ariaLabel)}" xmlns="http://www.w3.org/2000/svg">`,
        `<defs>`,
        `  <pattern id="${gridId}" width="40" height="24" patternUnits="userSpaceOnUse">`,
        `    <path d="M 0 12 L 20 0 L 40 12 L 20 24 Z" fill="none" stroke="rgba(25, 23, 21, 0.065)" stroke-width="1" />`,
        `  </pattern>`,
        `  <pattern id="${hatchOrangeId}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`,
        `    <rect width="5" height="5" fill="#FDE4D8" />`,
        `    <line x1="0" y1="0" x2="0" y2="5" stroke="#F16C38" stroke-width="2.4" />`,
        `  </pattern>`,
        `  <pattern id="${hatchGreenId}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`,
        `    <rect width="5" height="5" fill="#DCF7C8" />`,
        `    <line x1="0" y1="0" x2="0" y2="5" stroke="#2D8A4E" stroke-width="2.4" />`,
        `  </pattern>`,
        `  <pattern id="${hatchMutedId}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`,
        `    <rect width="5" height="5" fill="#EFE9DF" />`,
        `    <line x1="0" y1="0" x2="0" y2="5" stroke="#A69D91" stroke-width="2.2" />`,
        `  </pattern>`,
        `</defs>`,
        `<rect x="0" y="0" width="${width}" height="${height}" fill="#FAF6EE" />`,
        `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#${gridId})" />`,
        ...bodyLines,
        `</svg>`,
        `</div>`,
        `</figure>`,
    ].join('\n');
}

function renderTitlePill(title: string, centerX: number, y: number): string {
    const pillW = Math.max(80, estimateTextWidth(title, 7.6) + 24);
    return (
        `<g transform="translate(${centerX.toFixed(1)}, ${y.toFixed(1)})">` +
        `<rect x="${(-pillW / 2).toFixed(1)}" y="-12" width="${pillW}" height="24" rx="6" fill="#FFFDF8" stroke="#191715" stroke-width="1.25" />` +
        `<text x="0" y="4" text-anchor="middle" font-size="11.5" font-weight="700" fill="#191715" font-family="${MONO_FONT}">${escapeXml(title)}</text>` +
        `</g>`
    );
}

function renderArrowHead(
    x: number,
    y: number,
    dir: 'right' | 'left' | 'down',
    color = '#191715'
): string {
    if (dir === 'right') {
        return `<polygon points="${x.toFixed(1)},${y.toFixed(1)} ${(x - 8).toFixed(1)},${(y - 4.5).toFixed(1)} ${(x - 8).toFixed(1)},${(y + 4.5).toFixed(1)}" fill="${color}" />`;
    }
    if (dir === 'left') {
        return `<polygon points="${x.toFixed(1)},${y.toFixed(1)} ${(x + 8).toFixed(1)},${(y - 4.5).toFixed(1)} ${(x + 8).toFixed(1)},${(y + 4.5).toFixed(1)}" fill="${color}" />`;
    }
    return `<polygon points="${x.toFixed(1)},${y.toFixed(1)} ${(x - 4.5).toFixed(1)},${(y - 8).toFixed(1)} ${(x + 4.5).toFixed(1)},${(y - 8).toFixed(1)}" fill="${color}" />`;
}

// ============================================================================
// 1. Sequence Diagram (` ```sequence `)
// ============================================================================

interface SequenceActor {
    label: string;
    sublabel?: string;
    status: DiagramStatus;
}

interface SequenceStep {
    kind: 'right' | 'left' | 'both' | 'banner';
    label: string;
    status: DiagramStatus;
}

export function renderSequenceSvg(source: string): string {
    const rawLines = source
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (rawLines.length === 0) return '';

    let title: string | undefined;
    let leftActor: SequenceActor = { label: 'Client', status: 'default' };
    let rightActor: SequenceActor = { label: 'Server', status: 'accent' };
    const steps: SequenceStep[] = [];

    for (const line of rawLines) {
        const titleMatch = line.match(/^title:\s*(.+)$/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }
        const actorsMatch = line.match(/^actors:\s*(.+)$/i);
        if (actorsMatch) {
            const parts = actorsMatch[1].split('|').map((s) => s.trim());
            const parseActor = (raw: string, fallbackStatus: DiagramStatus): SequenceActor => {
                const { text, status } = extractStatus(raw);
                const colonIdx = text.indexOf(' : ');
                const finalStatus = raw.includes('!') ? status : fallbackStatus;
                if (colonIdx !== -1) {
                    return {
                        label: text.slice(0, colonIdx).trim(),
                        sublabel: text.slice(colonIdx + 3).trim(),
                        status: finalStatus,
                    };
                }
                return { label: text, status: finalStatus };
            };
            if (parts[0]) leftActor = parseActor(parts[0], 'default');
            if (parts[1]) rightActor = parseActor(parts[1], 'accent');
            continue;
        }
        if (line.startsWith('==')) {
            const cleaned = line.replace(/^=+\s*/, '').replace(/\s*=+$/, '');
            const { text, status } = extractStatus(cleaned);
            steps.push({
                kind: 'banner',
                label: text,
                status: cleaned.includes('!') ? status : 'hit',
            });
            continue;
        }
        if (line.startsWith('<->')) {
            const { text, status } = extractStatus(line.slice(3).trim());
            steps.push({ kind: 'both', label: text, status });
            continue;
        }
        if (line.startsWith('->')) {
            const { text, status } = extractStatus(line.slice(2).trim());
            steps.push({ kind: 'right', label: text, status });
            continue;
        }
        if (line.startsWith('<-')) {
            const { text, status } = extractStatus(line.slice(2).trim());
            steps.push({ kind: 'left', label: text, status });
            continue;
        }
    }

    if (steps.length === 0) return '';

    const uid = hashString('seq:' + source);
    const hasSub = Boolean(leftActor.sublabel || rightActor.sublabel);
    const actorH = hasSub ? 48 : 34;

    const actorWidth = (a: SequenceActor) =>
        Math.max(
            128,
            estimateTextWidth(a.label, 8.2) + 28,
            a.sublabel ? estimateTextWidth(a.sublabel, 7.0) + 28 : 0
        );

    const leftW = actorWidth(leftActor);
    const rightW = actorWidth(rightActor);

    const maxMsgW = Math.max(
        220,
        ...steps.map((s) => estimateTextWidth(s.label, 7.4) + 56)
    );

    const padX = 36;
    const padY = 28;
    const titleOffset = title ? 32 : 0;

    // Distance between left lifeline center and right lifeline center
    const minSpan = Math.max(maxMsgW + 44, (leftW + rightW) / 2 + 120);
    const totalWidth = Math.max(
        520,
        Math.round(padX * 2 + leftW / 2 + minSpan + rightW / 2 + ISO_DX)
    );

    const leftCx = padX + leftW / 2;
    const rightCx = totalWidth - padX - ISO_DX - rightW / 2;
    const actorY = padY + titleOffset + ISO_DY;

    const stepGap = 54;
    const firstStepY = actorY + actorH + 38;
    const lastStepY = firstStepY + (steps.length - 1) * stepGap;
    const lifelineEndY = lastStepY + 30;
    const totalHeight = Math.round(lifelineEndY + padY);

    const svgParts: string[] = [];

    if (title) {
        svgParts.push(renderTitlePill(title, totalWidth / 2, padY + 6));
    }

    // Lifelines
    svgParts.push(
        `<line x1="${leftCx.toFixed(1)}" y1="${(actorY + actorH).toFixed(1)}" x2="${leftCx.toFixed(1)}" y2="${lifelineEndY.toFixed(1)}" stroke="#9E958A" stroke-width="1.5" stroke-dasharray="5 4" />`
    );
    svgParts.push(
        `<line x1="${rightCx.toFixed(1)}" y1="${(actorY + actorH).toFixed(1)}" x2="${rightCx.toFixed(1)}" y2="${lifelineEndY.toFixed(1)}" stroke="#9E958A" stroke-width="1.5" stroke-dasharray="5 4" />`
    );

    // Actors
    const drawActor = (actor: SequenceActor, cx: number, w: number) => {
        const x = cx - w / 2;
        const { textColor } = getPalette(actor.status, uid);
        const subColor = actor.status === 'accent' ? '#FDE4D8' : '#5C554C';
        const mainY = actor.sublabel ? actorY + 20 : actorY + actorH / 2 + 4.5;
        return (
            `<g>` +
            renderIsoBox(x, actorY, w, actorH, actor.status, uid) +
            `<text x="${cx.toFixed(1)}" y="${mainY.toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${textColor}" font-family="${MONO_FONT}">${escapeXml(actor.label)}</text>` +
            (actor.sublabel
                ? `<text x="${cx.toFixed(1)}" y="${(actorY + 37).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="500" fill="${subColor}" font-family="${MONO_FONT}">${escapeXml(actor.sublabel)}</text>`
                : '') +
            `</g>`
        );
    };

    svgParts.push(drawActor(leftActor, leftCx, leftW));
    svgParts.push(drawActor(rightActor, rightCx, rightW));

    // Steps
    steps.forEach((step, idx) => {
        const y = firstStepY + idx * stepGap;
        const midX = (leftCx + rightCx) / 2;

        if (step.kind === 'banner') {
            const bw = Math.min(rightCx - leftCx + 40, Math.max(220, estimateTextWidth(step.label, 7.8) + 44));
            const bh = 28;
            const bx = midX - bw / 2;
            const by = y - bh / 2;
            const { textColor } = getPalette(step.status, uid);
            svgParts.push(
                `<g>` +
                renderIsoBox(bx, by, bw, bh, step.status, uid) +
                `<text x="${midX.toFixed(1)}" y="${(by + bh / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${textColor}" font-family="${MONO_FONT}">${escapeXml(step.label)}</text>` +
                `</g>`
            );
            return;
        }

        const lineStroke =
            step.status === 'accent'
                ? '#F16C38'
                : step.status === 'hit'
                ? '#1F6F3D'
                : step.status === 'muted'
                ? '#7A7267'
                : '#191715';
        const dash = step.kind === 'both' || step.status === 'muted' ? 'stroke-dasharray="5 3"' : '';
        const xStart = leftCx + 4;
        const xEnd = rightCx - 4;

        let arrows = '';
        if (step.kind === 'right') {
            arrows =
                `<line x1="${xStart.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(xEnd - 6).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${lineStroke}" stroke-width="1.75" ${dash} />` +
                renderArrowHead(xEnd, y, 'right', lineStroke);
        } else if (step.kind === 'left') {
            arrows =
                `<line x1="${(xStart + 6).toFixed(1)}" y1="${y.toFixed(1)}" x2="${xEnd.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${lineStroke}" stroke-width="1.75" ${dash} />` +
                renderArrowHead(xStart, y, 'left', lineStroke);
        } else {
            arrows =
                `<line x1="${(xStart + 6).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(xEnd - 6).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${lineStroke}" stroke-width="1.75" ${dash} />` +
                renderArrowHead(xStart, y, 'left', lineStroke) +
                renderArrowHead(xEnd, y, 'right', lineStroke);
        }

        const pillW = Math.max(76, estimateTextWidth(step.label, 7.1) + 22);
        const pillBg =
            step.status === 'hit'
                ? '#DCF7C8'
                : step.status === 'accent'
                ? '#FDE4D8'
                : '#FFFDF8';
        const pillBorder =
            step.status === 'hit'
                ? '#2D8A4E'
                : step.status === 'accent'
                ? '#F16C38'
                : '#D4CBC0';

        svgParts.push(
            `<g>` +
            arrows +
            `<g transform="translate(${midX.toFixed(1)}, ${(y - 16).toFixed(1)})">` +
            `<rect x="${(-pillW / 2).toFixed(1)}" y="-10" width="${pillW}" height="20" rx="5" fill="${pillBg}" stroke="${pillBorder}" stroke-width="1.1" />` +
            `<text x="0" y="3.5" text-anchor="middle" font-size="11" font-weight="600" fill="#191715" font-family="${MONO_FONT}">${escapeXml(step.label)}</text>` +
            `</g>` +
            `</g>`
        );
    });

    return wrapDiagramSvg(uid, totalWidth, totalHeight, title || 'Sequence diagram', svgParts);
}

// ============================================================================
// 2. Vertical Flow / Pipeline Diagram (` ```flow `)
// ============================================================================

interface FlowStep {
    label: string;
    note?: string;
    status: DiagramStatus;
}

export function renderFlowSvg(source: string): string {
    const rawLines = source
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (rawLines.length === 0) return '';

    let title: string | undefined;
    let loopStartIdx = -1;
    let loopEndIdx = -1;
    let loopLabel: string | undefined;
    const steps: FlowStep[] = [];

    for (const line of rawLines) {
        const titleMatch = line.match(/^title:\s*(.+)$/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }
        if (/^@loop-start$/i.test(line)) {
            loopStartIdx = steps.length;
            continue;
        }
        const loopEndMatch = line.match(/^@loop-end(?::\s*(.+))?$/i);
        if (loopEndMatch) {
            loopEndIdx = steps.length - 1;
            if (loopEndMatch[1]) loopLabel = loopEndMatch[1].trim();
            continue;
        }

        const { text, status } = extractStatus(line);
        const colonIdx = text.indexOf(' : ');
        if (colonIdx !== -1) {
            steps.push({
                label: text.slice(0, colonIdx).trim(),
                note: text.slice(colonIdx + 3).trim(),
                status,
            });
        } else {
            steps.push({ label: text, status });
        }
    }

    if (steps.length === 0) return '';

    const uid = hashString('flow:' + source);
    const hasLoop = loopStartIdx >= 0 && loopEndIdx >= loopStartIdx;
    const hasNotes = steps.some((s) => Boolean(s.note));

    const boxW = Math.max(
        210,
        ...steps.map((s) => estimateTextWidth(s.label, 8.2) + 32)
    );
    const boxH = 34;
    const stepGap = 28;
    const noteGap = 32;
    const maxNoteW = hasNotes
        ? Math.max(...steps.map((s) => (s.note ? estimateTextWidth(s.note, 6.9) + 22 : 0)))
        : 0;

    const leftMargin = hasLoop ? 64 : 36;
    const rightMargin = 36;
    const padY = 28;
    const titleOffset = title ? 32 : 0;

    const contentWidth = boxW + ISO_DX + (hasNotes ? noteGap + maxNoteW : 0);
    const totalWidth = Math.max(460, Math.round(leftMargin + contentWidth + rightMargin));

    // If no loop and no notes, center the box column nicely
    const boxX =
        !hasLoop && !hasNotes
            ? Math.round((totalWidth - (boxW + ISO_DX)) / 2)
            : leftMargin;
    const boxCx = boxX + boxW / 2;

    const firstY = padY + titleOffset + ISO_DY;
    const lastY = firstY + (steps.length - 1) * (boxH + stepGap);
    const bottomExtra = hasLoop ? 44 : 14;
    const totalHeight = Math.round(lastY + boxH + bottomExtra + padY);

    const svgParts: string[] = [];

    if (title) {
        svgParts.push(renderTitlePill(title, totalWidth / 2, padY + 6));
    }

    // Loopback arrow on the left
    if (hasLoop) {
        const startY = firstY + loopStartIdx * (boxH + stepGap) + boxH / 2;
        const endBottomY = firstY + loopEndIdx * (boxH + stepGap) + boxH;
        const turnY = endBottomY + 24;
        const railX = boxX - 30;

        svgParts.push(
            `<path d="M ${boxCx.toFixed(1)} ${endBottomY.toFixed(1)} L ${boxCx.toFixed(1)} ${turnY.toFixed(1)} L ${railX.toFixed(1)} ${turnY.toFixed(1)} L ${railX.toFixed(1)} ${startY.toFixed(1)} L ${(boxX - 6).toFixed(1)} ${startY.toFixed(1)}" fill="none" stroke="#F16C38" stroke-width="1.75" stroke-linejoin="round" />` +
            renderArrowHead(boxX - 1, startY, 'right', '#F16C38')
        );

        if (loopLabel) {
            const pillW = Math.max(88, estimateTextWidth(loopLabel, 6.8) + 20);
            const pillX = (railX + boxCx) / 2;
            svgParts.push(
                `<g transform="translate(${pillX.toFixed(1)}, ${turnY.toFixed(1)})">` +
                `<rect x="${(-pillW / 2).toFixed(1)}" y="-10" width="${pillW}" height="20" rx="10" fill="#FDE4D8" stroke="#F16C38" stroke-width="1.1" />` +
                `<text x="0" y="3.5" text-anchor="middle" font-size="10.5" font-weight="700" fill="#B53E14" font-family="${MONO_FONT}">${escapeXml(loopLabel)}</text>` +
                `</g>`
            );
        }
    }

    // Connectors between steps
    for (let i = 0; i < steps.length - 1; i++) {
        const y1 = firstY + i * (boxH + stepGap) + boxH;
        const y2 = firstY + (i + 1) * (boxH + stepGap) - ISO_DY;
        svgParts.push(
            `<line x1="${boxCx.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${boxCx.toFixed(1)}" y2="${(y2 - 5).toFixed(1)}" stroke="#191715" stroke-width="1.6" />` +
            renderArrowHead(boxCx, y2, 'down', '#191715')
        );
    }

    // Step boxes + optional right-side notes
    steps.forEach((step, i) => {
        const y = firstY + i * (boxH + stepGap);
        const { textColor } = getPalette(step.status, uid);
        let noteSvg = '';

        if (step.note) {
            const noteX = boxX + boxW + ISO_DX + noteGap;
            const noteW = Math.max(64, estimateTextWidth(step.note, 6.9) + 22);
            const cy = y + boxH / 2;
            noteSvg =
                `<line x1="${(boxX + boxW + ISO_DX + 2).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(noteX - 2).toFixed(1)}" y2="${cy.toFixed(1)}" stroke="#9E958A" stroke-width="1.25" stroke-dasharray="4 3" />` +
                `<rect x="${noteX.toFixed(1)}" y="${(cy - 12).toFixed(1)}" width="${noteW}" height="24" rx="6" fill="#FFFDF8" stroke="#D4CBC0" stroke-width="1.1" />` +
                `<text x="${(noteX + 11).toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="start" font-size="11" font-weight="500" fill="#5C554C" font-family="${MONO_FONT}">${escapeXml(step.note)}</text>`;
        }

        svgParts.push(
            `<g>` +
            renderIsoBox(boxX, y, boxW, boxH, step.status, uid) +
            `<text x="${boxCx.toFixed(1)}" y="${(y + boxH / 2 + 4.5).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${textColor}" font-family="${MONO_FONT}">${escapeXml(step.label)}</text>` +
            noteSvg +
            `</g>`
        );
    });

    return wrapDiagramSvg(uid, totalWidth, totalHeight, title || 'Flow diagram', svgParts);
}

// ============================================================================
// 3. Stacked Message / Packet Anatomy Diagram (` ```stack `)
// ============================================================================

interface StackLayer {
    name: string;
    detail: string;
    status: DiagramStatus;
}

export function renderStackSvg(source: string): string {
    const rawLines = source
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (rawLines.length === 0) return '';

    let title: string | undefined;
    const layers: StackLayer[] = [];

    for (const line of rawLines) {
        const titleMatch = line.match(/^title:\s*(.+)$/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }
        const { text, status } = extractStatus(line);
        const pipeIdx = text.indexOf(' | ');
        if (pipeIdx !== -1) {
            layers.push({
                name: text.slice(0, pipeIdx).trim(),
                detail: text.slice(pipeIdx + 3).trim(),
                status,
            });
        } else {
            layers.push({ name: text, detail: '', status });
        }
    }

    if (layers.length === 0) return '';

    const uid = hashString('stack:' + source);
    const leftColW = Math.max(
        124,
        ...layers.map((l) => estimateTextWidth(l.name, 7.8) + 28)
    );
    const rightColW = Math.max(
        260,
        ...layers.map((l) => estimateTextWidth(l.detail, 7.4) + 32)
    );

    const slabW = leftColW + rightColW;
    const slabH = 38;
    const slabGap = 14;
    const padX = 36;
    const padY = 28;
    const titleOffset = title ? 32 : 0;

    const totalWidth = Math.max(520, Math.round(slabW + ISO_DX + padX * 2));
    const slabX = Math.round((totalWidth - (slabW + ISO_DX)) / 2);
    const firstY = padY + titleOffset + ISO_DY;
    const totalHeight = Math.round(
        firstY + layers.length * slabH + (layers.length - 1) * slabGap + padY
    );

    const svgParts: string[] = [];

    if (title) {
        svgParts.push(renderTitlePill(title, totalWidth / 2, padY + 6));
    }

    layers.forEach((layer, i) => {
        const y = firstY + i * (slabH + slabGap);
        const { textColor } = getPalette(layer.status, uid);
        const dividerColor =
            layer.status === 'accent'
                ? 'rgba(255, 253, 248, 0.45)'
                : layer.status === 'hit'
                ? '#86C96E'
                : '#D4CBC0';
        const detailColor =
            layer.status === 'accent'
                ? '#FFFDF8'
                : layer.status === 'muted'
                ? '#5C554C'
                : '#3D3832';

        svgParts.push(
            `<g>` +
            renderIsoBox(slabX, y, slabW, slabH, layer.status, uid) +
            `<line x1="${(slabX + leftColW).toFixed(1)}" y1="${(y + 6).toFixed(1)}" x2="${(slabX + leftColW).toFixed(1)}" y2="${(y + slabH - 6).toFixed(1)}" stroke="${dividerColor}" stroke-width="1.25" />` +
            `<text x="${(slabX + 14).toFixed(1)}" y="${(y + slabH / 2 + 4.5).toFixed(1)}" text-anchor="start" font-size="12" font-weight="700" fill="${textColor}" font-family="${MONO_FONT}">${escapeXml(layer.name)}</text>` +
            `<text x="${(slabX + leftColW + 14).toFixed(1)}" y="${(y + slabH / 2 + 4.5).toFixed(1)}" text-anchor="start" font-size="11.5" font-weight="500" fill="${detailColor}" font-family="${MONO_FONT}">${escapeXml(layer.detail)}</text>` +
            `</g>`
        );
    });

    return wrapDiagramSvg(uid, totalWidth, totalHeight, title || 'Protocol frame diagram', svgParts);
}

// ============================================================================
// 4. Vertical File & Folder Tree Diagram (` ```filetree `)
// ============================================================================

interface FileTreeEntry {
    name: string;
    isFolder: boolean;
    depth: number;
    note?: string;
    status: DiagramStatus;
}

function renderFolderIcon(x: number, y: number, fill: string, stroke: string): string {
    return (
        `<path d="M ${(x + 1).toFixed(1)} ${(y + 3).toFixed(1)} ` +
        `L ${(x + 6.5).toFixed(1)} ${(y + 3).toFixed(1)} ` +
        `L ${(x + 8.5).toFixed(1)} ${(y + 5.2).toFixed(1)} ` +
        `L ${(x + 16).toFixed(1)} ${(y + 5.2).toFixed(1)} ` +
        `Q ${(x + 17).toFixed(1)} ${(y + 5.2).toFixed(1)} ${(x + 17).toFixed(1)} ${(y + 6.2).toFixed(1)} ` +
        `L ${(x + 17).toFixed(1)} ${(y + 14.5).toFixed(1)} ` +
        `Q ${(x + 17).toFixed(1)} ${(y + 15.5).toFixed(1)} ${(x + 16).toFixed(1)} ${(y + 15.5).toFixed(1)} ` +
        `L ${(x + 2).toFixed(1)} ${(y + 15.5).toFixed(1)} ` +
        `Q ${(x + 1).toFixed(1)} ${(y + 15.5).toFixed(1)} ${(x + 1).toFixed(1)} ${(y + 14.5).toFixed(1)} Z" ` +
        `fill="${fill}" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round" />`
    );
}

function renderFileIcon(x: number, y: number, fill: string, stroke: string): string {
    return (
        `<path d="M ${(x + 3).toFixed(1)} ${(y + 2).toFixed(1)} ` +
        `L ${(x + 11).toFixed(1)} ${(y + 2).toFixed(1)} ` +
        `L ${(x + 15).toFixed(1)} ${(y + 6).toFixed(1)} ` +
        `L ${(x + 15).toFixed(1)} ${(y + 16).toFixed(1)} ` +
        `L ${(x + 3).toFixed(1)} ${(y + 16).toFixed(1)} Z" ` +
        `fill="${fill}" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round" />` +
        `<path d="M ${(x + 11).toFixed(1)} ${(y + 2).toFixed(1)} L ${(x + 11).toFixed(1)} ${(y + 6).toFixed(1)} L ${(x + 15).toFixed(1)} ${(y + 6).toFixed(1)}" ` +
        `fill="none" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round" />`
    );
}

export function renderFileTreeSvg(source: string): string {
    const rawLines = source
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));

    if (rawLines.length === 0) return '';

    let title: string | undefined;
    const entries: FileTreeEntry[] = [];
    const indentLevels: number[] = [];

    for (const raw of rawLines) {
        const trimmed = raw.trim();
        const titleMatch = trimmed.match(/^title:\s*(.+)$/i);
        if (titleMatch && entries.length === 0) {
            title = titleMatch[1].trim();
            continue;
        }

        const expanded = raw.replace(/^\t+/, (t) => '  '.repeat(t.length));
        const indent = expanded.length - expanded.trimStart().length;

        while (indentLevels.length > 0 && indentLevels[indentLevels.length - 1] >= indent) {
            indentLevels.pop();
        }
        const depth = indentLevels.length;
        indentLevels.push(indent);

        const { text, status } = extractStatus(trimmed);
        let name = text;
        let note: string | undefined;
        const colonIdx = text.indexOf(' : ');
        if (colonIdx !== -1) {
            name = text.slice(0, colonIdx).trim();
            note = text.slice(colonIdx + 3).trim();
        }

        const isFolder = name.endsWith('/');
        entries.push({
            name,
            isFolder,
            depth,
            note,
            status,
        });
    }

    if (entries.length === 0) return '';

    const uid = hashString('filetree:' + source);
    const rowH = 32;
    const indentStep = 26;
    const headerH = 34;
    const cardPadX = 20;
    const cardPadY = 14;
    const outerPadX = 36;
    const outerPadY = 26;

    const maxRowWidth = Math.max(
        260,
        ...entries.map((e) => {
            const labelW = estimateTextWidth(e.name, 8.2);
            const noteW = e.note ? estimateTextWidth(e.note, 6.8) + 28 : 0;
            return e.depth * indentStep + 28 + labelW + noteW + 20;
        })
    );

    const cardW = Math.max(360, Math.round(maxRowWidth + cardPadX * 2));
    const cardH = Math.round(headerH + cardPadY * 2 + entries.length * rowH);
    const totalWidth = Math.max(460, cardW + outerPadX * 2);
    const totalHeight = cardH + outerPadY * 2 + 4;
    const cardX = Math.round((totalWidth - cardW) / 2);
    const cardY = outerPadY;

    // Precompute whether each entry has a following sibling at the same depth
    // (before depth drops below e.depth) so vertical connector rails stop cleanly.
    const hasNextSibling: boolean[] = entries.map((entry, idx) => {
        for (let j = idx + 1; j < entries.length; j++) {
            if (entries[j].depth < entry.depth) return false;
            if (entries[j].depth === entry.depth) return true;
        }
        return false;
    });

    const svgParts: string[] = [];

    // Explorer card with crisp ink shadow
    svgParts.push(
        `<rect x="${(cardX + 3).toFixed(1)}" y="${(cardY + 3).toFixed(1)}" width="${cardW}" height="${cardH}" rx="10" fill="#191715" />` +
        `<rect x="${cardX.toFixed(1)}" y="${cardY.toFixed(1)}" width="${cardW}" height="${cardH}" rx="10" fill="#FFFDF8" stroke="#191715" stroke-width="1.5" />` +
        `<path d="M ${cardX} ${cardY + headerH} L ${cardX + cardW} ${cardY + headerH}" stroke="#191715" stroke-width="1.25" />` +
        `<rect x="${(cardX + 1).toFixed(1)}" y="${(cardY + 1).toFixed(1)}" width="${cardW - 2}" height="${headerH - 2}" rx="9" fill="#F3EDE2" />` +
        `<rect x="${(cardX + 1).toFixed(1)}" y="${(cardY + headerH - 9).toFixed(1)}" width="${cardW - 2}" height="8" fill="#F3EDE2" />` +
        `<line x1="${cardX}" y1="${cardY + headerH}" x2="${cardX + cardW}" y2="${cardY + headerH}" stroke="#191715" stroke-width="1.25" />` +
        `<circle cx="${cardX + 18}" cy="${cardY + headerH / 2}" r="4.2" fill="#F16C38" stroke="#191715" stroke-width="1.1" />` +
        `<circle cx="${cardX + 33}" cy="${cardY + headerH / 2}" r="4.2" fill="#F7C948" stroke="#191715" stroke-width="1.1" />` +
        `<circle cx="${cardX + 48}" cy="${cardY + headerH / 2}" r="4.2" fill="#C7F2A7" stroke="#191715" stroke-width="1.1" />` +
        `<text x="${cardX + 64}" y="${cardY + headerH / 2 + 4}" text-anchor="start" font-size="11.5" font-weight="700" fill="#5C554C" font-family="${MONO_FONT}">${escapeXml(title || 'Project Structure')}</text>`
    );

    const listStartY = cardY + headerH + cardPadY;
    const baseX = cardX + cardPadX;

    // Active vertical continuation flags per ancestor depth
    const activeRails: boolean[] = [];

    entries.forEach((entry, idx) => {
        const rowY = listStartY + idx * rowH;
        const rowCy = rowY + rowH / 2;

        // Subtle row highlight for !hit or !accent entries
        if (entry.status === 'hit' || entry.status === 'accent') {
            const hlFill = entry.status === 'hit' ? '#EDFBE3' : '#FEF0E8';
            const hlStroke = entry.status === 'hit' ? '#A4DE86' : '#F6B196';
            svgParts.push(
                `<rect x="${(cardX + 10).toFixed(1)}" y="${(rowY + 2).toFixed(1)}" width="${cardW - 20}" height="${rowH - 4}" rx="6" fill="${hlFill}" stroke="${hlStroke}" stroke-width="1" />`
            );
        }

        // Draw ancestor vertical guide rails
        for (let d = 1; d < entry.depth; d++) {
            if (activeRails[d]) {
                const railX = baseX + (d - 1) * indentStep + 9;
                svgParts.push(
                    `<line x1="${railX.toFixed(1)}" y1="${rowY.toFixed(1)}" x2="${railX.toFixed(1)}" y2="${(rowY + rowH).toFixed(1)}" stroke="#C8BEB0" stroke-width="1.35" />`
                );
            }
        }

        // Draw branch connector (├── or └──) for nested items
        if (entry.depth > 0) {
            const railX = baseX + (entry.depth - 1) * indentStep + 9;
            const elbowEndX = baseX + entry.depth * indentStep - 3;
            const vertEndY = hasNextSibling[idx] ? rowY + rowH : rowCy;
            svgParts.push(
                `<line x1="${railX.toFixed(1)}" y1="${rowY.toFixed(1)}" x2="${railX.toFixed(1)}" y2="${vertEndY.toFixed(1)}" stroke="#C8BEB0" stroke-width="1.35" />` +
                `<line x1="${railX.toFixed(1)}" y1="${rowCy.toFixed(1)}" x2="${elbowEndX.toFixed(1)}" y2="${rowCy.toFixed(1)}" stroke="#C8BEB0" stroke-width="1.35" />`
            );
        }

        activeRails[entry.depth] = hasNextSibling[idx];

        const itemX = baseX + entry.depth * indentStep;
        const iconY = rowCy - 9;

        if (entry.isFolder) {
            const folderFill =
                entry.status === 'accent'
                    ? '#F16C38'
                    : entry.status === 'hit'
                    ? '#C7F2A7'
                    : '#FDF2C6';
            svgParts.push(renderFolderIcon(itemX, iconY, folderFill, '#191715'));
        } else {
            const fileFill =
                entry.status === 'hit'
                    ? '#DCF7C8'
                    : entry.status === 'accent'
                    ? '#FDE4D8'
                    : '#FFFDF8';
            svgParts.push(renderFileIcon(itemX, iconY, fileFill, '#191715'));
        }

        const labelColor =
            entry.status === 'muted'
                ? '#6E665C'
                : entry.status === 'hit'
                ? '#154D2B'
                : '#191715';

        svgParts.push(
            `<text x="${(itemX + 24).toFixed(1)}" y="${(rowCy + 4.5).toFixed(1)}" text-anchor="start" font-size="12.5" font-weight="${entry.isFolder ? '700' : '500'}" fill="${labelColor}" font-family="${MONO_FONT}">${escapeXml(entry.name)}</text>`
        );

        if (entry.note) {
            const pillW = Math.max(40, Math.round(estimateTextWidth(entry.note, 6.6) + 14));
            const pillX = cardX + cardW - 18 - pillW;
            const pillBg =
                entry.status === 'hit'
                    ? '#C7F2A7'
                    : entry.status === 'accent'
                    ? '#F16C38'
                    : '#F3EDE2';
            const pillText =
                entry.status === 'accent'
                    ? '#FFFDF8'
                    : entry.status === 'hit'
                    ? '#154D2B'
                    : '#5C554C';
            const pillBorder =
                entry.status === 'hit'
                    ? '#2D8A4E'
                    : entry.status === 'accent'
                    ? '#191715'
                    : '#D4CBC0';

            svgParts.push(
                `<rect x="${pillX.toFixed(1)}" y="${(rowCy - 9).toFixed(1)}" width="${pillW}" height="18" rx="9" fill="${pillBg}" stroke="${pillBorder}" stroke-width="1" />` +
                `<text x="${(pillX + pillW / 2).toFixed(1)}" y="${(rowCy + 3.5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="${pillText}" font-family="${MONO_FONT}">${escapeXml(entry.note)}</text>`
            );
        }
    });

    return wrapDiagramSvg(uid, totalWidth, totalHeight, title || 'File tree diagram', svgParts);
}

// ============================================================================
// Markdown Transform Entry Point
// ============================================================================

export function transformFlowDiagrams(markdown: string): string {
    return markdown
        .replace(/```sequence\r?\n([\s\S]*?)```/g, (_match, body: string) => {
            const svg = renderSequenceSvg(body);
            return svg || _match;
        })
        .replace(/```flow\r?\n([\s\S]*?)```/g, (_match, body: string) => {
            const svg = renderFlowSvg(body);
            return svg || _match;
        })
        .replace(/```stack\r?\n([\s\S]*?)```/g, (_match, body: string) => {
            const svg = renderStackSvg(body);
            return svg || _match;
        })
        .replace(/```filetree\r?\n([\s\S]*?)```/g, (_match, body: string) => {
            const svg = renderFileTreeSvg(body);
            return svg || _match;
        });
}
