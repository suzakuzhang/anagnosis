export type ReadingMode = "beginner" | "scholar" | "roam" | "notes";

export interface ArtistInfo {
  name: string;
  short_name?: string;
  dates: string;
  origin?: string;
  context?: string;
}

export interface Painting {
  id: string;
  title: string;
  alt_titles?: string[];
  artist: ArtistInfo;
  series?: string | null;
  series_part?: string | null;
  image_path: string;
  thumbnail_path?: string;
  medium: string;
  dimensions: string;
  format: string;
  collection: string;
  approximate_date?: string;
  dated?: boolean;

  visible_elements: string;
  composition_notes: string;
  form_and_technique: string;
  inscriptions_and_text?: string;

  source_text?: string;
  iconographic_ids?: string[];
  symbolic_details?: string[];
  cultural_framing_box?: string;
  departure_from_source?: string;
  patron_commission?: string;
  painter_innovation?: string;
  political_subtext?: string;

  subject_class: string[];
  reading_lenses: string[];
  emotional_field: string[];
  research_notes?: string;
}

export interface SkeletonPainting {
  id: string;
  title: string;
  image: string;
  collection: string;
  dated?: string;
}

export interface CorpusAnchor {
  name: string;
  meaning: string;
  primary_method: {
    author: string;
    title: string;
    publisher: string;
    year: number;
    isbn13?: string;
  };
  supplementary_methods: {
    author: string;
    title: string;
    year: number;
    role: string;
  }[];
  method_summary: string;
  research_apparatus_note: string;
}

export interface CorpusMeta {
  name: string;
  description: string;
  period_span: string;
  geography: string;
  seed_size: number;
  last_updated: string;
}

export interface PaintingsCorpus {
  schema_version: number;
  corpus_meta: CorpusMeta;
  anchor: CorpusAnchor;
  paintings: Painting[];
  skeleton_paintings_to_add_later?: SkeletonPainting[];
}

export interface InterpretationResult {
  first_glance: string;
  viewing_path: string;
  brushwork_and_space: string;
  inscriptions_and_seals: string;
  symbol_and_context: string;
  emotional_field: string;
  follow_up_questions: string[];
}

export interface ResearchNotesResult {
  markdown: string;
}

export interface RoamResult {
  entry_point: string;
  walk_through: string;
  visual_anchor_back: string;
}
