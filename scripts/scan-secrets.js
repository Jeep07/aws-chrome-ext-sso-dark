const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");

const SECRET_PATTERNS = [
  {
    name: "AWS access key",
    pattern: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    name: "AWS secret access key assignment",
    pattern:
      /\baws_secret_access_key\b\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/gi,
  },
  {
    name: "GitHub token",
    pattern: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,255}\b/g,
  },
  {
    name: "GitHub fine-grained token",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g,
  },
  {
    name: "Private key block",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    name: "Slack token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,255}\b/g,
  },
];

const SKIPPED_PATHS = new Set(["package-lock.json"]);

function listTrackedFiles() {
  const output = execFileSync("git", ["ls-files", "-z"], {
    encoding: "utf8",
  });

  return output.split("\0").filter(Boolean);
}

function findSecretMatches(filePath) {
  if (SKIPPED_PATHS.has(filePath)) {
    return [];
  }

  const content = readFileSync(filePath, "utf8");
  const findings = [];

  for (const { name, pattern } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;

    for (const match of content.matchAll(pattern)) {
      const line = content.slice(0, match.index).split("\n").length;
      findings.push(`${filePath}:${line} ${name}`);
    }
  }

  return findings;
}

const findings = listTrackedFiles().flatMap(findSecretMatches);

if (findings.length > 0) {
  console.error("Potential secrets found:");
  console.error(findings.map((finding) => `- ${finding}`).join("\n"));
  process.exit(1);
}

console.log("No obvious secrets found.");
