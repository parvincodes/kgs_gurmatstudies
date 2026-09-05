import { pool, ensureSchema } from "./db";
import type { Subject } from "./materials";

export type MaterialStatus = "pending" | "approved" | "flagged";

export type MaterialRecord = {
  id: number;
  pathname: string;
  url: string;
  subject: Subject;
  title: string;
  description: string;
  size: number;
  status: MaterialStatus;
  uploadedBy: string | null;
  uploadedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
};

type MaterialRow = {
  id: number;
  pathname: string;
  url: string;
  subject: string;
  title: string;
  description: string;
  size: string | number;
  status: string;
  uploaded_by: string | null;
  uploaded_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
};

function rowToRecord(row: MaterialRow): MaterialRecord {
  return {
    id: row.id,
    pathname: row.pathname,
    url: row.url,
    subject: row.subject as Subject,
    title: row.title,
    description: row.description,
    size: Number(row.size),
    status: row.status as MaterialStatus,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
  };
}

export async function listMaterials(
  status?: MaterialStatus,
): Promise<MaterialRecord[]> {
  await ensureSchema();
  const result = status
    ? await pool.query<MaterialRow>(
        "SELECT * FROM materials WHERE status = $1 ORDER BY uploaded_at DESC",
        [status],
      )
    : await pool.query<MaterialRow>(
        "SELECT * FROM materials ORDER BY uploaded_at DESC",
      );
  return result.rows.map(rowToRecord);
}

export async function createMaterial(input: {
  pathname: string;
  url: string;
  subject: string;
  title: string;
  size: number;
  uploadedBy: string | null;
}): Promise<MaterialRecord> {
  await ensureSchema();
  const result = await pool.query<MaterialRow>(
    `INSERT INTO materials (pathname, url, subject, title, size, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.pathname,
      input.url,
      input.subject,
      input.title,
      input.size,
      input.uploadedBy,
    ],
  );
  return rowToRecord(result.rows[0]);
}

export async function updateMaterialDetails(
  id: number,
  title: string,
  description: string,
): Promise<MaterialRecord | null> {
  await ensureSchema();
  const result = await pool.query<MaterialRow>(
    "UPDATE materials SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id],
  );
  return result.rows[0] ? rowToRecord(result.rows[0]) : null;
}

export async function reviewMaterial(
  id: number,
  status: "approved" | "flagged",
  reviewedBy: string,
  reviewNote: string,
): Promise<MaterialRecord | null> {
  await ensureSchema();
  const result = await pool.query<MaterialRow>(
    `UPDATE materials
     SET status = $1, reviewed_by = $2, reviewed_at = now(), review_note = $3
     WHERE id = $4
     RETURNING *`,
    [status, reviewedBy || null, reviewNote || null, id],
  );
  return result.rows[0] ? rowToRecord(result.rows[0]) : null;
}

export async function deleteMaterialById(
  id: number,
): Promise<MaterialRecord | null> {
  await ensureSchema();
  const result = await pool.query<MaterialRow>(
    "DELETE FROM materials WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] ? rowToRecord(result.rows[0]) : null;
}
