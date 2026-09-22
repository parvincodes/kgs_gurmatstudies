import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  Tool,
  ToolResultBlockParam,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources/messages";

// Root of the bundled japji-sahib Claude skill (SKILL.md + references/*.md),
// copied in from https://github.com/parvincodes/jap-ji-baani-skill. The whole
// point of that skill is that every interpretive claim traces back to a real,
// attributed scholar — this agent gives Claude tool access to read the actual
// files on demand (the same way Claude Code would) instead of us pre-picking
// which files are "relevant" with a keyword guess.
const SKILL_ROOT = path.join(process.cwd(), "src/content/japji-sahib");

function listReferenceFiles(): string[] {
  const dir = path.join(SKILL_ROOT, "references");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => `references/${f}`);
}

function readSkillFile(relativePath: string): string {
  const resolved = path.normalize(path.join(SKILL_ROOT, relativePath));
  const root = path.normalize(SKILL_ROOT + path.sep);
  if (!resolved.startsWith(root)) {
    throw new Error(`Path outside the skill's references folder: ${relativePath}`);
  }
  return fs.readFileSync(resolved, "utf8");
}

const READ_FILE_TOOL: Tool = {
  name: "read_japji_file",
  description:
    "Read one file from the japji-sahib skill by its path relative to the skill root " +
    "(e.g. 'SKILL.md', 'references/coverage-status.md', 'references/japji-gurmukhi-full.md', " +
    "'references/pauri-18.md'). Call this before citing any file's content — nothing is " +
    "preloaded.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Path relative to the skill root, e.g. references/pauri-02.md",
      },
    },
    required: ["path"],
  },
};

function buildSystemPrompt(): string {
  const skillInstructions = readSkillFile("SKILL.md");
  const availableFiles = ["references/japji-gurmukhi-full.md", "references/coverage-status.md", ...listReferenceFiles()];
  const uniqueFiles = Array.from(new Set(availableFiles));

  return `You are the Japji Sahib assistant inside the study-materials chat widget on the Khalsa Gurmat School study portal (a real website visited by students, teachers, and parents). A visitor's message has been routed to you because it looked like it was about Japji Sahib.

You are built on a Claude skill called "japji-sahib". Its full instructions are reproduced below verbatim — follow them exactly, especially the rule that every interpretive claim must trace back to a real, attributed scholar in the resource set, and that you must say plainly when a scholar's reading isn't available rather than generating something plausible-sounding.

None of the skill's reference files are preloaded in this conversation. Use the read_japji_file tool to fetch each one before citing it, exactly as the instructions below describe (look up the Gurmukhi text, check coverage-status.md, then read the relevant pauri-NN.md).

Files available to read via the tool:
${uniqueFiles.map((f) => `- ${f}`).join("\n")}

Unlike a coding assistant, your output here is a chat bubble on a public website. Keep answers conversational and reasonably concise (a few short paragraphs at most), while still showing the Gurmukhi and attributing each scholar by name as the instructions require. If the visitor's question turns out not to be about Japji Sahib after all, say so briefly and suggest they use the regular search for study materials instead.

--- BEGIN japji-sahib SKILL.md ---
${skillInstructions}
--- END japji-sahib SKILL.md ---`;
}

const MAX_TOOL_ROUNDS = 6;
const MODEL = "claude-sonnet-5";

export type JapjiChatTurn = { role: "user" | "assistant"; content: string };

export async function answerJapjiQuestion(
  userMessage: string,
  history: JapjiChatTurn[] = [],
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "The Japji Sahib assistant isn't set up yet on this deployment — a teacher needs to add an ANTHROPIC_API_KEY. In the meantime, try the regular study-materials search above.";
  }

  const client = new Anthropic({ apiKey });
  const system = buildSystemPrompt();
  const messages: MessageParam[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: userMessage },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      tools: [READ_FILE_TOOL],
      messages,
    });

    const toolUses = response.content.filter(
      (block): block is ToolUseBlock => block.type === "tool_use",
    );

    if (toolUses.length === 0) {
      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();
      return text || "I couldn't find an answer to that in the Japji Sahib skill.";
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: ToolResultBlockParam[] = toolUses.map((toolUse) => {
      const requestedPath = String((toolUse.input as { path?: unknown }).path ?? "");
      try {
        const content = readSkillFile(requestedPath);
        return { type: "tool_result", tool_use_id: toolUse.id, content };
      } catch (error) {
        return {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: `Error reading "${requestedPath}": ${(error as Error).message}`,
          is_error: true,
        };
      }
    });
    messages.push({ role: "user", content: toolResults });
  }

  return "That question needs more looking-up across the Japji Sahib sources than I can finish right now — try asking about one specific pauri, or rephrase it.";
}
