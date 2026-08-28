import { getProject } from "../src/data/catalog";
import { answer, buildBrain } from "../src/chat/answer";

const project = getProject("iam");
if (!project) throw new Error("iam project missing");
const brain = buildBrain(project);

const questions = [
  "What is blocked?",
  "How are we doing?",
  "What should we do first?",
  "What is on the roadmap?",
  "How does the architecture work?",
  "Where is it deployed?",
  "Who owns the IAM service?",
  "Tell me about RSH-3042",
  "How many issues are unassigned?",
  "What spilled over from the last sprint?",
  "What is Keycloak used for?",
  "What is the token lifetime setting?",
  "How do users log in?",
  "What is the price of tea in China?",
];

for (const question of questions) {
  const reply = answer(brain, question);
  console.log(`\n=== ${question}`);
  for (const block of reply.blocks) {
    if (block.kind === "text") {
      console.log(`  ${block.text.slice(0, 300)}`);
    } else {
      for (const item of block.items.slice(0, 5)) {
        console.log(`   - ${item.title}${item.detail ? ` :: ${item.detail.slice(0, 120)}` : ""}`);
      }
    }
  }
  if (reply.sources.length) {
    console.log(`  [sources] ${reply.sources.map((s) => s.label).join(", ")}`);
  }
}
