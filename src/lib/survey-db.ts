import { pool } from "./db";

let schemaReady: Promise<void> | null = null;

export function ensureSurveySchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS survey_responses (
          id SERIAL PRIMARY KEY,
          survey_wave TEXT NOT NULL DEFAULT '',
          child_name TEXT NOT NULL,
          parent_name TEXT,
          hopes_selected TEXT[] NOT NULL DEFAULT '{}',
          hopes_other TEXT,
          discussion_selected TEXT[] NOT NULL DEFAULT '{}',
          discussion_other TEXT,
          struggles_selected TEXT[] NOT NULL DEFAULT '{}',
          struggles_other TEXT,
          practice_habits TEXT[] NOT NULL DEFAULT '{}',
          priority_topics TEXT[] NOT NULL DEFAULT '{}',
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS survey_wave TEXT NOT NULL DEFAULT '';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS hopes_selected TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS hopes_other TEXT;
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS discussion_selected TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS discussion_other TEXT;
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS struggles_selected TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS struggles_other TEXT;
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS practice_habits TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS priority_topics TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS hopes;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS discussion_topics;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS identity_struggles;
        DROP INDEX IF EXISTS survey_responses_one_per_child_per_wave;
        CREATE UNIQUE INDEX IF NOT EXISTS survey_responses_one_per_child_per_wave_v2
          ON survey_responses (survey_wave, lower(regexp_replace(trim(child_name), '\\s+', ' ', 'g')));`,
      )
      .then(() => undefined)
      .catch((error) => {
        console.error("[survey-db] failed to create schema:", error);
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

export class DuplicateChildError extends Error {
  constructor(childName: string) {
    super(`A response for "${childName}" was already submitted this wave.`);
    this.name = "DuplicateChildError";
  }
}

export type SurveyResponse = {
  id: number;
  surveyWave: string;
  childName: string;
  parentName: string | null;
  hopesSelected: string[];
  hopesOther: string | null;
  discussionSelected: string[];
  discussionOther: string | null;
  strugglesSelected: string[];
  strugglesOther: string | null;
  practiceHabits: string[];
  priorityTopics: string[];
  submittedAt: string;
};

type SurveyRow = {
  id: number;
  survey_wave: string;
  child_name: string;
  parent_name: string | null;
  hopes_selected: string[];
  hopes_other: string | null;
  discussion_selected: string[];
  discussion_other: string | null;
  struggles_selected: string[];
  struggles_other: string | null;
  practice_habits: string[];
  priority_topics: string[];
  submitted_at: string;
};

function rowToResponse(row: SurveyRow): SurveyResponse {
  return {
    id: row.id,
    surveyWave: row.survey_wave,
    childName: row.child_name,
    parentName: row.parent_name,
    hopesSelected: row.hopes_selected ?? [],
    hopesOther: row.hopes_other,
    discussionSelected: row.discussion_selected ?? [],
    discussionOther: row.discussion_other,
    strugglesSelected: row.struggles_selected ?? [],
    strugglesOther: row.struggles_other,
    practiceHabits: row.practice_habits ?? [],
    priorityTopics: row.priority_topics ?? [],
    submittedAt: row.submitted_at,
  };
}

export async function createSurveyResponse(input: {
  surveyWave: string;
  childName: string;
  parentName: string | null;
  hopesSelected: string[];
  hopesOther: string | null;
  discussionSelected: string[];
  discussionOther: string | null;
  strugglesSelected: string[];
  strugglesOther: string | null;
  practiceHabits: string[];
  priorityTopics: string[];
}): Promise<SurveyResponse> {
  await ensureSurveySchema();
  try {
    const result = await pool.query<SurveyRow>(
      `INSERT INTO survey_responses
         (survey_wave, child_name, parent_name, hopes_selected, hopes_other, discussion_selected,
          discussion_other, struggles_selected, struggles_other, practice_habits, priority_topics)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        input.surveyWave,
        input.childName,
        input.parentName,
        input.hopesSelected,
        input.hopesOther,
        input.discussionSelected,
        input.discussionOther,
        input.strugglesSelected,
        input.strugglesOther,
        input.practiceHabits,
        input.priorityTopics,
      ],
    );
    return rowToResponse(result.rows[0]);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      throw new DuplicateChildError(input.childName);
    }
    throw error;
  }
}

export async function listSurveyResponses(wave?: string): Promise<SurveyResponse[]> {
  await ensureSurveySchema();
  const result = wave
    ? await pool.query<SurveyRow>(
        "SELECT * FROM survey_responses WHERE survey_wave = $1 ORDER BY submitted_at DESC",
        [wave],
      )
    : await pool.query<SurveyRow>(
        "SELECT * FROM survey_responses ORDER BY submitted_at DESC",
      );
  return result.rows.map(rowToResponse);
}
