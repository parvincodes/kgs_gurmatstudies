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
          priorities TEXT[] NOT NULL DEFAULT '{}',
          engagement INT,
          relevance_idea TEXT,
          notes TEXT,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`,
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
  priorities: string[];
  engagement: number | null;
  relevanceIdea: string | null;
  notes: string | null;
  submittedAt: string;
};

type SurveyRow = {
  id: number;
  child_name: string;
  parent_name: string | null;
  hopes: string;
  priorities: string[];
  engagement: number | null;
  relevance_idea: string | null;
  notes: string | null;
  submitted_at: string;
};

function rowToResponse(row: SurveyRow): SurveyResponse {
  return {
    id: row.id,
    childName: row.child_name,
    parentName: row.parent_name,
    hopes: row.hopes,
    priorities: row.priorities ?? [],
    engagement: row.engagement,
    relevanceIdea: row.relevance_idea,
    notes: row.notes,
    submittedAt: row.submitted_at,
  };
}

export async function createSurveyResponse(input: {
  childName: string;
  parentName: string | null;
  hopes: string;
  priorities: string[];
  engagement: number | null;
  relevanceIdea: string | null;
  notes: string | null;
}): Promise<SurveyResponse> {
  await ensureSurveySchema();
  const result = await pool.query<SurveyRow>(
    `INSERT INTO survey_responses
       (child_name, parent_name, hopes, priorities, engagement, relevance_idea, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.childName,
      input.parentName,
      input.hopes,
      input.priorities,
      input.engagement,
      input.relevanceIdea,
      input.notes,
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
