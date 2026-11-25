export type TreeNodeStatus = 'default' | 'hit' | 'pruned' | 'muted' | 'accent' | 'ghost';

interface TreeNode {
    label: string;
    edgeLabel?: string;
    note?: string;
    status: TreeNodeStatus;
    children: TreeNode[];
    // Computed layout properties
    depth: number;
    boxWidth: number;
    subtreeWidth: number;
    x: number;
    y: number;
}

interface ParsedTreeSection {
    title?: string;
    root: TreeNode;
    maxDepth: number;
    hasBottomNote: boolean;
}

const NODE_HEIGHT = 30;
const ISO_DX = 13;
const ISO_DY = 8;
const LEVEL_GAP = 88;
const SIBLING_GAP = 22;
const PADDING_X = 36;
const PADDING_Y = 34;

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

function parseLine(raw: string): {
    indent: number;
    label: string;
    edgeLabel?: string;
    note?: string;
    status: TreeNodeStatus;
} {
    const trimmedStart = raw.replace(/^\t+/, (tabs) => '  '.repeat(tabs.length));
    const indent = trimmedStart.length - trimmedStart.trimStart().length;
    let rest = trimmedStart.trim();

    let status: TreeNodeStatus = 'default';
    const statusMatch = rest.match(/\s+!(hit|pruned|muted|accent|ghost)\s*$/);
    if (statusMatch) {
        status = statusMatch[1] as TreeNodeStatus;
        rest = rest.slice(0, statusMatch.index).trim();
    }

    let edgeLabel: string | undefined;
    const pipeIdx = rest.indexOf(' | ');
    if (pipeIdx !== -1) {
        edgeLabel = rest.slice(pipeIdx + 3).trim();
        rest = rest.slice(0, pipeIdx).trim();
    }

    let note: string | undefined;
    const colonIdx = rest.indexOf(' : ');
    if (colonIdx !== -1) {
        note = rest.slice(colonIdx + 3).trim();
        rest = rest.slice(0, colonIdx).trim();
    }

    return {
        indent,
        label: rest,
        edgeLabel,
        note,
        status,
    };
}

function parseTree(source: string): { title?: string; root: TreeNode } | null {
    const rawLines = source
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0 && !line.trim().startsWith('#'));

    if (rawLines.length === 0) return null;

    let title: string | undefined;
    const lines: string[] = [];
    for (const line of rawLines) {
        const titleMatch = line.trim().match(/^title:\s*(.+)$/i);
        if (titleMatch && lines.length === 0) {
            title = titleMatch[1].trim();
        } else {
            lines.push(line);
        }
    }

    if (lines.length === 0) return null;

    const stack: Array<{ indent: number; node: TreeNode }> = [];
    let root: TreeNode | null = null;

    for (const line of lines) {
        const parsed = parseLine(line);
        const charWidth = parsed.status === 'muted' ? 7 : 8.4;
        const boxWidth =
            parsed.status === 'ghost'
                ? 36
                : Math.max(46, Math.round(parsed.label.length * charWidth + 22));

        const node: TreeNode = {
            label: parsed.label,
            edgeLabel: parsed.edgeLabel,
            note: parsed.note,
            status: parsed.status,
            children: [],
            depth: 0,
            boxWidth,
            subtreeWidth: boxWidth,
            x: 0,
            y: 0,
        };

        while (stack.length > 0 && stack[stack.length - 1].indent >= parsed.indent) {
            stack.pop();
        }

        if (stack.length === 0) {
            root = node;
        } else {
            const parent = stack[stack.length - 1].node;
            node.depth = parent.depth + 1;
            parent.children.push(node);
        }

        stack.push({ indent: parsed.indent, node });
    }

    return root ? { title, root } : null;
}

function computeSubtreeWidths(node: TreeNode): number {
    const noteWidth = node.note ? Math.round(node.note.length * 6.8 + 14) : 0;
    const ownWidth = Math.max(node.boxWidth + ISO_DX, noteWidth);

    if (node.children.length === 0) {
        node.subtreeWidth = ownWidth;
        return ownWidth;
    }

    let childrenTotal = 0;
    for (let i = 0; i < node.children.length; i++) {
        childrenTotal += computeSubtreeWidths(node.children[i]);
        if (i > 0) childrenTotal += SIBLING_GAP;
    }

    node.subtreeWidth = Math.max(ownWidth, childrenTotal);
    return node.subtreeWidth;
}

function assignCoordinates(node: TreeNode, leftX: number, topY: number): void {
    node.y = topY;

    if (node.children.length === 0) {
        node.x = leftX + node.subtreeWidth / 2;
        return;
    }

    let childrenTotal = 0;
    for (let i = 0; i < node.children.length; i++) {
        childrenTotal += node.children[i].subtreeWidth;
        if (i > 0) childrenTotal += SIBLING_GAP;
    }

    let cursorX = leftX + (node.subtreeWidth - childrenTotal) / 2;
    for (const child of node.children) {
        assignCoordinates(child, cursorX, topY + LEVEL_GAP);
        cursorX += child.subtreeWidth + SIBLING_GAP;
    }

    const firstChild = node.children[0];
    const lastChild = node.children[node.children.length - 1];
    node.x = (firstChild.x + lastChild.x) / 2;
}

function collectNodes(node: TreeNode, list: TreeNode[] = []): TreeNode[] {
    list.push(node);
    for (const child of node.children) {
        collectNodes(child, list);
    }
    return list;
}

export function renderIsometricTreeSvg(source: string): string {
    const rawSections = source
        .split(/^\s*---\s*$/m)
        .map((s) => s.trim())
        .filter(Boolean);

    const sections: ParsedTreeSection[] = [];
    for (const raw of rawSections) {
        const parsed = parseTree(raw);
        if (!parsed) continue;
        computeSubtreeWidths(parsed.root);
        const nodes = collectNodes(parsed.root);
        let maxDepth = 0;
        let hasBottomNote = false;
        for (const n of nodes) {
            if (n.status !== 'ghost' && n.depth > maxDepth) maxDepth = n.depth;
        }
        for (const n of nodes) {
            if (n.status !== 'ghost' && n.depth === maxDepth && n.note) hasBottomNote = true;
        }
        sections.push({
            title: parsed.title,
            root: parsed.root,
            maxDepth,
            hasBottomNote,
        });
    }

    if (sections.length === 0) return '';

    const SECTION_GAP = 64;
    const hasAnyTitle = sections.some((s) => !!s.title);
    const titleOffsetY = hasAnyTitle ? 28 : 0;

    let totalContentWidth = 0;
    let globalMaxDepth = 0;
    let globalHasBottomNote = false;

    for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        totalContentWidth += sec.root.subtreeWidth;
        if (i > 0) totalContentWidth += SECTION_GAP;
        if (sec.maxDepth > globalMaxDepth) globalMaxDepth = sec.maxDepth;
        if (sec.maxDepth === globalMaxDepth && sec.hasBottomNote) globalHasBottomNote = true;
    }

    const totalWidth = Math.max(420, Math.round(totalContentWidth + PADDING_X * 2));
    const totalHeight = Math.round(
        PADDING_Y * 2 + titleOffsetY + ISO_DY + globalMaxDepth * LEVEL_GAP + NODE_HEIGHT + (globalHasBottomNote ? 26 : 10)
    );

    const startX = (totalWidth - totalContentWidth) / 2;
    let cursorX = startX;

    const uid = hashString(source);
    const gridId = `iso-grid-${uid}`;
    const hatchOrangeId = `iso-hatch-orange-${uid}`;
    const hatchGreenId = `iso-hatch-green-${uid}`;
    const hatchMutedId = `iso-hatch-muted-${uid}`;

    const titlesSvg: string[] = [];
    const edgesSvg: string[] = [];
    const nodesSvg: string[] = [];

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];
        assignCoordinates(sec.root, cursorX, PADDING_Y + titleOffsetY + ISO_DY);

        if (sec.title) {
            const tx = cursorX + sec.root.subtreeWidth / 2;
            const ty = PADDING_Y + 6;
            const pillW = Math.max(54, Math.round(sec.title.length * 7.4 + 20));
            titlesSvg.push(
                `<g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)})">` +
                `<rect x="${(-pillW / 2).toFixed(1)}" y="-11" width="${pillW}" height="22" rx="6" fill="#FFFDF8" stroke="#191715" stroke-width="1.25" />` +
                `<text x="0" y="4" text-anchor="middle" font-size="11.5" font-weight="700" fill="#191715" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(sec.title)}</text>` +
                `</g>`
            );
        }

        if (sIdx > 0) {
            const dividerX = cursorX - SECTION_GAP / 2;
            edgesSvg.push(
                `<line x1="${dividerX.toFixed(1)}" y1="${PADDING_Y}" x2="${dividerX.toFixed(1)}" y2="${totalHeight - PADDING_Y}" stroke="#D4CBC0" stroke-width="1.25" stroke-dasharray="5 4" />`
            );
        }

        const nodes = collectNodes(sec.root);
        for (const parent of nodes) {
            if (parent.status === 'ghost') continue;
            for (const child of parent.children) {
                if (child.status === 'ghost') continue;
                const x1 = parent.x;
                const y1 = parent.y + NODE_HEIGHT;
                const x2 = child.x;
                const y2 = child.y - ISO_DY;

                const isDashed = child.status === 'muted' || child.status === 'pruned';
                const strokeColor = child.status === 'muted' ? '#9e958a' : '#191715';

                edgesSvg.push(
                    `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="1.5" ${isDashed ? 'stroke-dasharray="4 3"' : ''} stroke-linecap="round" />`
                );

                if (child.edgeLabel) {
                    const mx = (x1 + x2) / 2;
                    const my = (y1 + y2) / 2;
                    const pillW = Math.max(36, Math.round(child.edgeLabel.length * 6.4 + 12));
                    edgesSvg.push(
                        `<g transform="translate(${mx.toFixed(1)}, ${my.toFixed(1)})">` +
                        `<rect x="${(-pillW / 2).toFixed(1)}" y="-9" width="${pillW}" height="18" rx="4" fill="#FAF6EE" stroke="#D4CBC0" stroke-width="1" />` +
                        `<text x="0" y="3.5" text-anchor="middle" font-size="10.5" font-weight="500" fill="#5C554C" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(child.edgeLabel)}</text>` +
                        `</g>`
                    );
                }
            }
        }

        for (const node of nodes) {
            if (node.status === 'ghost') continue;
            const w = node.boxWidth;
            const h = NODE_HEIGHT;
            const x = node.x - w / 2;
            const y = node.y;

            if (node.status === 'muted') {
                nodesSvg.push(
                    `<g>` +
                    `<rect x="${x.toFixed(1)}" y="${(y + 2).toFixed(1)}" width="${w}" height="${h - 4}" rx="6" fill="#F3EDE2" stroke="#9E958A" stroke-width="1.25" stroke-dasharray="4 3" />` +
                    `<text x="${node.x.toFixed(1)}" y="${(y + h / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#6E665C" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(node.label)}</text>` +
                    (node.note
                        ? `<text x="${node.x.toFixed(1)}" y="${(y + h + 15).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="500" fill="#6E665C" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(node.note)}</text>`
                        : '') +
                    `</g>`
                );
                continue;
            }

            const topFill =
                node.status === 'hit'
                    ? '#DCF7C8'
                    : node.status === 'pruned'
                    ? '#EFE9DF'
                    : node.status === 'accent'
                    ? '#FDE4D8'
                    : '#FFFDF8';

            const frontFill =
                node.status === 'hit'
                    ? '#C7F2A7'
                    : node.status === 'pruned'
                    ? '#E7E0D4'
                    : node.status === 'accent'
                    ? '#F16C38'
                    : '#FFFDF8';

            const rightFill =
                node.status === 'hit'
                    ? `url(#${hatchGreenId})`
                    : node.status === 'pruned'
                    ? `url(#${hatchMutedId})`
                    : `url(#${hatchOrangeId})`;

            const textColor =
                node.status === 'accent'
                    ? '#FFFDF8'
                    : node.status === 'pruned'
                    ? '#5C554C'
                    : '#191715';

            const strokeColor = node.status === 'pruned' ? '#7A7267' : '#191715';

            const topPoints = `${x.toFixed(1)},${y.toFixed(1)} ${(x + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w).toFixed(1)},${y.toFixed(1)}`;
            const rightPoints = `${(x + w).toFixed(1)},${y.toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y - ISO_DY).toFixed(1)} ${(x + w + ISO_DX).toFixed(1)},${(y + h - ISO_DY).toFixed(1)} ${(x + w).toFixed(1)},${(y + h).toFixed(1)}`;

            let noteSvg = '';
            if (node.note) {
                const noteColor =
                    node.status === 'hit'
                        ? '#1F6F3D'
                        : node.status === 'pruned'
                        ? '#C84B24'
                        : '#5C554C';
                const noteBg =
                    node.status === 'hit'
                        ? '#DCF7C8'
                        : node.status === 'pruned'
                        ? '#FCE8DF'
                        : '#F3EDE2';
                const noteBorder =
                    node.status === 'hit'
                        ? '#2D8A4E'
                        : node.status === 'pruned'
                        ? '#E28A6B'
                        : '#D4CBC0';
                const noteW = Math.max(42, Math.round(node.note.length * 6.5 + 14));
                noteSvg =
                    `<g transform="translate(${node.x.toFixed(1)}, ${(y + h + 15).toFixed(1)})">` +
                    `<rect x="${(-noteW / 2).toFixed(1)}" y="-9" width="${noteW}" height="18" rx="9" fill="${noteBg}" stroke="${noteBorder}" stroke-width="1" />` +
                    `<text x="0" y="3.5" text-anchor="middle" font-size="10.5" font-weight="700" fill="${noteColor}" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(node.note)}</text>` +
                    `</g>`;
            }

            nodesSvg.push(
                `<g>` +
                `<polygon points="${topPoints}" fill="${topFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />` +
                `<polygon points="${rightPoints}" fill="${rightFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />` +
                `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" fill="${frontFill}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />` +
                `<text x="${node.x.toFixed(1)}" y="${(y + h / 2 + 4.5).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${textColor}" font-family="var(--font-paper-mono), ui-monospace, SFMono-Regular, Menlo, monospace">${escapeXml(node.label)}</text>` +
                noteSvg +
                `</g>`
            );
        }

        cursorX += sec.root.subtreeWidth + SECTION_GAP;
    }

    return [
        `<figure class="iso-diagram not-prose my-6">`,
        `<div class="iso-diagram-inner">`,
        `<svg viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}" role="img" aria-label="Tree diagram" xmlns="http://www.w3.org/2000/svg">`,
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
        `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="#FAF6EE" />`,
        `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="url(#${gridId})" />`,
        `<g class="iso-titles">${titlesSvg.join('')}</g>`,
        `<g class="iso-edges">${edgesSvg.join('')}</g>`,
        `<g class="iso-nodes">${nodesSvg.join('')}</g>`,
        `</svg>`,
        `</div>`,
        `</figure>`,
    ].join('\n');
}

export function transformTreeDiagrams(markdown: string): string {
    return markdown.replace(/```tree\r?\n([\s\S]*?)```/g, (_match, body: string) => {
        const svg = renderIsometricTreeSvg(body);
        return svg || _match;
    });
}
