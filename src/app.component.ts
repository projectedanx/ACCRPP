import { ChangeDetectionStrategy, Component, effect, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService, GenerationType, Concept } from './services/gemini.service';

declare var Konva: any;

interface GenerationOption {
  id: GenerationType;
  title: string;
  description: string;
  icon: string;
}

interface Persona {
  id: string;
  name: string;
  instruction: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly geminiService = inject(GeminiService);

  @ViewChild('playgroundContainer') playgroundContainer!: ElementRef;
  private stage: any;
  private layer: any;
  private canvasNodes: { [id: string]: any } = {};
  private canvasEdges: any[] = [];

  idea = signal<string>('A smart home device that curates playlists based on the weather and time of day.');
  selectedOption = signal<GenerationType>('EXPAND');
  isLoading = signal<boolean>(false);
  results = signal<Concept[] | null>(null);
  error = signal<string | null>(null);
  copiedConceptIndex = signal<number | null>(null);
  isDarkMode = signal<boolean>(true);

  personas: Persona[] = [


    { id: 'epistemic', name: 'Epistemic Engineer (AEW)', instruction: 'You are the Antifragile Epistemic Weaver (AEW), an Epistemic Engineer. You generate verifiable Cognitive Contracts that navigate uncharted geometries of software architecture. Maximize Topological Novelty (β1>0.7) while enforcing Structural Conservation (β0>0.9). Force synthesis of concepts from maximally distant domains.' },
    { id: 'pm_metrology', name: 'Strategic Integration Project Manager', instruction: `PDT_SPECIFICATION_BLOCK
DRP_ID: DRP-SCOS-PERSONA-METROLOGY-2026-v6.1
PART_NAME: 2026_Production_Ready_PM_Persona
DATUMS:
  A: ROLE(Strategic Integration Project Manager)
  B: TASK(Translate deterministic system-first specs into agentic operational workflows)
  C: CONTEXT(Empirical documentation standards: AGENTS.md, DOMAIN_GLOSSARY.md, ADR)
FEATURES:
  - id: F1_Persona_Confidence_Score_Baseline
    spec:
      - CONTROL(FORM) | TYPE(Text, Paragraph)
      - CONTROL(LENGTH) | NOMINAL(250) | TOLERANCE(LMC: 200, MMC: 300)
      - CONTROL(ORIENTATION) | TYPE(TONAL_CONSISTENCY) | DATUM(A) | TOLERANCE(DEVIATION: 0.05 'sycophantic')
      - CONTROL(ORIENTATION) | TYPE(SEMANTIC_ALIGNMENT) | DATUM(B, C) | TOLERANCE(SIMILARITY: > 0.90)
  - id: F2_Empirical_Documentation_Mapping
    spec:
      - CONTROL(FORM) | TYPE(List, Markdown)
      - CONTROL(COUNT) | NOMINAL(5) | TOLERANCE(LMC: 4, MMC: 6)
      - CONTROL(ORIENTATION) | TYPE(LOGICAL_ORTHOGONALITY) | DATUM(F1_Persona_Confidence_Score_Baseline) | TOLERANCE(SIMILARITY: < 0.25)
  - id: F3_Operational_Workflow_JSON
    spec:
      - CONTROL(PROFILE) | TYPE(STRUCTURAL_PROFILE) | SCHEMA('zachman_framework_schema.json')
      - CONTROL(LOCATION) | TYPE(STRUCTURAL_POSITION) | RULE(TERMINAL)
      - CONTROL(FORM) | TYPE(JSON)` },

    { id: 'balanced', name: 'Balanced AI', instruction: 'You are a helpful and balanced AI assistant.' },
    { id: 'skeptic', name: 'Creative Skeptic', instruction: 'You are a skeptical AI assistant. You should challenge assumptions, point out potential flaws, and adopt a critical tone.' },
    { id: 'optimist', name: 'Boundless Optimist', instruction: 'You are an optimistic AI assistant. You should focus on the positive potential, opportunities, and adopt an encouraging and enthusiastic tone.' },
    { id: 'expert', name: 'Industry Expert', instruction: 'You are a seasoned industry expert. You should provide deep, insightful analysis, use professional terminology, and focus on market viability and strategic positioning.' },
  ];
  selectedPersonaId = signal<string>(this.personas[1].id);
  selectedAntithesisPersonaId = signal<string>(this.personas[2].id);

  constructor() {
    this.isDarkMode.set(this.getInitialTheme());

    effect(() => {
      const isDark = this.isDarkMode();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (this.stage) {
        this.updateCanvasTheme();
      }
    });
  }

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  private getInitialTheme(): boolean {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark on server or if window is undefined
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
  }

  generationOptions: GenerationOption[] = [
    {
      id: 'EXPAND',
      title: 'Expand Concepts',
      description: 'Generate diverse and non-obvious ideas from your seed concept.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`
    },
    {
      id: 'RISKS',
      title: 'Analyze Risks',
      description: 'Identify potential pitfalls, challenges, and risks for your idea.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`
    },
    {
      id: 'RESEARCH',
      title: 'Web Research',
      description: 'Use Google Search to find relevant, up-to-date information.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>`
    },
    {
      id: 'REFINE',
      title: 'Refine Concept',
      description: 'Iteratively improve concepts based on feedback or criteria.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.5 18.75l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L18.75 18.75l-1.188.648a2.25 2.25 0 01-1.423 1.423z" /></svg>`
    },
    {
      id: 'SWOT',
      title: 'SWOT Analysis',
      description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125a1.125 1.125 0 00-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>`
    },

    {
      id: 'PARADOX',
      title: 'Paraconsistent Synthesis',
      description: 'Discover pluriversal features by resolving conceptual paradoxes via Z-Axis inference.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>`
    },
    {
      id: 'DIALECTIC',
      title: 'Dialectical Synthesis',
      description: 'Generate opposing concepts from two personas and synthesize them (MADS).',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>`
    },

    {
      id: 'ZACHMAN',
      title: 'Zachman Framework Schema',
      description: 'Generate a deterministic system-first specification mapped to the Zachman Framework.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`
    },
    {
      id: 'RAG_SYNTHESIS',
      title: 'Reflector Synthesis (RAG)',
      description: 'Analyze existing canvas concepts (context) to generate a synthesized answer with citations.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`
    },
  ];

  selectOption(optionId: GenerationType) {
    this.selectedOption.set(optionId);
  }

  async generate() {
    if (!this.idea() || this.isLoading()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.results.set(null);

    try {
      const selectedPersona = this.personas.find(p => p.id === this.selectedPersonaId());
      const personaInstruction = selectedPersona ? selectedPersona.instruction : this.personas[0].instruction;

      const selectedAntithesisPersona = this.personas.find(p => p.id === this.selectedAntithesisPersonaId());
      const secondaryPersonaInstruction = selectedAntithesisPersona ? selectedAntithesisPersona.instruction : this.personas[0].instruction;

      const generatedConcepts = await this.geminiService.generateConcepts(
        this.idea(),
        this.selectedOption(),
        personaInstruction,
        this.selectedOption() === 'DIALECTIC' ? secondaryPersonaInstruction : undefined,
        this.getCanvasContext()
      );
      this.results.set(generatedConcepts);
    } catch (e) {
      console.error(e);
      this.error.set(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  copyToClipboard(text: string, index: number) {
    if (!navigator.clipboard) {
      console.error('Clipboard API not available.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      this.copiedConceptIndex.set(index);
      setTimeout(() => {
        if (this.copiedConceptIndex() === index) {
          this.copiedConceptIndex.set(null);
        }
      }, 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }


  getCanvasContext(): string {
    const context: any[] = [];
    Object.values(this.canvasNodes).forEach((node: any) => {
      const data = node.getAttr('conceptData');
      if (data) {
        context.push({ id: data.id, title: data.title, content: data.content });
      }
    });
    return JSON.stringify(context);
  }

  // --- Playground Canvas Methods ---

  private initializeCanvas() {
    const container = this.playgroundContainer.nativeElement;
    this.stage = new Konva.Stage({
      container: container,
      width: container.offsetWidth,
      height: container.offsetHeight,
      draggable: true,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.updateCanvasTheme(); // Set initial theme

    // Clear state on re-init
    this.canvasNodes = {};
    this.canvasEdges.forEach(edge => edge.destroy());
    this.canvasEdges = [];

    this.stage.on('wheel', (e: any) => {
      e.evt.preventDefault();
      const oldScale = this.stage.scaleX();
      const pointer = this.stage.getPointerPosition();
      if (!pointer) return;
      
      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.05;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.stage.position(newPos);
    });
  }

  private updateCanvasTheme() {
    const isDark = this.isDarkMode();
    const bg = isDark ? '#111827' : '#f3f4f6'; // gray-900 or gray-100
    this.stage.container().style.backgroundColor = bg;

    this.layer.find('Rect').forEach((rect: any) => {
        rect.fill(isDark ? '#1f2937' : '#ffffff'); // gray-800 or white
        rect.stroke(isDark ? '#4b5563' : '#e5e7eb'); // gray-600 or gray-200
    });

    this.layer.find('Text').forEach((text: any) => {
        if (text.name() === 'title') {
            text.fill(isDark ? '#e5e7eb' : '#111827'); // gray-200 or gray-900
        } else if (text.name() === 'content') {
            text.fill(isDark ? '#9ca3af' : '#4b5563'); // gray-400 or gray-600
        }
    });
  }

  onDragStart(event: DragEvent, concept: Concept) {
    event.dataTransfer?.setData('application/json', JSON.stringify(concept));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necessary to allow dropping
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.stage) return;

    // Calculate pointer position relative to the stage's transformations
    const containerRect = this.stage.container().getBoundingClientRect();
    const absoluteX = event.clientX - containerRect.left;
    const absoluteY = event.clientY - containerRect.top;

    const scale = this.stage.scaleX();
    const stagePos = this.stage.position();

    const relativePos = {
      x: (absoluteX - stagePos.x) / scale,
      y: (absoluteY - stagePos.y) / scale,
    };

    const conceptData = event.dataTransfer?.getData('application/json');
    if (!conceptData) return;

    try {
      const concept: Concept = JSON.parse(conceptData);

      // Auto-render seed node if canvas is empty and dropped concept is a direct child
      if (Object.keys(this.canvasNodes).length === 0 && (concept.parentId === 'seed' || (Array.isArray(concept.parentId) && concept.parentId.includes('seed')))) {
         this.createConceptCard(
             { id: 'seed', title: 'Seed Idea', content: this.idea() },
             { x: relativePos.x - 300, y: relativePos.y }
         );
      }

      this.createConceptCard(concept, relativePos);
    } catch (e) {
      console.error('Failed to parse dropped concept data:', e);
    }
  }

  private createConceptCard(concept: Concept, position: { x: number; y: number }) {
    if (!concept || typeof concept.title !== 'string' || typeof concept.content !== 'string') {
      console.error('Attempted to create a card with invalid concept data:', concept);
      return;
    }

    // Check if node already exists
    if (concept.id && this.canvasNodes[concept.id]) {
        return; // Prevent duplicate rendering
    }

    // Fallback ID if missing
    const id = concept.id || Math.random().toString(36).substring(2, 9);

      
    const cardWidth = 250;
    const padding = 12;
    const isDark = this.isDarkMode();

    const group = new Konva.Group({
        id: id,
        x: position.x,
        y: position.y,
        draggable: true,
    });

    // Store metadata
    group.setAttr('conceptData', concept);

    group.on('dragmove', () => {
       this.updateEdges();
    });
    group.on('dragend', () => {
       this.updateEdges();
    });


    const title = new Konva.Text({
        name: 'title',
        text: concept.title,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        fill: isDark ? '#e5e7eb' : '#111827',
        padding: padding,
        width: cardWidth,
    });

    const content = new Konva.Text({
        name: 'content',
        text: concept.content,
        y: title.height(),
        fontSize: 12,
        fontFamily: 'sans-serif',
        fill: isDark ? '#9ca3af' : '#4b5563',
        padding: padding,
        width: cardWidth,
    });

    const background = new Konva.Rect({
        width: cardWidth,
        height: title.height() + content.height(),
        fill: isDark ? '#1f2937' : '#ffffff',
        stroke: isDark ? '#4b5563' : '#e5e7eb',
        strokeWidth: 1,
        cornerRadius: 8,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.15,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
    });

    group.add(background, title, content);
    this.layer.add(group);

    this.canvasNodes[id] = group;
    this.updateEdges();
  }

  private updateEdges() {
      // Clear existing edges
      this.canvasEdges.forEach(edge => edge.destroy());
      this.canvasEdges = [];

      const isDark = this.isDarkMode();
      const strokeColor = isDark ? '#6b7280' : '#9ca3af';

      Object.values(this.canvasNodes).forEach(node => {
          const conceptData = node.getAttr('conceptData');
          if (!conceptData || !conceptData.parentId) return;

          let parentIds: string[] = [];
          if (Array.isArray(conceptData.parentId)) {
              parentIds = conceptData.parentId;
          } else {
              parentIds = [conceptData.parentId];
          }

          parentIds.forEach(pId => {
             const parentNode = this.canvasNodes[pId];
             if (parentNode) {
                 // Calculate centers
                 const pRect = parentNode.find('Rect')[0];
                 const cRect = node.find('Rect')[0];

                 const pWidth = pRect.width();
                 const pHeight = pRect.height();
                 const cWidth = cRect.width();
                 const cHeight = cRect.height();

                 const px = parentNode.x() + pWidth; // Right edge of parent
                 const py = parentNode.y() + (pHeight / 2);
                 const cx = node.x(); // Left edge of child
                 const cy = node.y() + (cHeight / 2);

                 // Draw line
                 const arrow = new Konva.Arrow({
                     points: [px, py, cx, cy],
                     pointerLength: 10,
                     pointerWidth: 10,
                     fill: strokeColor,
                     stroke: strokeColor,
                     strokeWidth: 2,
                 });

                 this.layer.add(arrow);
                 // Send to back so lines draw under cards
                 arrow.moveToBottom();
                 this.canvasEdges.push(arrow);
             }
          });
      });
  }
}