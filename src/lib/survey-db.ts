import { pool } from "./db";

let schemaReady: Promise<void> | null = null;

export function ensureSurveySchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS survey_responses (
          id SERIAL PRIMARY KEY,
          child_name TEXT NOT NULL,
          parent_name TEXT,
          hopes TEXT NOT NULL,
          discussion_topics TEXT,
          identity_struggles TEXT,
          practice_habits TEXT[] NOT NULL DEFAULT '{}',
          priority_topics TEXT[] NOT NULL DEFAULT '{}',
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS discussion_topics TEXT;
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS identity_struggles TEXT;
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS practice_habits TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS priority_topics TEXT[] NOT NULL DEFAULT '{}';
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS priorities;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS engagement;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS notes;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS sikhi_practice;
        ALTER TABLE survey_responses DROP COLUMN IF EXISTS relevance_idea;`,
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

export type SurveyResponse = {
  id: number;
  childName: string;
  parentName: string | null;
  hopes: string;
  discussionTopics: string | null;
  identityStruggles: string | null;
  practiceHabits: string[];
  priorityTopics: string[];
  submittedAt: string;
};

type SurveyRow = {
  id: number;
  child_name: string;
  parent_name: string | null;
  hopes: string;
  discussion_topics: string | null;
  identity_struggles: string | null;
  practice_habits: string[];
  priority_topics: string[];
  submitted_at: string;
};

function rowToResponse(row: SurveyRow): SurveyResponse {
  return {
    id: row.id,
    childName: row.child_name,
    parentName: row.parent_name,
    hopes: row.hopes,
    discussionTopics: row.discussion_topics,
    identityStruggles: row.identity_struggles,
    practiceHabits: row.practice_habits ?? [],
    priorityTopics: row.priority_topics ?? [],
    submittedAt: row.submitted_at,
  };
}

export async function createSurveyResponse(input: {
  childName: string;
  parentName: string | null;
  hopes: string;
  discussionTopics: string | null;
  identityStruggles: string | null;
  practiceHabits: string[];
  priorityTopics: string[];
}): Promise<SurveyResponse> {
  await ensureSurveySchema();
  const result = await pool.query<SurveyRow>(
    `INSERT INTO survey_responses
       (child_name, parent_name, hopes, discussion_topics, identity_struggles, practice_habits, priority_topics)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.childName,
      input.parentName,
      input.hopes,
      input.discussionTopics,
      input.identityStruggles,
      input.practiceHabits,
      input.priorityTopics,
    ],
  );
  return rowToResponse(result.rows[0]);
}

export async function listSurveyResponses(): Promise<SurveyResponse[]> {
  await ensureSurveySchema();
  const result = await pool.query<SurveyRow>(
    "SELECT * FROM survey_responses ORDER BY submitted_at DESC",
  );
  return result.rows.map(rowToResponse);
}
